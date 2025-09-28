"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.post('/login', adminController_1.AdminController.login);
router.post('/verify-token', adminController_1.AdminController.verifyToken);
router.post('/create-admin', adminController_1.AdminController.createAdmin);
router.get('/dashboard-stats', adminController_1.adminAuthMiddleware, adminController_1.AdminController.getDashboardStats);
router.get('/stats', adminController_1.AdminController.getDashboardStats);
router.get('/tours', adminController_1.adminAuthMiddleware, adminController_1.AdminController.getTours);
router.get('/orders', adminController_1.adminAuthMiddleware, adminController_1.AdminController.getOrders);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map