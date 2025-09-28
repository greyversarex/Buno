"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotelController_1 = require("../controllers/hotelController");
const router = (0, express_1.Router)();
router.get('/', hotelController_1.getHotels);
router.get('/:id', hotelController_1.getHotel);
router.post('/', hotelController_1.createHotel);
router.put('/:id', hotelController_1.updateHotel);
router.delete('/:id', hotelController_1.deleteHotel);
router.post('/tours/:tourId/hotels/:hotelId', hotelController_1.addHotelToTour);
router.delete('/tours/:tourId/hotels/:hotelId', hotelController_1.removeHotelFromTour);
router.post('/link', hotelController_1.addHotelToTour);
exports.default = router;
//# sourceMappingURL=hotelRoutes.js.map