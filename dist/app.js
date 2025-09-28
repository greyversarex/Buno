"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const getAllowedOrigins = () => {
    const origins = [];
    if (process.env.FRONTEND_URL) {
        origins.push(process.env.FRONTEND_URL);
    }
    if (process.env.NODE_ENV !== 'production') {
        origins.push('http://localhost:5000', 'http://127.0.0.1:5000', 'http://0.0.0.0:5000');
    }
    if (process.env.REPLIT_DEV_DOMAIN) {
        origins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
    }
    return origins.length > 0 ? origins : true;
};
const corsOptions = {
    origin: getAllowedOrigins(),
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    const userAgent = req.get('User-Agent') || '';
    const isBrowser = userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari');
    if (isBrowser) {
        const protocol = req.secure ? 'https' : 'http';
        const host = req.get('host') || 'localhost:3001';
        const frontendHost = host.replace(':3001', ':5000').replace(':80', ':5000');
        const frontendUrl = `${protocol}://${frontendHost}`;
        res.redirect(302, frontendUrl);
    }
    else {
        res.json({
            success: true,
            message: 'Welcome to Tajik Trails API',
            version: '1.0.0',
            documentation: '/api/health',
            frontend: 'Redirect your browser to port 5000 for the website'
        });
    }
});
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map