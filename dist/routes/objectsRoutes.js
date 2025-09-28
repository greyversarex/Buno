"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/images/';
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
router.post('/upload', async (req, res) => {
    try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = 'image-' + uniqueSuffix + '.png';
        const uploadURL = `/api/objects/direct/${fileName}`;
        res.json({
            success: true,
            uploadURL: uploadURL,
            fileName: fileName
        });
    }
    catch (error) {
        console.error('Error generating upload URL:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate upload URL'
        });
    }
});
router.put('/direct/:fileName', async (req, res) => {
    try {
        const { fileName } = req.params;
        const uploadPath = 'uploads/images/';
        const filePath = path_1.default.join(uploadPath, fileName);
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        const fileStream = fs_1.default.createWriteStream(filePath);
        req.pipe(fileStream);
        fileStream.on('finish', () => {
            const publicURL = `/uploads/images/${fileName}`;
            res.json({
                success: true,
                url: publicURL,
                fileName: fileName
            });
        });
        fileStream.on('error', (error) => {
            console.error('File write error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to save file'
            });
        });
    }
    catch (error) {
        console.error('Error handling direct upload:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload file'
        });
    }
});
exports.default = router;
//# sourceMappingURL=objectsRoutes.js.map