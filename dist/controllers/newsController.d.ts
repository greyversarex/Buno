import { Request, Response } from 'express';
export declare const getAllNews: (req: Request, res: Response) => Promise<void>;
export declare const getNewsBySlug: (req: Request, res: Response) => Promise<void>;
export declare const getNewsById: (req: Request, res: Response) => Promise<void>;
export declare const getAllNewsAdmin: (req: Request, res: Response) => Promise<void>;
export declare const createNews: (req: Request, res: Response) => Promise<void>;
export declare const updateNews: (req: Request, res: Response) => Promise<void>;
export declare const deleteNews: (req: Request, res: Response) => Promise<void>;
export declare const subscribeNewsletter: (req: Request, res: Response) => Promise<void>;
export declare const getNewsletterSubscribers: (req: Request, res: Response) => Promise<void>;
export declare const getNewsStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=newsController.d.ts.map