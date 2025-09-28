"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickService = exports.paymeService = exports.paypalService = exports.paymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new stripe_1.default(stripeKey) : null;
exports.paymentService = {
    async createPaymentIntent(order) {
        if (!stripe) {
            throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
        }
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(order.totalAmount * 100),
                currency: 'usd',
                metadata: {
                    orderId: order.id.toString(),
                    orderNumber: order.orderNumber,
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: order.totalAmount,
                currency: 'usd',
            };
        }
        catch (error) {
            console.error('Error creating payment intent:', error);
            throw new Error('Failed to create payment intent');
        }
    },
    async confirmPayment(paymentIntentId) {
        if (!stripe) {
            return {
                success: false,
                error: 'Stripe is not configured',
            };
        }
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status === 'succeeded') {
                return {
                    success: true,
                    transactionId: paymentIntent.id,
                };
            }
            else {
                return {
                    success: false,
                    error: `Payment status: ${paymentIntent.status}`,
                };
            }
        }
        catch (error) {
            console.error('Error confirming payment:', error);
            return {
                success: false,
                error: 'Failed to confirm payment',
            };
        }
    },
    async createCheckoutSession(order, successUrl, cancelUrl) {
        if (!stripe) {
            throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
        }
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `Tour Booking #${order.orderNumber}`,
                                description: `Booking for tour on ${new Date(order.tourDate).toLocaleDateString()}`,
                            },
                            unit_amount: Math.round(order.totalAmount * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    orderId: order.id.toString(),
                    orderNumber: order.orderNumber,
                },
            });
            return {
                sessionId: session.id,
                url: session.url,
            };
        }
        catch (error) {
            console.error('Error creating checkout session:', error);
            throw new Error('Failed to create checkout session');
        }
    },
    async handleWebhook(event) {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                return {
                    success: true,
                    transactionId: paymentIntent.id,
                };
            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                return {
                    success: false,
                    error: failedPayment.last_payment_error?.message || 'Payment failed',
                };
            default:
                console.log(`Unhandled event type: ${event.type}`);
                return {
                    success: false,
                    error: 'Unhandled webhook event',
                };
        }
    },
    async refundPayment(paymentIntentId, amount) {
        if (!stripe) {
            return {
                success: false,
                error: 'Stripe is not configured',
            };
        }
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount ? Math.round(amount * 100) : undefined,
            });
            return {
                success: true,
                transactionId: refund.id,
            };
        }
        catch (error) {
            console.error('Error processing refund:', error);
            return {
                success: false,
                error: 'Failed to process refund',
            };
        }
    },
};
exports.paypalService = {
    async createOrder(order) {
        console.log('PayPal integration not yet implemented');
        return {
            success: false,
            error: 'PayPal integration coming soon',
        };
    },
};
exports.paymeService = {
    async createTransaction(order) {
        console.log('Payme integration not yet implemented');
        return {
            success: false,
            error: 'Payme integration coming soon',
        };
    },
};
exports.clickService = {
    async createInvoice(order) {
        console.log('Click integration not yet implemented');
        return {
            success: false,
            error: 'Click integration coming soon',
        };
    },
};
exports.default = exports.paymentService;
//# sourceMappingURL=paymentService.js.map