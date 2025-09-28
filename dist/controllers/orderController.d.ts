import { Request, Response } from 'express';
export declare const createOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getOrderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllOrders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateOrderStatusById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=orderController.d.ts.map