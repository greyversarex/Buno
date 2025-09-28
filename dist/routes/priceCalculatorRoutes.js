"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priceCalculatorController_1 = require("../controllers/priceCalculatorController");
const router = (0, express_1.Router)();
router.get('/', priceCalculatorController_1.getAllComponents);
router.get('/id/:id', priceCalculatorController_1.getComponentById);
router.get('/:key', priceCalculatorController_1.getComponentByKey);
router.post('/', priceCalculatorController_1.createComponent);
router.put('/:id', priceCalculatorController_1.updateComponent);
router.delete('/:id', priceCalculatorController_1.deleteComponent);
router.post('/initialize', priceCalculatorController_1.initializeDefaults);
router.post('/calculate', priceCalculatorController_1.calculateTourPrice);
exports.default = router;
//# sourceMappingURL=priceCalculatorRoutes.js.map