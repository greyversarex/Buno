import { Request, Response } from 'express';
export declare const createGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllGuides: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getGuideById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getGuidesByTour: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const linkGuideToTour: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=guideController.d.ts.map