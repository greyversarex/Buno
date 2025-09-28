import { Request, Response } from 'express';
export declare class TranslationController {
    translateText(req: Request, res: Response): Promise<Response>;
    translateTour(req: Request, res: Response): Promise<Response>;
    detectLanguage(req: Request, res: Response): Promise<Response>;
    getSupportedLanguages(req: Request, res: Response): Promise<Response>;
    batchTranslateTours(req: Request, res: Response): Promise<Response>;
}
export declare const translationController: TranslationController;
//# sourceMappingURL=translationController.d.ts.map