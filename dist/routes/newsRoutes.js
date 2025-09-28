"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsController_1 = require("../controllers/newsController");
const router = express_1.default.Router();
router.get('/', newsController_1.getAllNews);
router.get('/slug/:slug', newsController_1.getNewsBySlug);
router.get('/:id', newsController_1.getNewsById);
router.post('/newsletter/subscribe', newsController_1.subscribeNewsletter);
router.get('/admin/all', newsController_1.getAllNewsAdmin);
router.get('/admin/stats', newsController_1.getNewsStats);
router.post('/admin/create', newsController_1.createNews);
router.put('/admin/:id', newsController_1.updateNews);
router.delete('/admin/:id', newsController_1.deleteNews);
router.get('/admin/newsletter/subscribers', newsController_1.getNewsletterSubscribers);
exports.default = router;
//# sourceMappingURL=newsRoutes.js.map