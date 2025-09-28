"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkGuideToTour = exports.deleteGuide = exports.updateGuide = exports.getGuidesByTour = exports.getGuideById = exports.getAllGuides = exports.createGuide = void 0;
const database_1 = __importDefault(require("../config/database"));
function safeJsonParse(value) {
    if (!value)
        return null;
    try {
        if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
            return JSON.parse(value);
        }
        return value;
    }
    catch (error) {
        return value;
    }
}
const createGuide = async (req, res) => {
    try {
        const { name, description, photo, languages, contact, experience, rating, isActive } = req.body;
        const experienceNumber = experience ? parseInt(experience) : null;
        const ratingNumber = rating ? parseFloat(rating) : null;
        const guide = await database_1.default.guide.create({
            data: {
                name: typeof name === 'string' ? name : JSON.stringify(name),
                description: description ? (typeof description === 'string' ? description : JSON.stringify(description)) : null,
                photo,
                languages: typeof languages === 'string' ? languages : JSON.stringify(languages),
                contact: contact ? (typeof contact === 'string' ? contact : JSON.stringify(contact)) : null,
                experience: experienceNumber,
                rating: ratingNumber,
                isActive: isActive !== undefined ? isActive : true
            },
        });
        return res.status(201).json({
            success: true,
            message: 'Guide created successfully',
            data: guide,
        });
    }
    catch (error) {
        console.error('Error creating guide:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create guide',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createGuide = createGuide;
const getAllGuides = async (req, res) => {
    try {
        const guides = await database_1.default.guide.findMany({
            where: {
                isActive: true,
            },
            include: {
                tourGuides: {
                    include: {
                        tour: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
            },
        });
        const formattedGuides = guides.map(guide => {
            try {
                let photoPath = guide.photo;
                if (photoPath && photoPath.includes('/home/runner/workspace/uploads/')) {
                    photoPath = photoPath.replace('/home/runner/workspace/', '/');
                }
                return {
                    ...guide,
                    photo: photoPath,
                    name: typeof guide.name === 'string' && guide.name.startsWith('{') ? JSON.parse(guide.name) : guide.name,
                    description: guide.description && typeof guide.description === 'string' && guide.description.startsWith('{') ? JSON.parse(guide.description) : guide.description,
                    languages: typeof guide.languages === 'string' && (guide.languages.startsWith('[') || guide.languages.startsWith('"[')) ?
                        JSON.parse(guide.languages.replace(/^"(.+)"$/, '$1')) : guide.languages,
                    contact: guide.contact && typeof guide.contact === 'string' && guide.contact.startsWith('{') ? JSON.parse(guide.contact) : guide.contact,
                };
            }
            catch (error) {
                console.error('Error parsing guide data:', error, guide);
                return guide;
            }
        });
        return res.json({
            success: true,
            data: formattedGuides,
        });
    }
    catch (error) {
        console.error('Error fetching guides:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch guides',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllGuides = getAllGuides;
const getGuideById = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await database_1.default.guide.findUnique({
            where: { id: parseInt(id) },
            include: {
                tourGuides: {
                    include: {
                        tour: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
            },
        });
        if (!guide) {
            return res.status(404).json({
                success: false,
                message: 'Guide not found',
            });
        }
        const formattedGuide = {
            ...guide,
            name: safeJsonParse(guide.name),
            description: safeJsonParse(guide.description),
            languages: safeJsonParse(guide.languages),
            contact: safeJsonParse(guide.contact),
        };
        return res.json({
            success: true,
            data: formattedGuide,
        });
    }
    catch (error) {
        console.error('Error fetching guide:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch guide',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getGuideById = getGuideById;
const getGuidesByTour = async (req, res) => {
    try {
        const { tourId } = req.params;
        const tourGuides = await database_1.default.tourGuide.findMany({
            where: {
                tourId: parseInt(tourId),
                guide: {
                    isActive: true,
                },
            },
            include: {
                guide: true,
            },
            orderBy: {
                isDefault: 'desc',
            },
        });
        const formattedGuides = tourGuides.map(tg => ({
            ...tg.guide,
            name: JSON.parse(tg.guide.name),
            description: tg.guide.description ? JSON.parse(tg.guide.description) : null,
            languages: JSON.parse(tg.guide.languages),
            contact: tg.guide.contact ? JSON.parse(tg.guide.contact) : null,
            isDefault: tg.isDefault,
        }));
        return res.json({
            success: true,
            data: formattedGuides,
        });
    }
    catch (error) {
        console.error('Error fetching guides for tour:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch guides for tour',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getGuidesByTour = getGuidesByTour;
const updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guideData = req.body;
        const updateData = {};
        if (guideData.name) {
            updateData.name = typeof guideData.name === 'string' ? guideData.name : JSON.stringify(guideData.name);
        }
        if (guideData.description) {
            updateData.description = typeof guideData.description === 'string' ? guideData.description : JSON.stringify(guideData.description);
        }
        if (guideData.photo !== undefined)
            updateData.photo = guideData.photo;
        if (guideData.languages) {
            updateData.languages = typeof guideData.languages === 'string' ? guideData.languages : JSON.stringify(guideData.languages);
        }
        if (guideData.contact) {
            updateData.contact = typeof guideData.contact === 'string' ? guideData.contact : JSON.stringify(guideData.contact);
        }
        if (guideData.experience !== undefined)
            updateData.experience = guideData.experience;
        if (guideData.rating !== undefined)
            updateData.rating = guideData.rating;
        const guide = await database_1.default.guide.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        return res.json({
            success: true,
            message: 'Guide updated successfully',
            data: guide,
        });
    }
    catch (error) {
        console.error('Error updating guide:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update guide',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.updateGuide = updateGuide;
const deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.guide.update({
            where: { id: parseInt(id) },
            data: { isActive: false },
        });
        return res.json({
            success: true,
            message: 'Guide deactivated successfully',
        });
    }
    catch (error) {
        console.error('Error deactivating guide:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to deactivate guide',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.deleteGuide = deleteGuide;
const linkGuideToTour = async (req, res) => {
    try {
        const { tourId, guideId, isDefault } = req.body;
        if (isDefault) {
            await database_1.default.tourGuide.updateMany({
                where: { tourId },
                data: { isDefault: false },
            });
        }
        const tourGuide = await database_1.default.tourGuide.upsert({
            where: {
                tourId_guideId: {
                    tourId,
                    guideId,
                },
            },
            update: {
                isDefault,
            },
            create: {
                tourId,
                guideId,
                isDefault,
            },
        });
        return res.json({
            success: true,
            message: 'Guide linked to tour successfully',
            data: tourGuide,
        });
    }
    catch (error) {
        console.error('Error linking guide to tour:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to link guide to tour',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.linkGuideToTour = linkGuideToTour;
//# sourceMappingURL=guideController.js.map