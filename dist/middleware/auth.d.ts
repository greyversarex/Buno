import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    user?: any;
}
export declare const authenticateJWT: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const generateToken: (payload: any) => string;
export {};
//# sourceMappingURL=auth.d.ts.map