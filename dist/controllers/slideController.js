"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSlideOrder = exports.deleteSlide = exports.updateSlide = exports.createSlide = exports.getSlideById = exports.getAllSlides = exports.getSlides = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSlides = async (req, res) => {
    try {
        const slides = await prisma.slide.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });
        res.json({
            success: true,
            data: slides
        });
    }
    catch (error) {
        console.error('Error fetching slides:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch slides'
        });
    }
};
exports.getSlides = getSlides;
const getAllSlides = async (req, res) => {
    try {
        const slides = await prisma.slide.findMany({
            orderBy: { order: 'asc' }
        });
        res.json({
            success: true,
            data: slides
        });
    }
    catch (error) {
        console.error('Error fetching all slides:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch slides'
        });
    }
};
exports.getAllSlides = getAllSlides;
const getSlideById = async (req, res) => {
    try {
        const { id } = req.params;
        const slide = await prisma.slide.findUnique({
            where: { id: parseInt(id) }
        });
        if (!slide) {
            res.status(404).json({
                success: false,
                message: 'Slide not found'
            });
            return;
        }
        res.json({
            success: true,
            data: slide
        });
    }
    catch (error) {
        console.error('Error fetching slide:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch slide'
        });
    }
};
exports.getSlideById = getSlideById;
const createSlide = async (req, res) => {
    try {
        const { title, description, image, link, buttonText, order, isActive } = req.body;
        const slide = await prisma.slide.create({
            data: {
                title: JSON.stringify(title),
                description: JSON.stringify(description),
                image,
                link,
                buttonText: buttonText ? JSON.stringify(buttonText) : null,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true
            }
        });
        res.status(201).json({
            success: true,
            data: slide,
            message: 'Slide created successfully'
        });
    }
    catch (error) {
        console.error('Error creating slide:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create slide'
        });
    }
};
exports.createSlide = createSlide;
const updateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, link, buttonText, order, isActive } = req.body;
        const existingSlide = await prisma.slide.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingSlide) {
            res.status(404).json({
                success: false,
                message: 'Slide not found'
            });
            return;
        }
        const updateData = {};
        if (title !== undefined)
            updateData.title = JSON.stringify(title);
        if (description !== undefined)
            updateData.description = JSON.stringify(description);
        if (image !== undefined)
            updateData.image = image;
        if (link !== undefined)
            updateData.link = link;
        if (buttonText !== undefined)
            updateData.buttonText = buttonText ? JSON.stringify(buttonText) : null;
        if (order !== undefined)
            updateData.order = order;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        updateData.updatedAt = new Date();
        const slide = await prisma.slide.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json({
            success: true,
            data: slide,
            message: 'Slide updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating slide:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update slide'
        });
    }
};
exports.updateSlide = updateSlide;
const deleteSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const existingSlide = await prisma.slide.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingSlide) {
            res.status(404).json({
                success: false,
                message: 'Slide not found'
            });
            return;
        }
        await prisma.slide.delete({
            where: { id: parseInt(id) }
        });
        res.json({
            success: true,
            message: 'Slide deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting slide:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete slide'
        });
    }
};
exports.deleteSlide = deleteSlide;
const updateSlideOrder = async (req, res) => {
    try {
        const { slides } = req.body;
        const updatePromises = slides.map((slide) => prisma.slide.update({
            where: { id: slide.id },
            data: { order: slide.order, updatedAt: new Date() }
        }));
        await Promise.all(updatePromises);
        res.json({
            success: true,
            message: 'Slide order updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating slide order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update slide order'
        });
    }
};
exports.updateSlideOrder = updateSlideOrder;
//# sourceMappingURL=slideController.js.map