"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const PORT = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : (process.env.NODE_ENV === 'production' ? 80 : 3001);
const HOST = '0.0.0.0';
async function startServer() {
    try {
        await database_1.default.$connect();
        console.log('✅ Database connected successfully');
        const server = app_1.default.listen(PORT, HOST, () => {
            console.log(`🚀 Tajik Trails API server is running on http://${HOST}:${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5000'}`);
            console.log(`🔗 Health check: http://${HOST}:${PORT}/api/health`);
        });
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(async () => {
                console.log('HTTP server closed');
                await database_1.default.$disconnect();
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(async () => {
                console.log('HTTP server closed');
                await database_1.default.$disconnect();
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map