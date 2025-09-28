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
exports.CityController = void 0;
const database_1 = __importStar(require("../config/database"));
class CityController {
    static async getAllCities(req, res, next) {
        try {
            const cities = await (0, database_1.withRetry)(() => database_1.default.city.findMany({
                where: { isActive: true },
                include: {
                    country: true
                },
                orderBy: [
                    { country: { nameRu: 'asc' } },
                    { nameRu: 'asc' }
                ]
            }));
            const response = {
                success: true,
                data: cities,
                message: 'Cities retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getCitiesByCountry(req, res, next) {
        try {
            const { countryId } = req.params;
            const countryIdNum = parseInt(countryId);
            if (isNaN(countryIdNum)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid country ID'
                });
            }
            const cities = await (0, database_1.withRetry)(() => database_1.default.city.findMany({
                where: {
                    countryId: countryIdNum,
                    isActive: true
                },
                include: {
                    country: true
                },
                orderBy: { nameRu: 'asc' }
            }));
            const response = {
                success: true,
                data: cities,
                message: 'Cities retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getCityById(req, res, next) {
        try {
            const { id } = req.params;
            const cityId = parseInt(id);
            if (isNaN(cityId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid city ID'
                });
            }
            const city = await (0, database_1.withRetry)(() => database_1.default.city.findUnique({
                where: { id: cityId },
                include: {
                    country: true
                }
            }));
            if (!city) {
                return res.status(404).json({
                    success: false,
                    error: 'City not found'
                });
            }
            const response = {
                success: true,
                data: city,
                message: 'City retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createCity(req, res, next) {
        try {
            const { name, nameRu, nameEn, nameTj, countryId, isActive = true } = req.body;
            if (!name || !nameRu || !nameEn || !nameTj || !countryId) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: name, nameRu, nameEn, nameTj, countryId'
                });
            }
            const countryIdNum = parseInt(countryId);
            if (isNaN(countryIdNum)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid country ID'
                });
            }
            const countryExists = await (0, database_1.withRetry)(() => database_1.default.country.findUnique({
                where: { id: countryIdNum }
            }));
            if (!countryExists) {
                return res.status(400).json({
                    success: false,
                    error: 'Country not found'
                });
            }
            const city = await (0, database_1.withRetry)(() => database_1.default.city.create({
                data: {
                    name,
                    nameRu,
                    nameEn,
                    nameTj,
                    countryId: countryIdNum,
                    isActive
                },
                include: {
                    country: true
                }
            }));
            const response = {
                success: true,
                data: city,
                message: 'City created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({
                    success: false,
                    error: 'City with this name already exists in this country'
                });
            }
            return next(error);
        }
    }
    static async updateCity(req, res, next) {
        try {
            const { id } = req.params;
            const cityId = parseInt(id);
            const { name, nameRu, nameEn, nameTj, countryId, isActive } = req.body;
            if (isNaN(cityId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid city ID'
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
            if (isActive !== undefined)
                updateData.isActive = isActive;
            if (countryId !== undefined) {
                const countryIdNum = parseInt(countryId);
                if (isNaN(countryIdNum)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid country ID'
                    });
                }
                const countryExists = await (0, database_1.withRetry)(() => database_1.default.country.findUnique({
                    where: { id: countryIdNum }
                }));
                if (!countryExists) {
                    return res.status(400).json({
                        success: false,
                        error: 'Country not found'
                    });
                }
                updateData.countryId = countryIdNum;
            }
            const city = await (0, database_1.withRetry)(() => database_1.default.city.update({
                where: { id: cityId },
                data: updateData,
                include: {
                    country: true
                }
            }));
            const response = {
                success: true,
                data: city,
                message: 'City updated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'City not found'
                });
            }
            if (error.code === 'P2002') {
                return res.status(400).json({
                    success: false,
                    error: 'City with this name already exists in this country'
                });
            }
            return next(error);
        }
    }
    static async deleteCity(req, res, next) {
        try {
            const { id } = req.params;
            const cityId = parseInt(id);
            if (isNaN(cityId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid city ID'
                });
            }
            await (0, database_1.withRetry)(() => database_1.default.city.delete({
                where: { id: cityId }
            }));
            const response = {
                success: true,
                data: null,
                message: 'City deleted successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'City not found'
                });
            }
            return next(error);
        }
    }
}
exports.CityController = CityController;
//# sourceMappingURL=cityController.js.map