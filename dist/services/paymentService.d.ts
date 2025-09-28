import Stripe from 'stripe';
import { Order } from '@prisma/client';
interface PaymentIntent {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
}
interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}
export declare const paymentService: {
    createPaymentIntent(order: Order): Promise<PaymentIntent>;
    confirmPayment(paymentIntentId: string): Promise<PaymentResult>;
    createCheckoutSession(order: Order, successUrl: string, cancelUrl: string): Promise<{
        sessionId: string;
        url: string | null;
    }>;
    handleWebhook(event: Stripe.Event): Promise<PaymentResult>;
    refundPayment(paymentIntentId: string, amount?: number): Promise<PaymentResult>;
};
export declare const paypalService: {
    createOrder(order: Order): Promise<any>;
};
export declare const paymeService: {
    createTransaction(order: Order): Promise<any>;
};
export declare const clickService: {
    createInvoice(order: Order): Promise<any>;
};
export default paymentService;
//# sourceMappingURL=paymentService.d.ts.map