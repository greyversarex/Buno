import { Request, Response } from 'express';
export declare const createReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getReviewsByTour: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllReviews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const moderateReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getReviewStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const approveReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const rejectReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=reviewController.d.ts.map