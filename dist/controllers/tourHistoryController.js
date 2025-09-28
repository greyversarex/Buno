"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTourGuide = exports.assignGuideToTour = exports.updateTourGuide = exports.getAllTourGuides = exports.createTourGuide = exports.getTourDetailsAdmin = exports.getFinishedTours = exports.getActiveTours = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const getActiveTours = async (req, res) => {
    try {
        const tours = await prisma.tour.findMany({
            where: {
                status: {
                    in: ['pending', 'active']
                }
            },
            include: {
                assignedGuide: {
                    select: {
                        id: true,
                        name: true,
                        login: true
                    }
                },
                bookings: {
                    where: {
                        status: { in: ['paid', 'confirmed'] }
                    }
                },
                category: true,
                tourBlock: true
            },
            orderBy: [
                { status: 'asc' },
                { scheduledStartDate: 'asc' }
            ]
        });
        const toursWithStats = tours.map(tour => {
            const totalTourists = tour.bookings.reduce((sum, booking) => {
                return sum + booking.numberOfTourists;
            }, 0);
            return {
                id: tour.id,
                uniqueCode: tour.uniqueCode,
                title: tour.title,
                scheduledStartDate: tour.scheduledStartDate,
                scheduledEndDate: tour.scheduledEndDate,
                status: tour.status,
                assignedGuide: tour.assignedGuide,
                totalTourists,
                bookingsCount: tour.bookings.length,
                category: tour.category,
                tourBlock: tour.tourBlock
            };
        });
        console.log(`📋 Found ${tours.length} active tours for admin`);
        res.json({
            success: true,
            data: toursWithStats
        });
    }
    catch (error) {
        console.error('❌ Error getting active tours:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.getActiveTours = getActiveTours;
const getFinishedTours = async (req, res) => {
    try {
        const tours = await prisma.tour.findMany({
            where: {
                status: 'finished'
            },
            include: {
                assignedGuide: {
                    select: {
                        id: true,
                        name: true,
                        login: true
                    }
                },
                bookings: {
                    where: {
                        status: { in: ['paid', 'confirmed'] }
                    }
                },
                category: true,
                tourBlock: true,
                reviews: {
                    where: { isApproved: true }
                },
                guideReviews: {
                    include: {
                        guide: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                scheduledEndDate: 'desc'
            }
        });
        const toursWithStats = tours.map(tour => {
            const totalTourists = tour.bookings.reduce((sum, booking) => {
                return sum + booking.numberOfTourists;
            }, 0);
            return {
                id: tour.id,
                uniqueCode: tour.uniqueCode,
                title: tour.title,
                scheduledStartDate: tour.scheduledStartDate,
                scheduledEndDate: tour.scheduledEndDate,
                status: tour.status,
                assignedGuide: tour.assignedGuide,
                totalTourists,
                bookingsCount: tour.bookings.length,
                category: tour.category,
                tourBlock: tour.tourBlock,
                customerReviews: tour.reviews,
                guideReviews: tour.guideReviews
            };
        });
        console.log(`📋 Found ${tours.length} finished tours for admin`);
        res.json({
            success: true,
            data: toursWithStats
        });
    }
    catch (error) {
        console.error('❌ Error getting finished tours:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.getFinishedTours = getFinishedTours;
const getTourDetailsAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const tourId = parseInt(id);
        if (!tourId) {
            res.status(400).json({
                success: false,
                message: 'ID тура обязателен'
            });
            return;
        }
        const tour = await prisma.tour.findUnique({
            where: { id: tourId },
            include: {
                assignedGuide: {
                    select: {
                        id: true,
                        name: true,
                        login: true,
                    }
                },
                bookings: {
                    where: {
                        status: { in: ['paid', 'confirmed'] }
                    },
                    include: {
                        hotel: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                category: true,
                tourBlock: true,
                reviews: {
                    where: { isApproved: true },
                    include: {
                        customer: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true
                            }
                        }
                    }
                },
                guideReviews: {
                    include: {
                        guide: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        if (!tour) {
            res.status(404).json({
                success: false,
                message: 'Тур не найден'
            });
            return;
        }
        const tourists = [];
        (tour.bookings || []).forEach(booking => {
            if (booking.tourists) {
                try {
                    const bookingTourists = JSON.parse(booking.tourists);
                    bookingTourists.forEach((tourist) => {
                        tourists.push({
                            ...tourist,
                            bookingId: booking.id,
                            contactEmail: booking.contactEmail,
                            contactPhone: booking.contactPhone,
                            hotel: booking.hotel
                        });
                    });
                }
                catch (e) {
                    console.warn('Error parsing tourists data:', e);
                }
            }
        });
        const tourDetails = {
            ...tour,
            tourists: tourists,
            totalTourists: tourists.length
        };
        res.json({
            success: true,
            data: tourDetails
        });
    }
    catch (error) {
        console.error('❌ Error getting tour details for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.getTourDetailsAdmin = getTourDetailsAdmin;
const createTourGuide = async (req, res) => {
    try {
        const { name, login, password, email, phone } = req.body;
        if (!name || !login || !password) {
            res.status(400).json({
                success: false,
                message: 'Имя, логин и пароль обязательны'
            });
            return;
        }
        const existingGuide = await prisma.tourGuideProfile.findUnique({
            where: { login }
        });
        if (existingGuide) {
            res.status(400).json({
                success: false,
                message: 'Логин уже занят'
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const guide = await prisma.tourGuideProfile.create({
            data: {
                name,
                login,
                password: hashedPassword,
                email: email || null,
                phone: phone || null
            }
        });
        console.log('✅ Tour guide created:', guide.login);
        res.json({
            success: true,
            data: {
                id: guide.id,
                name: guide.name,
                login: guide.login,
                email: guide.email,
                phone: guide.phone,
                isActive: guide.isActive,
                createdAt: guide.createdAt
            },
            message: 'Тургид создан'
        });
    }
    catch (error) {
        console.error('❌ Error creating tour guide:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.createTourGuide = createTourGuide;
const getAllTourGuides = async (req, res) => {
    try {
        const guides = await prisma.tourGuideProfile.findMany({
            select: {
                id: true,
                name: true,
                login: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(`📋 Found ${guides.length} tour guides`);
        res.json({
            success: true,
            data: guides
        });
    }
    catch (error) {
        console.error('❌ Error getting tour guides:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.getAllTourGuides = getAllTourGuides;
const updateTourGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, login, password, email, phone, isActive } = req.body;
        const guideId = parseInt(id);
        if (!guideId) {
            res.status(400).json({
                success: false,
                message: 'ID тургида обязателен'
            });
            return;
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (login !== undefined)
            updateData.login = login;
        if (email !== undefined)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (password && password.length > 0) {
            updateData.password = await bcrypt_1.default.hash(password, 10);
        }
        const guide = await prisma.tourGuideProfile.update({
            where: { id: guideId },
            data: updateData,
            select: {
                id: true,
                name: true,
                login: true,
                email: true,
                phone: true,
                isActive: true,
                updatedAt: true
            }
        });
        console.log('✅ Tour guide updated:', guide.login);
        res.json({
            success: true,
            data: guide,
            message: 'Тургид обновлён'
        });
    }
    catch (error) {
        console.error('❌ Error updating tour guide:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.updateTourGuide = updateTourGuide;
const assignGuideToTour = async (req, res) => {
    try {
        const { tourId, guideId, scheduledStartDate, scheduledEndDate, uniqueCode } = req.body;
        if (!tourId || !guideId) {
            res.status(400).json({
                success: false,
                message: 'ID тура и тургида обязательны'
            });
            return;
        }
        const updateData = {
            assignedGuideId: guideId
        };
        if (scheduledStartDate)
            updateData.scheduledStartDate = new Date(scheduledStartDate);
        if (scheduledEndDate)
            updateData.scheduledEndDate = new Date(scheduledEndDate);
        if (uniqueCode)
            updateData.uniqueCode = uniqueCode;
        const tour = await prisma.tour.update({
            where: { id: parseInt(tourId) },
            data: updateData,
            include: {
                assignedGuide: {
                    select: {
                        id: true,
                        name: true,
                        login: true
                    }
                }
            }
        });
        console.log(`✅ Guide ${guideId} assigned to tour ${tourId}`);
        res.json({
            success: true,
            data: tour,
            message: 'Тургид назначен на тур'
        });
    }
    catch (error) {
        console.error('❌ Error assigning guide to tour:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.assignGuideToTour = assignGuideToTour;
const deleteTourGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guideId = parseInt(id);
        if (!guideId) {
            res.status(400).json({
                success: false,
                message: 'ID тургида обязателен'
            });
            return;
        }
        const activeTours = await prisma.tour.count({
            where: {
                assignedGuideId: guideId,
                status: { in: ['pending', 'active'] }
            }
        });
        if (activeTours > 0) {
            res.status(400).json({
                success: false,
                message: `Нельзя удалить тургида с ${activeTours} активными турами`
            });
            return;
        }
        await prisma.tourGuideProfile.delete({
            where: { id: guideId }
        });
        console.log(`🗑️ Tour guide ${guideId} deleted`);
        res.json({
            success: true,
            message: 'Тургид удалён'
        });
    }
    catch (error) {
        console.error('❌ Error deleting tour guide:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};
exports.deleteTourGuide = deleteTourGuide;
//# sourceMappingURL=tourHistoryController.js.map