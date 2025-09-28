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
        const uploadDir = 'uploads/images';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});
router.post('/simple', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No image file uploaded' });
            return;
        }
        const imagePath = `/uploads/images/${req.file.filename}`;
        res.json({
            success: true,
            imagePath: imagePath,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    }
    catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
router.get('/images/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path_1.default.join(process.cwd(), 'uploads', 'images', filename);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }
        res.sendFile(filePath);
    }
    catch (error) {
        console.error('Error serving image:', error);
        res.status(500).json({ error: 'Failed to serve image' });
    }
});
router.put('/', async (req, res) => {
    try {
        const { imageURL } = req.body;
        if (!imageURL) {
            res.status(400).json({ error: 'No image URL provided' });
            return;
        }
        const objectPath = imageURL.replace(/^.*\/uploads\//, '/uploads/');
        res.json({
            success: true,
            objectPath: objectPath,
            imageURL: imageURL
        });
    }
    catch (error) {
        console.error('Error processing image URL:', error);
        res.status(500).json({ error: 'Failed to process image URL' });
    }
});
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No image file uploaded' });
            return;
        }
        const imagePath = `/uploads/images/${req.file.filename}`;
        res.json({
            success: true,
            imagePath: imagePath,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    }
    catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map