"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tourRoutes_1 = __importDefault(require("./tourRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const hotelRoutes_1 = __importDefault(require("./hotelRoutes"));
const guideRoutes_1 = __importDefault(require("./guideRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const reviewRoutes_1 = __importDefault(require("./reviewRoutes"));
const customerRoutes_1 = __importDefault(require("./customerRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const cmsRoutes_1 = __importDefault(require("./cmsRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const publicRoutes_1 = __importDefault(require("./publicRoutes"));
const tourBlockRoutes_1 = __importDefault(require("./tourBlockRoutes"));
const translationRoutes_1 = __importDefault(require("./translationRoutes"));
const exchangeRateRoutes_1 = __importDefault(require("./exchangeRateRoutes"));
const newsRoutes_1 = __importDefault(require("./newsRoutes"));
const slideRoutes_1 = __importDefault(require("./slideRoutes"));
const objectStorageRoutes_1 = __importDefault(require("./objectStorageRoutes"));
const bookingRoutes_1 = __importDefault(require("./bookingRoutes"));
const uploadRoutes_1 = __importDefault(require("./uploadRoutes"));
const objectsRoutes_1 = __importDefault(require("./objectsRoutes"));
const priceCalculatorRoutes_1 = __importDefault(require("./priceCalculatorRoutes"));
const tourGuideRoutes_1 = __importDefault(require("./tourGuideRoutes"));
const adminTourHistoryRoutes_1 = __importDefault(require("./adminTourHistoryRoutes"));
const driverRoutes_1 = __importDefault(require("./driverRoutes"));
const countryRoutes_1 = __importDefault(require("./countryRoutes"));
const cityRoutes_1 = __importDefault(require("./cityRoutes"));
const router = (0, express_1.Router)();
router.use('/tours', tourRoutes_1.default);
router.use('/categories', categoryRoutes_1.default);
router.use('/hotels', hotelRoutes_1.default);
router.use('/guides', guideRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
router.use('/reviews', reviewRoutes_1.default);
router.use('/customers', customerRoutes_1.default);
router.use('/payments', paymentRoutes_1.default);
router.use('/cms', cmsRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
router.use('/public', publicRoutes_1.default);
router.use('/tour-blocks', tourBlockRoutes_1.default);
router.use('/translate', translationRoutes_1.default);
router.use('/exchange-rates', exchangeRateRoutes_1.default);
router.use('/news', newsRoutes_1.default);
router.use('/slides', slideRoutes_1.default);
router.use('/booking', bookingRoutes_1.default);
router.use('/images', uploadRoutes_1.default);
router.use('/objects', objectsRoutes_1.default);
router.use('/price-calculator', priceCalculatorRoutes_1.default);
router.use('/guide', tourGuideRoutes_1.default);
router.use('/admin', adminTourHistoryRoutes_1.default);
router.use('/drivers', driverRoutes_1.default);
router.use('/countries', countryRoutes_1.default);
router.use('/cities', cityRoutes_1.default);
router.use('/', objectStorageRoutes_1.default);
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Tajik Trails API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '2.0.0'
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map