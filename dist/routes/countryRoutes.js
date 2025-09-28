"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const countryController_1 = require("../controllers/countryController");
const router = (0, express_1.Router)();
router.get('/', countryController_1.CountryController.getAllCountries);
router.get('/:id', countryController_1.CountryController.getCountryById);
router.post('/', countryController_1.CountryController.createCountry);
router.put('/:id', countryController_1.CountryController.updateCountry);
router.delete('/:id', countryController_1.CountryController.deleteCountry);
exports.default = router;
//# sourceMappingURL=countryRoutes.js.map