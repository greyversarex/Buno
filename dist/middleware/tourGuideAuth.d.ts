import { Request, Response, NextFunction } from 'express';
export interface TourGuideAuthRequest extends Request {
    user?: {
        id: number;
        login: string;
        name: string;
        type: string;
    };
}
export declare const authenticateTourGuide: (req: TourGuideAuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=tourGuideAuth.d.ts.map