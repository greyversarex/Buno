"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const router = (0, express_1.Router)();
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Public API is working',
        timestamp: new Date().toISOString()
    });
});
router.get('/test-cms', async (req, res) => {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const blocks = await prisma.contentBlock.findMany({
            take: 3
        });
        res.json({
            success: true,
            data: blocks,
            count: blocks.length
        });
    }
    catch (error) {
        res.json({
            success: false,
            error: error?.message || 'Unknown error'
        });
    }
});
router.get('/homepage', publicController_1.PublicController.getHomePageData);
router.get('/pages/:slug', publicController_1.PublicController.getPageBySlug);
router.get('/menu', publicController_1.PublicController.getMenu);
router.get('/news', publicController_1.PublicController.getNews);
exports.default = router;
//# sourceMappingURL=publicRoutes.js.map