import { Request, Response, NextFunction } from 'express';
export declare class CMSController {
    static getContentBlocks(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createContentBlock(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static updateContentBlock(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static deleteContentBlock(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getSiteSettings(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static upsertSiteSetting(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getPages(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static createPage(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static updatePage(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getMenuItems(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getNews(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=cmsController.d.ts.map