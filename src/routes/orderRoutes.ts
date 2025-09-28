import { Router } from 'express';
import * as orderController from '../controllers/orderController';

const router = Router();

// Public routes
router.post('/', orderController.createOrder);
router.get('/number/:orderNumber', orderController.getOrder);

// Admin routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatusById);
router.put('/:orderNumber/status', orderController.updateOrderStatus);
router.put('/:orderNumber/cancel', orderController.cancelOrder);

export default router;