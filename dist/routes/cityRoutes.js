"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cityController_1 = require("../controllers/cityController");
const router = (0, express_1.Router)();
router.get('/', cityController_1.CityController.getAllCities);
router.get('/country/:countryId', cityController_1.CityController.getCitiesByCountry);
router.get('/:id', cityController_1.CityController.getCityById);
router.post('/', cityController_1.CityController.createCity);
router.put('/:id', cityController_1.CityController.updateCity);
router.delete('/:id', cityController_1.CityController.deleteCity);
exports.default = router;
//# sourceMappingURL=cityRoutes.js.map