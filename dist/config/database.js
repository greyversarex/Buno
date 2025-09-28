"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = withRetry;
const client_1 = require("@prisma/client");
const prisma = globalThis.__prisma || new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    },
    errorFormat: 'minimal'
});
if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma;
}
async function withRetry(operation, maxRetries = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            const isRetryable = error?.code === 'P1001' ||
                error?.code === 'P1017' ||
                error?.message?.includes('terminating connection') ||
                error?.message?.includes('Connection refused');
            if (!isRetryable || attempt === maxRetries) {
                throw error;
            }
            console.log(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${attempt * 1000}ms...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
    throw lastError;
}
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
exports.default = prisma;
//# sourceMappingURL=database.js.map