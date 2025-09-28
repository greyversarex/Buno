"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driverAuth_1 = require("../middleware/driverAuth");
const driverController_1 = require("../controllers/driverController");
const router = express_1.default.Router();
router.post('/login', driverController_1.loginDriver);
router.post('/create-with-auth', driverController_1.upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
    { name: 'vehiclePhotos', maxCount: 5 }
]), driverController_1.createDriverProfile);
router.put('/profile/:id', driverController_1.upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
    { name: 'vehiclePhotos', maxCount: 5 }
]), driverController_1.updateDriverProfile);
router.get('/', driverController_1.getAllDrivers);
router.get('/options/vehicle-types', driverController_1.getDriverOptions);
router.get('/test-simple', (req, res) => {
    console.log('🧪 Simple test route called');
    res.json({
        success: true,
        message: 'Простой маршрут работает',
        timestamp: new Date().toISOString()
    });
});
router.get('/my-events-simple', async (req, res) => {
    console.log('🧪 Simple events route called');
    console.log('   - Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    try {
        res.json({
            success: true,
            data: [
                {
                    id: '9-0',
                    tourId: 9,
                    tourTitle: 'Тестовый тур',
                    eventIndex: 0,
                    time: '09:00',
                    title: 'Поездка в аэропорт',
                    description: 'Встреча туристов в аэропорту',
                    status: 'pending'
                },
                {
                    id: '9-1',
                    tourId: 9,
                    tourTitle: 'Тестовый тур',
                    eventIndex: 1,
                    time: '14:00',
                    title: 'Экскурсия по городу',
                    description: 'Обзорная экскурсия',
                    status: 'started'
                }
            ],
            message: 'Тестовые события загружены'
        });
    }
    catch (error) {
        console.error('❌ Error in simple events:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при загрузке событий'
        });
    }
});
router.get('/test-auth', driverAuth_1.authenticateDriver, (req, res) => {
    console.log('🧪 Test auth route called');
    console.log('  - Driver ID from req:', req.driverId);
    res.json({
        success: true,
        message: 'Middleware работает',
        driverId: req.driverId,
        driver: req.driver?.name
    });
});
router.get('/my-events', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Токен доступа отсутствует'
            });
        }
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'driver-secret-key');
        const driverId = decoded.driverId;
        if (!driverId) {
            return res.status(401).json({
                success: false,
                message: 'Неверный токен доступа'
            });
        }
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const tours = await prisma.tour.findMany({
            where: {
                isActive: true,
                itinerary: {
                    contains: `"driverId":${driverId}`
                }
            },
            select: {
                id: true,
                title: true,
                itinerary: true,
                startDate: true,
                endDate: true,
                status: true
            }
        });
        const assignedEvents = [];
        tours.forEach((tour) => {
            if (tour.itinerary) {
                try {
                    const itinerary = JSON.parse(tour.itinerary);
                    itinerary.forEach((event, index) => {
                        if (event.driverId && parseInt(event.driverId) === driverId) {
                            assignedEvents.push({
                                id: `${tour.id}-${index}`,
                                tourId: tour.id,
                                tourTitle: tour.title,
                                eventIndex: index,
                                time: event.time,
                                title: event.title,
                                description: event.description,
                                status: event.status || 'pending',
                                tourStatus: tour.status,
                                startDate: tour.startDate,
                                endDate: tour.endDate,
                                startedAt: event.startedAt,
                                completedAt: event.completedAt
                            });
                        }
                    });
                }
                catch (e) {
                    console.warn('Error parsing itinerary for tour', tour.id, e);
                }
            }
        });
        res.json({
            success: true,
            data: assignedEvents,
            message: 'Назначенные события получены успешно'
        });
        return;
    }
    catch (error) {
        console.error('❌ Error getting driver assigned events:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении назначенных событий'
        });
        return;
    }
});
router.post('/events/:eventId/start', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Токен доступа отсутствует'
            });
        }
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'driver-secret-key');
        const driverId = decoded.driverId;
        const { eventId } = req.params;
        if (!driverId || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'Необходимы параметры driverId и eventId'
            });
        }
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const [tourId, eventIndex] = eventId.split('-');
        const tour = await prisma.tour.findUnique({
            where: { id: parseInt(tourId) }
        });
        if (!tour || !tour.itinerary) {
            return res.status(404).json({
                success: false,
                message: 'Тур или программа не найдены'
            });
        }
        const itinerary = JSON.parse(tour.itinerary);
        const eventIdx = parseInt(eventIndex);
        if (eventIdx >= itinerary.length || itinerary[eventIdx].driverId !== driverId) {
            return res.status(403).json({
                success: false,
                message: 'Событие не назначено данному водителю'
            });
        }
        itinerary[eventIdx].status = 'started';
        itinerary[eventIdx].startedAt = new Date().toISOString();
        await prisma.tour.update({
            where: { id: parseInt(tourId) },
            data: { itinerary: JSON.stringify(itinerary) }
        });
        res.json({
            success: true,
            message: 'Событие запущено'
        });
        return;
    }
    catch (error) {
        console.error('❌ Error starting driver event:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при запуске события'
        });
        return;
    }
});
router.post('/events/:eventId/complete', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Токен доступа отсутствует'
            });
        }
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'driver-secret-key');
        const driverId = decoded.driverId;
        const { eventId } = req.params;
        if (!driverId || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'Необходимы параметры driverId и eventId'
            });
        }
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const [tourId, eventIndex] = eventId.split('-');
        const tour = await prisma.tour.findUnique({
            where: { id: parseInt(tourId) }
        });
        if (!tour || !tour.itinerary) {
            return res.status(404).json({
                success: false,
                message: 'Тур или программа не найдены'
            });
        }
        const itinerary = JSON.parse(tour.itinerary);
        const eventIdx = parseInt(eventIndex);
        if (eventIdx >= itinerary.length || itinerary[eventIdx].driverId !== driverId) {
            return res.status(403).json({
                success: false,
                message: 'Событие не назначено данному водителю'
            });
        }
        itinerary[eventIdx].status = 'completed';
        itinerary[eventIdx].completedAt = new Date().toISOString();
        await prisma.tour.update({
            where: { id: parseInt(tourId) },
            data: { itinerary: JSON.stringify(itinerary) }
        });
        res.json({
            success: true,
            message: 'Событие завершено'
        });
        return;
    }
    catch (error) {
        console.error('❌ Error completing driver event:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при завершении события'
        });
        return;
    }
});
router.get('/:id', driverController_1.getDriverById);
router.delete('/:id', driverController_1.deleteDriver);
exports.default = router;
//# sourceMappingURL=driverRoutes.js.map