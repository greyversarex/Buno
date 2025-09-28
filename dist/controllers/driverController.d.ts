import { Request, Response } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
declare const DEFAULT_VEHICLE_TYPES: string[];
declare const LICENSE_CATEGORIES: string[];
export declare const getAllDrivers: (req: Request, res: Response) => Promise<void>;
export declare const getDriverById: (req: Request, res: Response) => Promise<void>;
export declare const createDriverProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateDriverProfile: (req: Request, res: Response) => Promise<void>;
export declare const deleteDriver: (req: Request, res: Response) => Promise<void>;
export declare const loginDriver: (req: Request, res: Response) => Promise<void>;
export declare const getDriverOptions: (req: Request, res: Response) => Promise<void>;
export declare const getDriverAssignedEvents: (req: Request, res: Response) => Promise<void>;
export declare const startDriverEvent: (req: Request, res: Response) => Promise<void>;
export declare const completeDriverEvent: (req: Request, res: Response) => Promise<void>;
export { DEFAULT_VEHICLE_TYPES, LICENSE_CATEGORIES };
//# sourceMappingURL=driverController.d.ts.map