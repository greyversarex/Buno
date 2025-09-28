"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourGuideAuth_1 = require("../middleware/tourGuideAuth");
const tourGuideController_1 = require("../controllers/tourGuideController");
const router = express_1.default.Router();
router.post('/login', tourGuideController_1.loginTourGuide);
router.post('/create-with-auth', tourGuideController_1.upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
]), tourGuideController_1.createTourGuideProfile);
router.get('/tours', tourGuideAuth_1.authenticateTourGuide, tourGuideController_1.getGuideTours);
router.get('/tours/:id', tourGuideAuth_1.authenticateTourGuide, tourGuideController_1.getTourDetails);
router.post('/tours/:id/start', tourGuideAuth_1.authenticateTourGuide, tourGuideController_1.startTour);
router.post('/tours/:id/finish', tourGuideAuth_1.authenticateTourGuide, tourGuideController_1.finishTour);
router.post('/tours/:id/collect-reviews', tourGuideAuth_1.authenticateTourGuide, tourGuideController_1.collectReviews);
router.post('/tours/:id/guide-review', tourGuideAuth_1.authenticateTourGuide, tourGuideController_1.leaveGuideReview);
router.put('/profile/:id', tourGuideController_1.upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
]), tourGuideController_1.updateGuideProfile);
router.post('/profile/:id/avatar', tourGuideController_1.upload.single('avatar'), tourGuideController_1.uploadGuideAvatar);
router.post('/profile/:id/documents', tourGuideController_1.upload.array('documents', 10), tourGuideController_1.uploadGuideDocuments);
router.delete('/profile/:id/document', tourGuideController_1.deleteGuideDocument);
exports.default = router;
//# sourceMappingURL=tourGuideRoutes.js.map