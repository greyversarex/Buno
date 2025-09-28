import { Request, Response, NextFunction } from 'express';
export declare class CityController {
    static getAllCities(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getCitiesByCountry(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getCityById(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static createCity(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static updateCity(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static deleteCity(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=cityController.d.ts.map