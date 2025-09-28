"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
router.post('/start', bookingController_1.bookingController.startBooking);
router.put('/:id/step1', bookingController_1.bookingController.updateBookingStep1);
router.put('/:id/details', bookingController_1.bookingController.updateBookingDetails);
router.post('/:id/create-order', bookingController_1.bookingController.createOrderFromBooking);
router.put('/:id/pay', bookingController_1.bookingController.processPayment);
router.get('/:id', bookingController_1.bookingController.getBooking);
router.get('/tour/:tourId/hotels', bookingController_1.bookingController.getTourHotels);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map