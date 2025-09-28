"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const objectStorage_1 = require("../services/objectStorage");
const router = (0, express_1.Router)();
router.get('/public-objects/:filePath', async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new objectStorage_1.ObjectStorageService();
    try {
        const file = await objectStorageService.searchPublicObject(filePath);
        if (!file) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
        await objectStorageService.downloadObject(file, res);
    }
    catch (error) {
        console.error('Error searching for public object:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/objects/uploads/:fileName', async (req, res) => {
    const objectStorageService = new objectStorage_1.ObjectStorageService();
    try {
        const fileName = req.params.fileName;
        const objectFile = await objectStorageService.getObjectEntityFile(`/objects/uploads/${fileName}`);
        await objectStorageService.downloadObject(objectFile, res);
    }
    catch (error) {
        console.error('Error checking object access:', error);
        if (error instanceof objectStorage_1.ObjectNotFoundError) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(500);
    }
});
router.post('/objects/upload', async (req, res) => {
    try {
        const mockUploadURL = '/api/upload/simple';
        res.json({ uploadURL: mockUploadURL });
    }
    catch (error) {
        console.error('Error getting upload URL:', error);
        res.status(500).json({ error: 'Failed to get upload URL' });
    }
});
router.put('/images', async (req, res) => {
    if (!req.body.imageURL) {
        res.status(400).json({ error: 'imageURL is required' });
        return;
    }
    try {
        const objectStorageService = new objectStorage_1.ObjectStorageService();
        const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);
        res.status(200).json({
            objectPath: objectPath,
            success: true
        });
    }
    catch (error) {
        console.error('Error setting image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=objectStorageRoutes.js.map