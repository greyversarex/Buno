import { PrismaClient } from '@prisma/client';
declare global {
    var __prisma: PrismaClient | undefined;
}
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function withRetry<T>(operation: () => Promise<T>, maxRetries?: number): Promise<T>;
export default prisma;
//# sourceMappingURL=database.d.ts.map