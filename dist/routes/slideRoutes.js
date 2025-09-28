"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slideController_1 = require("../controllers/slideController");
const router = (0, express_1.Router)();
router.get('/', slideController_1.getSlides);
router.get('/admin', slideController_1.getAllSlides);
router.get('/:id', slideController_1.getSlideById);
router.post('/', slideController_1.createSlide);
router.put('/:id', slideController_1.updateSlide);
router.delete('/:id', slideController_1.deleteSlide);
router.put('/reorder', slideController_1.updateSlideOrder);
exports.default = router;
//# sourceMappingURL=slideRoutes.js.map