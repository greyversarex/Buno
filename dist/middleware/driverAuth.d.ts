import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    driverId?: number;
    driver?: any;
}
export declare const authenticateDriver: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdminForDrivers: (req: Request, res: Response, next: NextFunction) => void;
export default authenticateDriver;
//# sourceMappingURL=driverAuth.d.ts.map