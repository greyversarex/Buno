"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderStatus = exports.updateOrderStatusById = exports.getAllOrders = exports.getOrderById = exports.getOrder = exports.createOrder = void 0;
const database_1 = __importDefault(require("../config/database"));
const emailService_1 = require("../services/emailService");
const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BT-${timestamp.slice(-6)}${random}`;
};
const createOrder = async (req, res) => {
    try {
        const bookingData = req.body;
        if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
            return res.status(400).json({
                success: false,
                message: 'Customer name, email, and phone are required',
            });
        }
        if (!bookingData.termsAccepted || !bookingData.paymentRulesAccepted) {
            return res.status(400).json({
                success: false,
                message: 'Both terms and payment rules must be accepted',
            });
        }
        let customer = await database_1.default.customer.findUnique({
            where: { email: bookingData.customerEmail },
        });
        if (!customer) {
            customer = await database_1.default.customer.create({
                data: {
                    fullName: bookingData.customerName,
                    email: bookingData.customerEmail,
                    phone: bookingData.customerPhone,
                },
            });
        }
        const tour = await database_1.default.tour.findUnique({
            where: { id: parseInt(req.body.tourId) },
            include: {
                category: true,
            },
        });
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found',
            });
        }
        const basePrice = parseFloat(tour.price);
        const numberOfTourists = bookingData.tourists.length;
        const tourPriceType = tour.priceType;
        let totalAmount = 0;
        if (tourPriceType === 'за человека') {
            totalAmount += basePrice * numberOfTourists;
        }
        else {
            totalAmount += basePrice;
        }
        if (bookingData.selectedHotelId && bookingData.roomSelection) {
            const hotel = await database_1.default.hotel.findUnique({
                where: { id: bookingData.selectedHotelId }
            });
            if (hotel) {
                const tourDuration = parseInt(tour.duration.replace(/\D/g, '')) || 1;
                const roomSelection = typeof bookingData.roomSelection === 'string'
                    ? JSON.parse(bookingData.roomSelection)
                    : bookingData.roomSelection;
                for (const [roomType, roomData] of Object.entries(roomSelection)) {
                    const room = roomData;
                    if (room.quantity > 0 && room.price) {
                        totalAmount += room.price * room.quantity * tourDuration;
                    }
                }
            }
        }
        if (bookingData.selectedHotelId && bookingData.mealSelection) {
            const tourDuration = parseInt(tour.duration.replace(/\D/g, '')) || 1;
            const mealSelection = typeof bookingData.mealSelection === 'string'
                ? JSON.parse(bookingData.mealSelection)
                : bookingData.mealSelection;
            for (const [mealType, mealData] of Object.entries(mealSelection)) {
                const meal = mealData;
                if (meal.selected && meal.price) {
                    totalAmount += meal.price * numberOfTourists * tourDuration;
                }
            }
        }
        const orderNumber = generateOrderNumber();
        const order = await database_1.default.order.create({
            data: {
                orderNumber,
                customerId: customer.id,
                tourId: parseInt(req.body.tourId),
                hotelId: bookingData.selectedHotelId || null,
                guideId: bookingData.selectedGuideId || null,
                tourDate: bookingData.tourDate,
                tourists: JSON.stringify(bookingData.tourists),
                wishes: bookingData.wishes,
                totalAmount,
                status: 'pending',
                paymentStatus: 'unpaid',
            },
            include: {
                customer: true,
                tour: {
                    include: {
                        category: true,
                    },
                },
                hotel: true,
                guide: true,
            },
        });
        try {
            await emailService_1.emailService.sendBookingConfirmation(order, customer, order.tour);
            await emailService_1.emailService.sendAdminNotification(order, customer, order.tour);
        }
        catch (emailError) {
            console.error('Email sending failed (non-critical):', emailError);
        }
        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
            },
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createOrder = createOrder;
const getOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const order = await database_1.default.order.findUnique({
            where: { orderNumber },
            include: {
                customer: true,
                tour: {
                    include: {
                        category: true,
                    },
                },
                hotel: true,
                guide: true,
            },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const formattedOrder = {
            ...order,
            tourists: JSON.parse(order.tourists),
            tour: {
                ...order.tour,
                title: JSON.parse(order.tour.title),
                description: JSON.parse(order.tour.description),
            },
            hotel: order.hotel ? {
                ...order.hotel,
                name: JSON.parse(order.hotel.name),
                description: order.hotel.description ? JSON.parse(order.hotel.description) : null,
            } : null,
            guide: order.guide ? {
                ...order.guide,
                name: JSON.parse(order.guide.name),
                description: order.guide.description ? JSON.parse(order.guide.description) : null,
            } : null,
        };
        return res.json({
            success: true,
            data: formattedOrder,
        });
    }
    catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getOrder = getOrder;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await database_1.default.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                customer: true,
                tour: {
                    include: {
                        category: true,
                    },
                },
                hotel: true,
                guide: true,
            },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const formattedOrder = {
            ...order,
            tourists: JSON.parse(order.tourists),
            tour: {
                ...order.tour,
                title: JSON.parse(order.tour.title),
                description: JSON.parse(order.tour.description),
            },
            hotel: order.hotel ? {
                ...order.hotel,
                name: JSON.parse(order.hotel.name),
                description: order.hotel.description ? JSON.parse(order.hotel.description) : null,
            } : null,
            guide: order.guide ? {
                ...order.guide,
                name: JSON.parse(order.guide.name),
                description: order.guide.description ? JSON.parse(order.guide.description) : null,
            } : null,
        };
        return res.json({
            success: true,
            order: formattedOrder,
        });
    }
    catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getOrderById = getOrderById;
const getAllOrders = async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 20 } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (paymentStatus)
            where.paymentStatus = paymentStatus;
        const orders = await database_1.default.order.findMany({
            where,
            include: {
                customer: true,
                tour: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
                hotel: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                guide: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
        });
        const formattedOrders = orders.map(order => ({
            ...order,
            tourists: JSON.parse(order.tourists),
            tour: {
                ...order.tour,
                title: JSON.parse(order.tour.title),
            },
            hotel: order.hotel ? {
                ...order.hotel,
                name: JSON.parse(order.hotel.name),
            } : null,
            guide: order.guide ? {
                ...order.guide,
                name: JSON.parse(order.guide.name),
            } : null,
        }));
        const totalOrders = await database_1.default.order.count({ where });
        return res.json({
            success: true,
            orders: formattedOrders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalOrders,
                totalPages: Math.ceil(totalOrders / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus, paymentMethod, receiptData } = req.body;
        const updateData = {};
        if (status)
            updateData.status = status;
        if (paymentStatus)
            updateData.paymentStatus = paymentStatus;
        if (paymentMethod)
            updateData.paymentMethod = paymentMethod;
        if (receiptData)
            updateData.receiptData = JSON.stringify(receiptData);
        const updatedOrder = await database_1.default.order.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                customer: true,
                tour: true,
            },
        });
        if (status === 'confirmed') {
        }
        return res.json({
            success: true,
            message: 'Order status updated successfully',
            data: updatedOrder,
        });
    }
    catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.updateOrderStatusById = updateOrderStatusById;
const updateOrderStatus = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const { status, paymentStatus, paymentMethod, receiptData } = req.body;
        const updateData = {};
        if (status)
            updateData.status = status;
        if (paymentStatus)
            updateData.paymentStatus = paymentStatus;
        if (paymentMethod)
            updateData.paymentMethod = paymentMethod;
        if (receiptData)
            updateData.receiptData = JSON.stringify(receiptData);
        const order = await database_1.default.order.update({
            where: { orderNumber },
            data: updateData,
            include: {
                customer: true,
                tour: true,
            },
        });
        return res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order,
        });
    }
    catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const cancelOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const { reason } = req.body;
        const order = await database_1.default.order.update({
            where: { orderNumber },
            data: {
                status: 'cancelled',
                wishes: reason ? `${reason} (ОТМЕНЁН)` : 'ОТМЕНЁН',
            },
        });
        return res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order,
        });
    }
    catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=orderController.js.map