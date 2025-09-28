import { Router } from 'express';
import { AdminController, adminAuthMiddleware } from '../controllers/adminController';

const router = Router();

// Аутентификация (публичные роуты)
router.post('/login', AdminController.login);
router.post('/verify-token', AdminController.verifyToken);

// Создание администратора (только для разработки)
router.post('/create-admin', AdminController.createAdmin);

// Защищенные роуты админ панели (требуют аутентификацию)
router.get('/dashboard-stats', adminAuthMiddleware, AdminController.getDashboardStats);
// Temporary public stats endpoint for debugging
router.get('/stats', AdminController.getDashboardStats);
router.get('/tours', adminAuthMiddleware, AdminController.getTours);
router.get('/orders', adminAuthMiddleware, AdminController.getOrders);

export default router;