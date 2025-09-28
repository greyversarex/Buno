"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateTourGuide = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'tour-guide-secret-key';
const authenticateTourGuide = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.tourGuideToken;
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Требуется авторизация'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.type !== 'tour-guide') {
            res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            });
            return;
        }
        req.user = {
            id: decoded.id,
            login: decoded.login,
            name: decoded.name,
            type: decoded.type
        };
        next();
    }
    catch (error) {
        console.error('❌ Tour guide auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Недействительный токен'
        });
        return;
    }
};
exports.authenticateTourGuide = authenticateTourGuide;
//# sourceMappingURL=tourGuideAuth.js.map