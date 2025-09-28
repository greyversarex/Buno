"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exchangeRateController_1 = require("../controllers/exchangeRateController");
const router = (0, express_1.Router)();
router.get('/', exchangeRateController_1.getExchangeRates);
router.get('/map', exchangeRateController_1.getExchangeRatesMap);
router.get('/convert', exchangeRateController_1.convertPrice);
router.post('/initialize', exchangeRateController_1.initializeExchangeRates);
router.put('/:currency', exchangeRateController_1.updateExchangeRate);
exports.default = router;
//# sourceMappingURL=exchangeRateRoutes.js.map