"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const database_1 = __importStar(require("../config/database"));
class CountryController {
    static async getAllCountries(req, res, next) {
        try {
            const countries = await (0, database_1.withRetry)(() => database_1.default.country.findMany({
                where: { isActive: true },
                include: {
                    cities: {
                        where: { isActive: true },
                        orderBy: { nameRu: 'asc' }
                    }
                },
                orderBy: { nameRu: 'asc' }
            }));
            const response = {
                success: true,
                data: countries,
                message: 'Countries retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getCountryById(req, res, next) {
        try {
            const { id } = req.params;
            const countryId = parseInt(id);
            if (isNaN(countryId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid country ID'
                });
            }
            const country = await (0, database_1.withRetry)(() => database_1.default.country.findUnique({
                where: { id: countryId },
                include: {
                    cities: {
                        where: { isActive: true },
                        orderBy: { nameRu: 'asc' }
                    }
                }
            }));
            if (!country) {
                return res.status(404).json({
                    success: false,
                    error: 'Country not found'
                });
            }
            const response = {
                success: true,
                data: country,
                message: 'Country retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createCountry(req, res, next) {
        try {
            const { name, nameRu, nameEn, nameTj, code, isActive = true } = req.body;
            if (!name || !nameRu || !nameEn || !nameTj || !code) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: name, nameRu, nameEn, nameTj, code'
                });
            }
            const country = await (0, database_1.withRetry)(() => database_1.default.country.create({
                data: {
                    name,
                    nameRu,
                    nameEn,
                    nameTj,
                    code,
                    isActive
                }
            }));
            const response = {
                success: true,
                data: country,
                message: 'Country created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({
                    success: false,
                    error: 'Country with this name or code already exists'
                });
            }
            return next(error);
        }
    }
    static async updateCountry(req, res, next) {
        try {
            const { id } = req.params;
            const countryId = parseInt(id);
            const { name, nameRu, nameEn, nameTj, code, isActive } = req.body;
            if (isNaN(countryId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid country ID'
                });
            }
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (nameRu !== undefined)
                updateData.nameRu = nameRu;
            if (nameEn !== undefined)
                updateData.nameEn = nameEn;
            if (nameTj !== undefined)
                updateData.nameTj = nameTj;
            if (code !== undefined)
                updateData.code = code;
            if (isActive !== undefined)
                updateData.isActive = isActive;
            const country = await (0, database_1.withRetry)(() => database_1.default.country.update({
                where: { id: countryId },
                data: updateData,
                include: {
                    cities: {
                        where: { isActive: true },
                        orderBy: { nameRu: 'asc' }
                    }
                }
            }));
            const response = {
                success: true,
                data: country,
                message: 'Country updated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Country not found'
                });
            }
            if (error.code === 'P2002') {
                return res.status(400).json({
                    success: false,
                    error: 'Country with this name or code already exists'
                });
            }
            return next(error);
        }
    }
    static async deleteCountry(req, res, next) {
        try {
            const { id } = req.params;
            const countryId = parseInt(id);
            if (isNaN(countryId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid country ID'
                });
            }
            await (0, database_1.withRetry)(() => database_1.default.country.delete({
                where: { id: countryId }
            }));
            const response = {
                success: true,
                data: null,
                message: 'Country deleted successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Country not found'
                });
            }
            return next(error);
        }
    }
}
exports.CountryController = CountryController;
//# sourceMappingURL=countryController.js.map