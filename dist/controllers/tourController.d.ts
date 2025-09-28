import { Request, Response, NextFunction } from 'express';
export declare class TourController {
    static getAllTours(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTourMainImage(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getTourById(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static createTour(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateTour(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static deleteTour(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static searchTours(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getSearchSuggestions(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
export declare class CategoryController {
    static getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static createCategory(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static updateCategory(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
export declare class BookingRequestController {
    static getAllBookingRequests(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static createBookingRequest(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
export declare class ReviewController {
    static getAllReviews(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static createReview(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static updateReview(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=tourController.d.ts.map