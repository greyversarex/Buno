"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPrice = exports.initializeExchangeRates = exports.updateExchangeRate = exports.getExchangeRatesMap = exports.getExchangeRates = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getExchangeRates = async (req, res) => {
    try {
        const rates = await prisma.exchangeRate.findMany({
            where: { isActive: true },
            orderBy: { currency: 'asc' }
        });
        res.json({
            success: true,
            data: rates
        });
    }
    catch (error) {
        console.error('Error fetching exchange rates:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении курсов валют'
        });
    }
};
exports.getExchangeRates = getExchangeRates;
const getExchangeRatesMap = async (req, res) => {
    try {
        const rates = await prisma.exchangeRate.findMany({
            where: { isActive: true }
        });
        const ratesMap = {};
        rates.forEach(rate => {
            ratesMap[rate.currency] = {
                rate: rate.rate,
                symbol: rate.symbol,
                name: rate.name
            };
        });
        res.json({
            success: true,
            data: ratesMap
        });
    }
    catch (error) {
        console.error('Error fetching exchange rates map:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении курсов валют'
        });
    }
};
exports.getExchangeRatesMap = getExchangeRatesMap;
const updateExchangeRate = async (req, res) => {
    try {
        const { currency } = req.params;
        const { rate, symbol, name } = req.body;
        const updatedRate = await prisma.exchangeRate.upsert({
            where: { currency },
            update: {
                rate,
                symbol,
                name,
                updatedAt: new Date()
            },
            create: {
                currency,
                rate,
                symbol,
                name,
                isActive: true
            }
        });
        res.json({
            success: true,
            message: 'Курс валюты обновлен',
            data: updatedRate
        });
    }
    catch (error) {
        console.error('Error updating exchange rate:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении курса валюты'
        });
    }
};
exports.updateExchangeRate = updateExchangeRate;
const initializeExchangeRates = async (req, res) => {
    try {
        const defaultRates = [
            {
                currency: 'TJS',
                rate: 1,
                symbol: 'SM',
                name: 'Сомони',
                isActive: true
            },
            {
                currency: 'USD',
                rate: 0.091,
                symbol: '$',
                name: 'Доллар США',
                isActive: true
            },
            {
                currency: 'EUR',
                rate: 0.084,
                symbol: '€',
                name: 'Евро',
                isActive: true
            },
            {
                currency: 'RUB',
                rate: 0.11,
                symbol: '₽',
                name: 'Российский рубль',
                isActive: true
            },
            {
                currency: 'CNY',
                rate: 0.758,
                symbol: '¥',
                name: 'Китайский юань',
                isActive: true
            }
        ];
        const existingRates = await prisma.exchangeRate.count();
        if (existingRates > 0) {
            res.json({
                success: true,
                message: 'Курсы валют уже инициализированы'
            });
            return;
        }
        const createdRates = await prisma.exchangeRate.createMany({
            data: defaultRates
        });
        res.json({
            success: true,
            message: `Инициализировано ${createdRates.count} курсов валют`,
            data: defaultRates
        });
    }
    catch (error) {
        console.error('Error initializing exchange rates:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при инициализации курсов валют'
        });
    }
};
exports.initializeExchangeRates = initializeExchangeRates;
const convertPrice = async (req, res) => {
    try {
        const { amount, targetCurrency } = req.query;
        if (!amount || !targetCurrency) {
            res.status(400).json({
                success: false,
                message: 'Необходимо указать amount и targetCurrency'
            });
            return;
        }
        const rate = await prisma.exchangeRate.findUnique({
            where: {
                currency: targetCurrency,
                isActive: true
            }
        });
        if (!rate) {
            res.status(404).json({
                success: false,
                message: 'Валюта не найдена'
            });
            return;
        }
        const tjsAmount = parseFloat(amount);
        const convertedAmount = tjsAmount * rate.rate;
        res.json({
            success: true,
            data: {
                originalAmount: tjsAmount,
                originalCurrency: 'TJS',
                convertedAmount: Math.round(convertedAmount * 100) / 100,
                targetCurrency: rate.currency,
                symbol: rate.symbol,
                rate: rate.rate
            }
        });
    }
    catch (error) {
        console.error('Error converting price:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при конвертации цены'
        });
    }
};
exports.convertPrice = convertPrice;
//# sourceMappingURL=exchangeRateController.js.map