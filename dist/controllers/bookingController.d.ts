import { Request, Response } from 'express';
export declare const bookingController: {
    startBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateBookingDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createOrderFromBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    processPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateBookingStep1(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getTourHotels(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=bookingController.d.ts.map