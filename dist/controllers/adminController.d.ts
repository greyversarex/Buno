import { Request, Response, NextFunction } from 'express';
export declare class AdminController {
    static login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static createAdmin(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static verifyToken(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getTours(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getOrders(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
export declare const adminAuthMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=adminController.d.ts.map