"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tourController_1 = require("../controllers/tourController");
const router = (0, express_1.Router)();
router.get('/', tourController_1.CategoryController.getAllCategories);
router.get('/:id', tourController_1.CategoryController.getCategoryById);
router.post('/', tourController_1.CategoryController.createCategory);
router.put('/:id', tourController_1.CategoryController.updateCategory);
router.delete('/:id', tourController_1.CategoryController.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map