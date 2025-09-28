import { Request, Response, NextFunction } from 'express';
export declare class PublicController {
    static getHomePageData(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getPageBySlug(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getMenu(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getNews(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=publicController.d.ts.map