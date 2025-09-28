import { Request, Response } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
export declare const loginTourGuide: (req: Request, res: Response) => Promise<void>;
export declare const getGuideTours: (req: Request, res: Response) => Promise<void>;
export declare const getTourDetails: (req: Request, res: Response) => Promise<void>;
export declare const startTour: (req: Request, res: Response) => Promise<void>;
export declare const finishTour: (req: Request, res: Response) => Promise<void>;
export declare const collectReviews: (req: Request, res: Response) => Promise<void>;
export declare const leaveGuideReview: (req: Request, res: Response) => Promise<void>;
export declare const createTourGuideProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateGuideProfile: (req: Request, res: Response) => Promise<void>;
export declare const uploadGuideAvatar: (req: Request, res: Response) => Promise<void>;
export declare const uploadGuideDocuments: (req: Request, res: Response) => Promise<void>;
export declare const deleteGuideDocument: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=tourGuideController.d.ts.map