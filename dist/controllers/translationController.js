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
Object.defineProperty(exports, "__esModule", { value: true });
exports.translationController = exports.TranslationController = void 0;
const translationService_1 = require("../services/translationService");
const index_1 = require("../models/index");
class TranslationController {
    async translateText(req, res) {
        try {
            const { text, fromLanguage, toLanguage, context } = req.body;
            if (!text || !fromLanguage || !toLanguage) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: text, fromLanguage, toLanguage'
                });
            }
            const result = await translationService_1.translationService.translateText({
                text,
                fromLanguage,
                toLanguage,
                context
            });
            return res.json({
                success: true,
                data: result,
                message: 'Text translated successfully'
            });
        }
        catch (error) {
            console.error('Translation controller error:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Translation failed'
            });
        }
    }
    async translateTour(req, res) {
        try {
            const tourId = parseInt(req.params.id);
            if (isNaN(tourId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid tour ID'
                });
            }
            const tour = await index_1.TourModel.findById(tourId);
            if (!tour) {
                return res.status(404).json({
                    success: false,
                    error: 'Tour not found'
                });
            }
            const existingTitle = JSON.parse(tour.title);
            const existingDescription = JSON.parse(tour.description);
            const [translatedTitle, translatedDescription] = await Promise.all([
                translationService_1.translationService.translateMultilingualContent(existingTitle, 'tour_description'),
                translationService_1.translationService.translateMultilingualContent(existingDescription, 'tour_description')
            ]);
            const updatedTour = await index_1.TourModel.update(tourId, {
                title: translatedTitle,
                description: translatedDescription
            });
            return res.json({
                success: true,
                data: updatedTour,
                message: 'Tour translations completed successfully'
            });
        }
        catch (error) {
            console.error('Tour translation error:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Tour translation failed'
            });
        }
    }
    async detectLanguage(req, res) {
        try {
            const { text } = req.body;
            if (!text) {
                return res.status(400).json({
                    success: false,
                    error: 'Text is required'
                });
            }
            const detectedLanguage = await translationService_1.translationService.detectLanguage(text);
            return res.json({
                success: true,
                data: {
                    language: detectedLanguage,
                    text: text
                },
                message: 'Language detected successfully'
            });
        }
        catch (error) {
            console.error('Language detection error:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Language detection failed'
            });
        }
    }
    async getSupportedLanguages(req, res) {
        try {
            const { SUPPORTED_LANGUAGES } = await Promise.resolve().then(() => __importStar(require('../services/translationService')));
            return res.json({
                success: true,
                data: SUPPORTED_LANGUAGES,
                message: 'Supported languages retrieved successfully'
            });
        }
        catch (error) {
            console.error('Get languages error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve supported languages'
            });
        }
    }
    async batchTranslateTours(req, res) {
        try {
            const { tourIds } = req.body;
            if (!Array.isArray(tourIds) || tourIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'tourIds array is required'
                });
            }
            const results = [];
            const errors = [];
            for (const tourId of tourIds) {
                try {
                    const tour = await index_1.TourModel.findById(parseInt(tourId));
                    if (!tour) {
                        errors.push(`Tour ${tourId} not found`);
                        continue;
                    }
                    const existingTitle = JSON.parse(tour.title);
                    const existingDescription = JSON.parse(tour.description);
                    const [translatedTitle, translatedDescription] = await Promise.all([
                        translationService_1.translationService.translateMultilingualContent(existingTitle, 'tour_description'),
                        translationService_1.translationService.translateMultilingualContent(existingDescription, 'tour_description')
                    ]);
                    const updatedTour = await index_1.TourModel.update(parseInt(tourId), {
                        title: translatedTitle,
                        description: translatedDescription
                    });
                    results.push({
                        tourId: tourId,
                        success: true,
                        tour: updatedTour
                    });
                }
                catch (error) {
                    errors.push(`Tour ${tourId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
            return res.json({
                success: true,
                data: {
                    successful: results,
                    errors: errors,
                    totalProcessed: tourIds.length,
                    successCount: results.length,
                    errorCount: errors.length
                },
                message: `Batch translation completed. ${results.length} successful, ${errors.length} errors.`
            });
        }
        catch (error) {
            console.error('Batch translation error:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Batch translation failed'
            });
        }
    }
}
exports.TranslationController = TranslationController;
exports.translationController = new TranslationController();
//# sourceMappingURL=translationController.js.map