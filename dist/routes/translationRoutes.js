"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const translationController_1 = require("../controllers/translationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/text', auth_1.authenticateJWT, (req, res) => translationController_1.translationController.translateText(req, res));
router.post('/tour/:id', auth_1.authenticateJWT, (req, res) => translationController_1.translationController.translateTour(req, res));
router.post('/tours/batch', auth_1.authenticateJWT, (req, res) => translationController_1.translationController.batchTranslateTours(req, res));
router.post('/detect', auth_1.authenticateJWT, (req, res) => translationController_1.translationController.detectLanguage(req, res));
router.get('/languages', (req, res) => translationController_1.translationController.getSupportedLanguages(req, res));
exports.default = router;
//# sourceMappingURL=translationRoutes.js.map