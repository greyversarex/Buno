"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getAllCustomers = exports.getCustomer = exports.getOrCreateCustomer = exports.createCustomer = void 0;
const database_1 = __importDefault(require("../config/database"));
const createCustomer = async (req, res) => {
    try {
        const { fullName, email, phone } = req.body;
        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Full name and email are required',
            });
        }
        const existingCustomer = await database_1.default.customer.findUnique({
            where: { email },
        });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Customer with this email already exists',
            });
        }
        const customer = await database_1.default.customer.create({
            data: {
                fullName,
                email,
                phone,
            },
        });
        return res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: customer,
        });
    }
    catch (error) {
        console.error('Error creating customer:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create customer',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createCustomer = createCustomer;
const getOrCreateCustomer = async (req, res) => {
    try {
        const { fullName, email, phone } = req.body;
        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Full name and email are required',
            });
        }
        let customer = await database_1.default.customer.findUnique({
            where: { email },
        });
        if (!customer) {
            customer = await database_1.default.customer.create({
                data: {
                    fullName,
                    email,
                    phone,
                },
            });
        }
        else {
            const updateData = {};
            if (customer.fullName !== fullName)
                updateData.fullName = fullName;
            if (phone && customer.phone !== phone)
                updateData.phone = phone;
            if (Object.keys(updateData).length > 0) {
                customer = await database_1.default.customer.update({
                    where: { id: customer.id },
                    data: updateData,
                });
            }
        }
        return res.json({
            success: true,
            message: customer ? 'Customer retrieved successfully' : 'Customer created successfully',
            data: customer,
        });
    }
    catch (error) {
        console.error('Error getting or creating customer:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get or create customer',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getOrCreateCustomer = getOrCreateCustomer;
const getCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await database_1.default.customer.findUnique({
            where: { id: parseInt(id) },
            include: {
                orders: {
                    include: {
                        tour: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                reviews: {
                    include: {
                        tour: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }
        const formattedCustomer = {
            ...customer,
            orders: customer.orders.map(order => ({
                ...order,
                tourists: JSON.parse(order.tourists),
                tour: {
                    ...order.tour,
                    title: JSON.parse(order.tour.title),
                },
            })),
            reviews: customer.reviews.map(review => ({
                ...review,
                tour: {
                    ...review.tour,
                    title: JSON.parse(review.tour.title),
                },
            })),
        };
        return res.json({
            success: true,
            data: formattedCustomer,
        });
    }
    catch (error) {
        console.error('Error fetching customer:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch customer',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getCustomer = getCustomer;
const getAllCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const where = {};
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const customers = await database_1.default.customer.findMany({
            where,
            include: {
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
        });
        const totalCustomers = await database_1.default.customer.count({ where });
        return res.json({
            success: true,
            data: customers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCustomers,
                totalPages: Math.ceil(totalCustomers / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllCustomers = getAllCustomers;
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone } = req.body;
        const updateData = {};
        if (fullName)
            updateData.fullName = fullName;
        if (email)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone;
        const customer = await database_1.default.customer.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        return res.json({
            success: true,
            message: 'Customer updated successfully',
            data: customer,
        });
    }
    catch (error) {
        console.error('Error updating customer:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update customer',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await database_1.default.customer.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                    },
                },
            },
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }
        if (customer._count.orders > 0 || customer._count.reviews > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete customer with existing orders or reviews',
            });
        }
        await database_1.default.customer.delete({
            where: { id: parseInt(id) },
        });
        return res.json({
            success: true,
            message: 'Customer deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting customer:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete customer',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.deleteCustomer = deleteCustomer;
//# sourceMappingURL=customerController.js.map