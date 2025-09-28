"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTourPrice = exports.initializeDefaults = exports.deleteComponent = exports.updateComponent = exports.createComponent = exports.getComponentByKey = exports.getComponentById = exports.getAllComponents = void 0;
const models_1 = require("../models");
const getAllComponents = async (req, res) => {
    try {
        const components = await models_1.PriceCalculatorModel.findAll();
        res.json({
            success: true,
            data: components
        });
    }
    catch (error) {
        console.error('Error fetching pricing components:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при загрузке компонентов цен'
        });
    }
};
exports.getAllComponents = getAllComponents;
const getComponentById = async (req, res) => {
    try {
        const { id } = req.params;
        const allComponents = await models_1.PriceCalculatorModel.findAll();
        const component = allComponents.find(c => c.id === parseInt(id));
        if (!component) {
            res.status(404).json({
                success: false,
                message: 'Компонент не найден'
            });
            return;
        }
        res.json({
            success: true,
            data: component
        });
    }
    catch (error) {
        console.error('Error fetching pricing component by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при загрузке компонента'
        });
    }
};
exports.getComponentById = getComponentById;
const getComponentByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const component = await models_1.PriceCalculatorModel.findByKey(key);
        if (!component) {
            res.status(404).json({
                success: false,
                message: 'Компонент не найден'
            });
            return;
        }
        res.json({
            success: true,
            data: component
        });
    }
    catch (error) {
        console.error('Error fetching pricing component by key:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при загрузке компонента'
        });
    }
};
exports.getComponentByKey = getComponentByKey;
const createComponent = async (req, res) => {
    try {
        const { key, category, name, price, unit, description, sortOrder } = req.body;
        if (!key || !category || !name || price === undefined || !unit) {
            res.status(400).json({
                success: false,
                message: 'Все обязательные поля должны быть заполнены'
            });
            return;
        }
        const component = await models_1.PriceCalculatorModel.create({
            key,
            category,
            name,
            price: parseFloat(price),
            unit,
            description,
            sortOrder: sortOrder || 0
        });
        res.status(201).json({
            success: true,
            data: component,
            message: 'Компонент успешно создан'
        });
    }
    catch (error) {
        console.error('Error creating pricing component:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании компонента'
        });
    }
};
exports.createComponent = createComponent;
const updateComponent = async (req, res) => {
    const { id } = req.params;
    const { name, price, unit, description, sortOrder, isActive } = req.body;
    console.log(`🔄 Attempting to update component ${id} with price ${price}`);
    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount <= maxRetries) {
        try {
            const component = await models_1.PriceCalculatorModel.update(parseInt(id), {
                name,
                price: price !== undefined ? parseFloat(price) : undefined,
                unit,
                description,
                sortOrder,
                isActive
            });
            console.log(`✅ Component ${id} updated successfully on attempt ${retryCount + 1}`);
            res.json({
                success: true,
                data: component,
                message: 'Компонент успешно обновлен'
            });
            return;
        }
        catch (error) {
            retryCount++;
            console.error(`❌ Attempt ${retryCount} failed for component ${id}:`, error.message);
            const isDbError = error.message?.includes('connection') ||
                error.message?.includes('terminating') ||
                error.code === 'P1001' || error.code === 'P1017';
            if (isDbError && retryCount <= maxRetries) {
                console.log(`🔄 Retrying in ${retryCount * 1000}ms... (attempt ${retryCount}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
                continue;
            }
            console.error('❌ All retry attempts failed or non-retryable error');
            res.status(500).json({
                success: false,
                message: retryCount > maxRetries ?
                    `Ошибка соединения с базой данных. Попробовано ${maxRetries} раз.` :
                    'Ошибка при обновлении компонента'
            });
            return;
        }
    }
};
exports.updateComponent = updateComponent;
const deleteComponent = async (req, res) => {
    try {
        const { id } = req.params;
        await models_1.PriceCalculatorModel.delete(parseInt(id));
        res.json({
            success: true,
            message: 'Компонент успешно удален'
        });
    }
    catch (error) {
        console.error('Error deleting pricing component:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении компонента'
        });
    }
};
exports.deleteComponent = deleteComponent;
const initializeDefaults = async (req, res) => {
    try {
        const components = await models_1.PriceCalculatorModel.initializeDefaults();
        res.json({
            success: true,
            data: components,
            message: `Инициализировано ${components.length} компонентов по умолчанию`
        });
    }
    catch (error) {
        console.error('Error initializing default components:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при инициализации компонентов по умолчанию'
        });
    }
};
exports.initializeDefaults = initializeDefaults;
const calculateTourPrice = async (req, res) => {
    try {
        const { components } = req.body;
        if (!components || !Array.isArray(components)) {
            res.status(400).json({
                success: false,
                message: 'Необходимо передать массив компонентов'
            });
            return;
        }
        let totalPrice = 0;
        const calculation = [];
        for (const comp of components) {
            const component = await models_1.PriceCalculatorModel.findByKey(comp.key);
            if (component) {
                const componentTotal = component.price * (comp.quantity || 1);
                totalPrice += componentTotal;
                calculation.push({
                    component: component.name,
                    price: component.price,
                    quantity: comp.quantity || 1,
                    unit: component.unit,
                    total: componentTotal
                });
            }
        }
        res.json({
            success: true,
            data: {
                totalPrice: Math.round(totalPrice * 100) / 100,
                currency: 'TJS',
                calculation
            }
        });
    }
    catch (error) {
        console.error('Error calculating tour price:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при расчете стоимости тура'
        });
    }
};
exports.calculateTourPrice = calculateTourPrice;
//# sourceMappingURL=priceCalculatorController.js.map