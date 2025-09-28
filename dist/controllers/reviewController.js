"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectReview = exports.approveReview = exports.getReviewStats = exports.deleteReview = exports.moderateReview = exports.getAllReviews = exports.getReviewsByTour = exports.createReview = void 0;
const database_1 = __importDefault(require("../config/database"));
const createReview = async (req, res) => {
    try {
        const { customerId, tourId, rating, text, reviewerName, photos } = req.body;
        if (!tourId || !rating || !text || !reviewerName) {
            return res.status(400).json({
                success: false,
                message: 'Tour ID, reviewer name, rating, and text are required',
            });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }
        const tour = await database_1.default.tour.findUnique({ where: { id: tourId } });
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found',
            });
        }
        if (customerId) {
            const customer = await database_1.default.customer.findUnique({ where: { id: customerId } });
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found',
                });
            }
            const existingReview = await database_1.default.review.findFirst({
                where: {
                    customerId,
                    tourId,
                },
            });
            if (existingReview) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already reviewed this tour',
                });
            }
        }
        const review = await database_1.default.review.create({
            data: {
                customerId: customerId || null,
                tourId,
                reviewerName,
                rating,
                text,
                photos: photos ? JSON.stringify(photos) : null,
            },
            include: {
                customer: true,
                tour: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return res.status(201).json({
            success: true,
            message: 'Review submitted successfully. It will be visible after moderation.',
            data: {
                ...review,
                tour: {
                    ...review.tour,
                    title: JSON.parse(review.tour.title),
                },
            },
        });
    }
    catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createReview = createReview;
const getReviewsByTour = async (req, res) => {
    try {
        const { tourId } = req.params;
        const reviews = await database_1.default.review.findMany({
            where: {
                tourId: parseInt(tourId),
                isModerated: true,
                isApproved: true,
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const formattedReviews = reviews.map(review => ({
            ...review,
            photos: review.photos ? JSON.parse(review.photos) : [],
        }));
        return res.json({
            success: true,
            data: formattedReviews,
        });
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getReviewsByTour = getReviewsByTour;
const getAllReviews = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const where = {};
        if (status === 'pending') {
            where.isModerated = false;
        }
        else if (status === 'approved') {
            where.isModerated = true;
            where.isApproved = true;
        }
        else if (status === 'rejected') {
            where.isModerated = true;
            where.isApproved = false;
        }
        const reviews = await database_1.default.review.findMany({
            where,
            include: {
                customer: true,
                tour: {
                    select: {
                        id: true,
                        title: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
        });
        const formattedReviews = reviews.map(review => ({
            ...review,
            photos: review.photos ? JSON.parse(review.photos) : [],
            tour: {
                ...review.tour,
                title: JSON.parse(review.tour.title),
                category: {
                    ...review.tour.category,
                    name: JSON.parse(review.tour.category.name),
                },
            },
        }));
        const totalReviews = await database_1.default.review.count({ where });
        return res.json({
            success: true,
            data: formattedReviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalReviews,
                totalPages: Math.ceil(totalReviews / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllReviews = getAllReviews;
const moderateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;
        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isApproved must be a boolean value',
            });
        }
        const review = await database_1.default.review.update({
            where: { id: parseInt(id) },
            data: {
                isModerated: true,
                isApproved,
            },
            include: {
                customer: true,
                tour: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return res.json({
            success: true,
            message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
            data: {
                ...review,
                tour: {
                    ...review.tour,
                    title: JSON.parse(review.tour.title),
                },
            },
        });
    }
    catch (error) {
        console.error('Error moderating review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to moderate review',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.moderateReview = moderateReview;
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.review.delete({
            where: { id: parseInt(id) },
        });
        return res.json({
            success: true,
            message: 'Review deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.deleteReview = deleteReview;
const getReviewStats = async (req, res) => {
    try {
        const { tourId } = req.params;
        const stats = await database_1.default.review.aggregate({
            where: {
                tourId: parseInt(tourId),
                isModerated: true,
                isApproved: true,
            },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });
        const ratingDistribution = await database_1.default.review.groupBy({
            by: ['rating'],
            where: {
                tourId: parseInt(tourId),
                isModerated: true,
                isApproved: true,
            },
            _count: {
                rating: true,
            },
            orderBy: {
                rating: 'asc',
            },
        });
        return res.json({
            success: true,
            data: {
                averageRating: stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : 0,
                totalReviews: stats._count.rating,
                ratingDistribution: ratingDistribution.map(item => ({
                    rating: item.rating,
                    count: item._count.rating,
                })),
            },
        });
    }
    catch (error) {
        console.error('Error fetching review stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch review statistics',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getReviewStats = getReviewStats;
const approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        const reviewId = parseInt(id);
        if (isNaN(reviewId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }
        const existingReview = await database_1.default.review.findUnique({
            where: { id: reviewId },
        });
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }
        const review = await database_1.default.review.update({
            where: { id: reviewId },
            data: {
                isApproved: true,
                isModerated: true,
            },
            include: {
                customer: true,
                tour: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Review approved successfully',
            data: {
                ...review,
                tour: {
                    ...review.tour,
                    title: JSON.parse(review.tour.title),
                },
            },
        });
    }
    catch (error) {
        console.error('Error approving review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to approve review',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.approveReview = approveReview;
const rejectReview = async (req, res) => {
    try {
        const { id } = req.params;
        const reviewId = parseInt(id);
        if (isNaN(reviewId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }
        const existingReview = await database_1.default.review.findUnique({
            where: { id: reviewId },
        });
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }
        const review = await database_1.default.review.update({
            where: { id: reviewId },
            data: {
                isApproved: false,
                isModerated: true,
            },
            include: {
                customer: true,
                tour: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Review rejected successfully',
            data: {
                ...review,
                tour: {
                    ...review.tour,
                    title: JSON.parse(review.tour.title),
                },
            },
        });
    }
    catch (error) {
        console.error('Error rejecting review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reject review',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.rejectReview = rejectReview;
//# sourceMappingURL=reviewController.js.map