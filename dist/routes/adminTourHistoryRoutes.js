"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourHistoryController_1 = require("../controllers/tourHistoryController");
const router = express_1.default.Router();
router.get('/tours/history/active', tourHistoryController_1.getActiveTours);
router.get('/tours/history/finished', tourHistoryController_1.getFinishedTours);
router.get('/tours/:id', tourHistoryController_1.getTourDetailsAdmin);
router.post('/tour-guides', tourHistoryController_1.createTourGuide);
router.get('/tour-guides', tourHistoryController_1.getAllTourGuides);
router.put('/tour-guides/:id', tourHistoryController_1.updateTourGuide);
router.delete('/tour-guides/:id', tourHistoryController_1.deleteTourGuide);
router.post('/tours/assign-guide', tourHistoryController_1.assignGuideToTour);
exports.default = router;
//# sourceMappingURL=adminTourHistoryRoutes.js.map