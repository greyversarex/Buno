"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const paymentService_1 = require("../services/paymentService");
const emailService_1 = require("../services/emailService");
const stripe_1 = __importDefault(require("stripe"));
const router = (0, express_1.Router)();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new stripe_1.default(stripeKey) : null;
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { orderNumber } = req.body;
        if (!orderNumber) {
            return res.status(400).json({
                success: false,
                message: 'Order number is required',
            });
        }
        const order = await database_1.default.order.findUnique({
            where: { orderNumber },
            include: {
                customer: true,
                tour: true,
            },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const paymentIntent = await paymentService_1.paymentService.createPaymentIntent(order);
        await database_1.default.order.update({
            where: { id: order.id },
            data: {
                paymentIntentId: paymentIntent.paymentIntentId,
            },
        });
        return res.json({
            success: true,
            clientSecret: paymentIntent.clientSecret,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        });
    }
    catch (error) {
        console.error('Error creating payment intent:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { orderNumber, successUrl, cancelUrl } = req.body;
        if (!orderNumber) {
            return res.status(400).json({
                success: false,
                message: 'Order number is required',
            });
        }
        const order = await database_1.default.order.findUnique({
            where: { orderNumber },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const session = await paymentService_1.paymentService.createCheckoutSession(order, successUrl || `${process.env.FRONTEND_URL}/payment-success?order=${orderNumber}`, cancelUrl || `${process.env.FRONTEND_URL}/payment-cancel?order=${orderNumber}`);
        return res.json({
            success: true,
            sessionId: session.sessionId,
            url: session.url,
        });
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create checkout session',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId, orderNumber } = req.body;
        if (!paymentIntentId || !orderNumber) {
            return res.status(400).json({
                success: false,
                message: 'Payment intent ID and order number are required',
            });
        }
        const result = await paymentService_1.paymentService.confirmPayment(paymentIntentId);
        if (result.success) {
            const order = await database_1.default.order.update({
                where: { orderNumber },
                data: {
                    paymentStatus: 'paid',
                    status: 'confirmed',
                    paymentIntentId: result.transactionId,
                },
                include: {
                    customer: true,
                    tour: true,
                },
            });
            await emailService_1.emailService.sendPaymentConfirmation(order, order.customer);
            return res.json({
                success: true,
                message: 'Payment confirmed successfully',
                transactionId: result.transactionId,
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Payment confirmation failed',
                error: result.error,
            });
        }
    }
    catch (error) {
        console.error('Error confirming payment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to confirm payment',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/stripe-webhook', async (req, res) => {
    if (!stripe) {
        return res.status(503).json({
            success: false,
            message: 'Stripe is not configured',
        });
    }
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        const result = await paymentService_1.paymentService.handleWebhook(event);
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const orderNumber = paymentIntent.metadata.orderNumber;
            if (orderNumber) {
                const order = await database_1.default.order.update({
                    where: { orderNumber },
                    data: {
                        paymentStatus: 'paid',
                        status: 'confirmed',
                        paymentIntentId: paymentIntent.id,
                    },
                    include: {
                        customer: true,
                        tour: true,
                    },
                });
                await emailService_1.emailService.sendPaymentConfirmation(order, order.customer);
            }
        }
        return res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).json({
            success: false,
            message: 'Webhook error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/refund', async (req, res) => {
    try {
        const { orderNumber, amount } = req.body;
        if (!orderNumber) {
            return res.status(400).json({
                success: false,
                message: 'Order number is required',
            });
        }
        const order = await database_1.default.order.findUnique({
            where: { orderNumber },
            include: {
                customer: true,
            },
        });
        if (!order || !order.paymentIntentId) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or no payment to refund',
            });
        }
        const result = await paymentService_1.paymentService.refundPayment(order.paymentIntentId, amount);
        if (result.success) {
            await database_1.default.order.update({
                where: { id: order.id },
                data: {
                    status: 'refunded',
                    paymentStatus: 'refunded',
                },
            });
            await emailService_1.emailService.sendCancellationEmail(order, order.customer);
            return res.json({
                success: true,
                message: 'Refund processed successfully',
                transactionId: result.transactionId,
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Refund failed',
                error: result.error,
            });
        }
    }
    catch (error) {
        console.error('Error processing refund:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process refund',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/payment-methods', async (req, res) => {
    try {
        const methods = [
            {
                id: 'stripe',
                name: 'Stripe',
                enabled: !!process.env.STRIPE_SECRET_KEY,
                description: 'Credit/Debit cards via Stripe',
            },
            {
                id: 'paypal',
                name: 'PayPal',
                enabled: !!process.env.PAYPAL_CLIENT_ID,
                description: 'PayPal payments',
            },
            {
                id: 'payme',
                name: 'Payme',
                enabled: !!process.env.PAYME_MERCHANT_ID,
                description: 'Uzbekistan payment system',
            },
            {
                id: 'click',
                name: 'Click',
                enabled: !!process.env.CLICK_MERCHANT_ID,
                description: 'Uzbekistan payment system',
            },
            {
                id: 'alif',
                name: 'AlifPay',
                enabled: !!(process.env.ALIF_KEY && process.env.ALIF_PASSWORD),
                description: 'Tajikistan payment system (Alif Bank)',
            },
            {
                id: 'payler',
                name: 'Payler',
                enabled: !!process.env.PAYLER_KEY,
                description: 'Tajikistan payment system',
            },
        ];
        return res.json({
            success: true,
            data: methods,
        });
    }
    catch (error) {
        console.error('Error getting payment methods:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get payment methods',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/alif', async (req, res) => {
    try {
        const { orderNumber, gate = 'vsa' } = req.body;
        if (!orderNumber) {
            return res.status(400).json({
                success: false,
                message: 'Order number is required',
            });
        }
        const order = await database_1.default.order.findUnique({
            where: { orderNumber },
            include: {
                customer: true,
                tour: true,
            },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const alifKey = process.env.ALIF_KEY;
        const alifPassword = process.env.ALIF_PASSWORD;
        const returnUrl = process.env.ALIF_RETURN_URL || `${process.env.BASE_URL || 'http://localhost:5000'}/frontend/payment-success.html`;
        const callbackUrl = process.env.ALIF_CALLBACK_URL || `${process.env.BASE_URL || 'http://localhost:5000'}/api/payments/alif-callback`;
        if (!alifKey || !alifPassword) {
            return res.status(500).json({
                success: false,
                message: 'AlifPay configuration missing',
            });
        }
        const orderId = order.id.toString();
        const amount = Math.round(order.totalAmount);
        const info = `Оплата тура №${orderNumber}`;
        const crypto = require('crypto');
        const step1 = crypto.createHmac('sha256', alifPassword).update(alifKey).digest('hex');
        const step2Data = alifKey + orderId + amount + callbackUrl;
        const token = crypto.createHmac('sha256', step1).update(step2Data).digest('hex');
        await database_1.default.order.update({
            where: { id: order.id },
            data: {
                paymentMethod: 'alif',
                paymentStatus: 'processing',
            },
        });
        const alifFormData = {
            key: alifKey,
            orderId: orderId,
            amount: amount,
            info: info,
            returnUrl: returnUrl,
            callbackUrl: callbackUrl,
            email: order.customer.email,
            phone: order.customer.phone || '',
            gate: gate,
            token: token,
        };
        return res.json({
            success: true,
            paymentUrl: 'https://web.alif.tj/',
            formData: alifFormData,
            method: 'POST',
        });
    }
    catch (error) {
        console.error('AlifPay error:', error);
        return res.status(500).json({
            success: false,
            message: 'AlifPay integration error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/alif-callback', async (req, res) => {
    try {
        const { orderId, amount, status, token: receivedToken } = req.body;
        console.log('🔄 AlifPay callback received:', { orderId, amount, status });
        const alifKey = process.env.ALIF_KEY;
        const alifPassword = process.env.ALIF_PASSWORD;
        if (!alifKey || !alifPassword) {
            console.error('❌ AlifPay configuration missing for callback validation');
            return res.status(500).json({
                success: false,
                message: 'Payment configuration error'
            });
        }
        const crypto = require('crypto');
        const step1 = crypto.createHmac('sha256', alifPassword).update(alifKey).digest('hex');
        const step2Data = alifKey + orderId + amount;
        const expectedToken = crypto.createHmac('sha256', step1).update(step2Data).digest('hex');
        if (receivedToken !== expectedToken) {
            console.error('❌ Invalid HMAC token in AlifPay callback:', {
                received: receivedToken,
                expected: expectedToken,
                orderId: orderId
            });
            return res.status(400).json({
                success: false,
                message: 'Invalid callback signature'
            });
        }
        console.log('✅ AlifPay callback signature validated');
        const order = await database_1.default.order.findUnique({
            where: { id: parseInt(orderId) },
            include: {
                customer: true,
            },
        });
        if (!order) {
            console.error('❌ Order not found for AlifPay callback:', orderId);
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        if (status === 'success' || status === 'paid') {
            await database_1.default.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: 'paid',
                },
            });
            console.log('✅ Payment confirmed for order:', orderId);
            try {
                await emailService_1.emailService.sendPaymentConfirmation(order, order.customer);
                console.log('✅ Confirmation email sent for order:', orderId);
            }
            catch (emailError) {
                console.error('❌ Email sending failed:', emailError);
            }
        }
        else {
            await database_1.default.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: 'failed',
                },
            });
            console.log('⚠️ Payment failed for order:', orderId);
        }
        return res.status(200).json({
            success: true,
            message: 'Callback processed'
        });
    }
    catch (error) {
        console.error('AlifPay callback error:', error);
        return res.status(500).send('Internal Server Error');
    }
});
router.post('/payler', async (req, res) => {
    try {
        const { orderNumber } = req.body;
        if (!orderNumber) {
            return res.status(400).json({
                success: false,
                message: 'Order number is required',
            });
        }
        const order = await database_1.default.order.findUnique({
            where: { orderNumber },
            include: {
                customer: true,
                tour: true,
            },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const paylerKey = process.env.PAYLER_KEY;
        if (!paylerKey) {
            return res.status(500).json({
                success: false,
                message: 'Payler configuration missing',
            });
        }
        const paylerAmount = Math.round(order.totalAmount * 100);
        const fetch = require('node-fetch');
        const startSessionBody = new URLSearchParams({
            key: paylerKey,
            type: 'OneStep',
            currency: 'TJS',
            amount: paylerAmount.toString(),
            order_id: order.id.toString(),
        });
        const response = await fetch('https://secure.payler.com/gapi/StartSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: startSessionBody,
        });
        const responseData = await response.text();
        console.log('Payler StartSession response:', responseData);
        const sessionIdMatch = responseData.match(/session_id=([^&\s]+)/);
        if (!sessionIdMatch) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create Payler session',
                error: responseData,
            });
        }
        const sessionId = sessionIdMatch[1];
        await database_1.default.order.update({
            where: { id: order.id },
            data: {
                paymentMethod: 'payler',
                paymentStatus: 'processing',
                paymentIntentId: sessionId,
            },
        });
        return res.json({
            success: true,
            paymentUrl: `https://secure.payler.com/gapi/Pay/?session_id=${sessionId}`,
            sessionId: sessionId,
        });
    }
    catch (error) {
        console.error('Payler error:', error);
        return res.status(500).json({
            success: false,
            message: 'Payler integration error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/payler-callback', async (req, res) => {
    try {
        const { order_id, status, session_id } = req.body;
        console.log('Payler callback received:', req.body);
        if (!order_id) {
            return res.status(400).send('Bad Request');
        }
        const order = await database_1.default.order.findUnique({
            where: { id: parseInt(order_id) },
            include: {
                customer: true,
            },
        });
        if (!order) {
            return res.status(404).send('Order Not Found');
        }
        if (status === 'success' || status === 'Charged') {
            await database_1.default.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: 'paid',
                },
            });
            try {
                await emailService_1.emailService.sendPaymentConfirmation(order, order.customer);
            }
            catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
        }
        else {
            await database_1.default.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: 'failed',
                },
            });
        }
        return res.status(200).send('OK');
    }
    catch (error) {
        console.error('Payler callback error:', error);
        return res.status(500).send('Internal Server Error');
    }
});
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map