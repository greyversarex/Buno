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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = exports.AdminController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importStar(require("../config/database"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
class AdminController {
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Username and password are required'
                });
            }
            const admin = await (0, database_1.withRetry)(() => database_1.default.admin.findUnique({
                where: { username }
            }));
            if (!admin || !admin.isActive) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
            const token = jsonwebtoken_1.default.sign({
                adminId: admin.id,
                username: admin.username,
                role: admin.role
            }, JWT_SECRET, { expiresIn: '24h' });
            const response = {
                success: true,
                data: {
                    token,
                    admin: {
                        id: admin.id,
                        username: admin.username,
                        fullName: admin.fullName,
                        role: admin.role
                    }
                },
                message: 'Login successful'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createAdmin(req, res, next) {
        try {
            const { username, email, password, fullName, role = 'admin' } = req.body;
            if (!username || !email || !password || !fullName) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: username, email, password, fullName'
                });
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const admin = await database_1.default.admin.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    fullName,
                    role
                }
            });
            const response = {
                success: true,
                data: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    fullName: admin.fullName,
                    role: admin.role
                },
                message: 'Admin created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async verifyToken(req, res, next) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided'
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const admin = await database_1.default.admin.findUnique({
                where: { id: decoded.adminId }
            });
            if (!admin || !admin.isActive) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token'
                });
            }
            const response = {
                success: true,
                data: {
                    admin: {
                        id: admin.id,
                        username: admin.username,
                        fullName: admin.fullName,
                        role: admin.role
                    }
                },
                message: 'Token is valid'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
    }
    static async getDashboardStats(req, res, next) {
        try {
            const [toursCount, ordersCount, customersCount, hotelsCount, guidesCount, reviewsCount] = await Promise.all([
                database_1.default.tour.count(),
                database_1.default.order.count(),
                database_1.default.customer.count(),
                database_1.default.hotel.count(),
                database_1.default.guide.count(),
                database_1.default.review.count()
            ]);
            const recentOrders = await database_1.default.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    customer: true,
                    tour: true
                }
            });
            const response = {
                success: true,
                data: {
                    stats: {
                        tours: toursCount,
                        orders: ordersCount,
                        customers: customersCount,
                        hotels: hotelsCount,
                        guides: guidesCount,
                        reviews: reviewsCount
                    },
                    recentOrders
                },
                message: 'Dashboard statistics retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getTours(req, res, next) {
        try {
            const tours = await database_1.default.tour.findMany({
                include: {
                    category: true,
                    tourBlock: true,
                    orders: true,
                    reviews: true
                },
                orderBy: { createdAt: 'desc' }
            });
            const response = {
                success: true,
                data: tours,
                message: 'Tours retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getOrders(req, res, next) {
        try {
            const orders = await database_1.default.order.findMany({
                include: {
                    customer: true,
                    tour: true,
                    hotel: true,
                    guide: true
                },
                orderBy: { createdAt: 'desc' }
            });
            const response = {
                success: true,
                data: orders,
                message: 'Orders retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AdminController = AdminController;
const adminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'No token provided'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const admin = await database_1.default.admin.findUnique({
            where: { id: decoded.adminId }
        });
        if (!admin || !admin.isActive) {
            res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
            return;
        }
        req.admin = {
            id: admin.id,
            username: admin.username,
            role: admin.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
        return;
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
//# sourceMappingURL=adminController.js.map