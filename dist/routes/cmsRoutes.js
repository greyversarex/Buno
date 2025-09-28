"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cmsController_1 = require("../controllers/cmsController");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.get('/content-blocks', cmsController_1.CMSController.getContentBlocks);
router.post('/content-blocks', adminController_1.adminAuthMiddleware, cmsController_1.CMSController.createContentBlock);
router.put('/content-blocks/:id', adminController_1.adminAuthMiddleware, cmsController_1.CMSController.updateContentBlock);
router.delete('/content-blocks/:id', adminController_1.adminAuthMiddleware, cmsController_1.CMSController.deleteContentBlock);
router.get('/settings', cmsController_1.CMSController.getSiteSettings);
router.post('/settings', adminController_1.adminAuthMiddleware, cmsController_1.CMSController.upsertSiteSetting);
router.get('/pages', cmsController_1.CMSController.getPages);
router.post('/pages', adminController_1.adminAuthMiddleware, cmsController_1.CMSController.createPage);
router.put('/pages/:id', adminController_1.adminAuthMiddleware, cmsController_1.CMSController.updatePage);
router.get('/menu', cmsController_1.CMSController.getMenuItems);
router.get('/news', cmsController_1.CMSController.getNews);
exports.default = router;
//# sourceMappingURL=cmsRoutes.js.map