"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const tourBlockController_1 = require("../controllers/tourBlockController");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get('/', tourBlockController_1.getTourBlocks);
router.get('/:id/tours', async (req, res) => {
    try {
        const blockId = parseInt(req.params.id);
        if (!blockId) {
            res.status(400).json({
                success: false,
                message: 'ID блока тура обязателен'
            });
            return;
        }
        const tourAssignments = await prisma.tourBlockAssignment.findMany({
            where: {
                tourBlockId: blockId
            },
            include: {
                tour: {
                    include: {
                        category: true,
                        tourBlock: true
                    }
                }
            },
            orderBy: [
                { isPrimary: 'desc' },
                { tour: { createdAt: 'desc' } }
            ]
        });
        const tours = tourAssignments
            .map(assignment => assignment.tour)
            .filter(tour => tour.isActive);
        console.log(`📋 Found ${tours.length} tours for block ${blockId} (via new assignment system)`);
        res.json({
            success: true,
            data: tours
        });
    }
    catch (error) {
        console.error('❌ Error getting tours for block:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
});
router.get('/:id', tourBlockController_1.getTourBlock);
router.post('/', auth_1.authenticateJWT, tourBlockController_1.createTourBlock);
router.put('/:id', auth_1.authenticateJWT, tourBlockController_1.updateTourBlock);
router.delete('/:id', auth_1.authenticateJWT, tourBlockController_1.deleteTourBlock);
router.post('/:blockId/tours/:tourId', auth_1.authenticateJWT, tourBlockController_1.addTourToBlock);
router.delete('/tours/:tourId', auth_1.authenticateJWT, tourBlockController_1.removeTourFromBlock);
exports.default = router;
//# sourceMappingURL=tourBlockRoutes.js.map