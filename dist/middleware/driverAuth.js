"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminForDrivers = exports.authenticateDriver = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateDriver = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Токен доступа отсутствует'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'driver-secret-key');
        if (!decoded.driverId) {
            res.status(401).json({
                success: false,
                message: 'Неверный токен доступа'
            });
            return;
        }
        const driver = await prisma.driver.findFirst({
            where: {
                id: decoded.driverId,
                isActive: true
            }
        });
        if (!driver) {
            res.status(401).json({
                success: false,
                message: 'Водитель не найден или неактивен'
            });
            return;
        }
        req.driverId = driver.id;
        req.driver = driver;
        console.log('✅ Driver middleware success:');
        console.log('  - Driver ID:', driver.id);
        console.log('  - Driver Name:', driver.name);
        console.log('  - Request path:', req.path);
        next();
    }
    catch (error) {
        console.error('❌ Ошибка аутентификации водителя:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Неверный токен доступа'
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Токен доступа истек'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при аутентификации'
        });
    }
};
exports.authenticateDriver = authenticateDriver;
const requireAdminForDrivers = (req, res, next) => {
    next();
};
exports.requireAdminForDrivers = requireAdminForDrivers;
exports.default = exports.authenticateDriver;
//# sourceMappingURL=driverAuth.js.map