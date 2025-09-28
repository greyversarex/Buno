import { Request, Response, NextFunction } from 'express';
export declare class CountryController {
    static getAllCountries(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getCountryById(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static createCountry(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static updateCountry(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static deleteCountry(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=countryController.d.ts.map