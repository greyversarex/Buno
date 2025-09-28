import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
export declare const errorHandler: (error: ApiError, req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response) => void;
//# sourceMappingURL=errorHandler.d.ts.map