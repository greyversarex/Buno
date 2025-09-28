"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTourFromBlock = exports.addTourToBlock = exports.deleteTourBlock = exports.updateTourBlock = exports.createTourBlock = exports.getTourBlock = exports.getTourBlocks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTourBlocks = async (req, res) => {
    try {
        console.log('Fetching tour blocks...');
        const tourBlocks = await prisma.tourBlock.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        console.log('Found tour blocks:', tourBlocks.length);
        const parsedBlocks = tourBlocks.map((block) => ({
            ...block,
            title: typeof block.title === 'string' ? JSON.parse(block.title) : block.title,
            description: block.description && typeof block.description === 'string' ? JSON.parse(block.description) : block.description
        }));
        return res.json({
            success: true,
            data: parsedBlocks
        });
    }
    catch (error) {
        console.error('Error fetching tour blocks:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching tour blocks',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getTourBlocks = getTourBlocks;
const getTourBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const tourBlock = await prisma.tourBlock.findUnique({
            where: { id: parseInt(id) },
            include: {
                tours: {
                    include: {
                        category: true,
                        reviews: true,
                        _count: {
                            select: { reviews: true }
                        }
                    }
                }
            }
        });
        if (!tourBlock) {
            return res.status(404).json({
                success: false,
                message: 'Tour block not found'
            });
        }
        return res.json({
            success: true,
            data: tourBlock
        });
    }
    catch (error) {
        console.error('Error fetching tour block:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching tour block'
        });
    }
};
exports.getTourBlock = getTourBlock;
const createTourBlock = async (req, res) => {
    try {
        const { title, description, slug, isActive = true, sortOrder = 0 } = req.body;
        const tourBlock = await prisma.tourBlock.create({
            data: {
                title: typeof title === 'string' ? title : JSON.stringify(title),
                description: description ? (typeof description === 'string' ? description : JSON.stringify(description)) : null,
                slug,
                isActive,
                sortOrder
            }
        });
        return res.status(201).json({
            success: true,
            data: tourBlock,
            message: 'Tour block created successfully'
        });
    }
    catch (error) {
        console.error('Error creating tour block:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating tour block'
        });
    }
};
exports.createTourBlock = createTourBlock;
const updateTourBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, slug, isActive, sortOrder } = req.body;
        const existingBlock = await prisma.tourBlock.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingBlock) {
            return res.status(404).json({
                success: false,
                message: 'Tour block not found'
            });
        }
        const tourBlock = await prisma.tourBlock.update({
            where: { id: parseInt(id) },
            data: {
                ...(title && { title: typeof title === 'string' ? title : JSON.stringify(title) }),
                ...(description !== undefined && { description: description ? (typeof description === 'string' ? description : JSON.stringify(description)) : null }),
                ...(slug && { slug }),
                ...(isActive !== undefined && { isActive }),
                ...(sortOrder !== undefined && { sortOrder })
            }
        });
        return res.json({
            success: true,
            data: tourBlock,
            message: 'Tour block updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating tour block:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating tour block'
        });
    }
};
exports.updateTourBlock = updateTourBlock;
const deleteTourBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const existingBlock = await prisma.tourBlock.findUnique({
            where: { id: parseInt(id) },
            include: { tours: true }
        });
        if (!existingBlock) {
            return res.status(404).json({
                success: false,
                message: 'Tour block not found'
            });
        }
        if (existingBlock.tours.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete tour block with assigned tours'
            });
        }
        await prisma.tourBlock.delete({
            where: { id: parseInt(id) }
        });
        return res.json({
            success: true,
            message: 'Tour block deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting tour block:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting tour block'
        });
    }
};
exports.deleteTourBlock = deleteTourBlock;
const addTourToBlock = async (req, res) => {
    try {
        const { blockId, tourId } = req.params;
        const tour = await prisma.tour.update({
            where: { id: parseInt(tourId) },
            data: {
                tourBlockId: parseInt(blockId)
            }
        });
        return res.json({
            success: true,
            data: tour,
            message: 'Tour added to block successfully'
        });
    }
    catch (error) {
        console.error('Error adding tour to block:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding tour to block'
        });
    }
};
exports.addTourToBlock = addTourToBlock;
const removeTourFromBlock = async (req, res) => {
    try {
        const { tourId } = req.params;
        const tour = await prisma.tour.update({
            where: { id: parseInt(tourId) },
            data: {
                tourBlockId: null
            }
        });
        return res.json({
            success: true,
            data: tour,
            message: 'Tour removed from block successfully'
        });
    }
    catch (error) {
        console.error('Error removing tour from block:', error);
        return res.status(500).json({
            success: false,
            message: 'Error removing tour from block'
        });
    }
};
exports.removeTourFromBlock = removeTourFromBlock;
//# sourceMappingURL=tourBlockController.js.map