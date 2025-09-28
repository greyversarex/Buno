"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const reviewController = __importStar(require("../controllers/reviewController"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'attached_assets/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'review-photo-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Только изображения разрешены!'));
        }
    }
});
router.post('/', reviewController.createReview);
router.get('/tours/:tourId', reviewController.getReviewsByTour);
router.get('/tours/:tourId/stats', reviewController.getReviewStats);
router.post('/upload-photos', upload.array('photos', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Не загружено ни одного файла'
            });
        }
        const files = req.files;
        const photoUrls = files.map(file => `/attached_assets/${file.filename}`);
        return res.json({
            success: true,
            data: {
                photos: photoUrls
            },
            message: `Загружено ${files.length} фотографий`
        });
    }
    catch (error) {
        console.error('Ошибка загрузки фотографий:', error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка при загрузке фотографий'
        });
    }
});
router.get('/', reviewController.getAllReviews);
router.put('/:id/moderate', reviewController.moderateReview);
router.put('/:id/approve', reviewController.approveReview);
router.put('/:id/reject', reviewController.rejectReview);
router.delete('/:id', reviewController.deleteReview);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map