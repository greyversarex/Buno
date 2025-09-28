"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeHotelFromTour = exports.addHotelToTour = exports.deleteHotel = exports.updateHotel = exports.createHotel = exports.getHotel = exports.getHotels = void 0;
const models_1 = require("../models");
const getHotels = async (req, res) => {
    try {
        const { tourId } = req.query;
        let hotels;
        if (tourId) {
            hotels = await models_1.HotelModel.findByTourId(parseInt(tourId));
        }
        else {
            hotels = await models_1.HotelModel.findAll();
        }
        return res.json({
            success: true,
            data: hotels
        });
    }
    catch (error) {
        console.error('Error fetching hotels:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching hotels',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getHotels = getHotels;
const getHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await models_1.HotelModel.findById(parseInt(id));
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }
        return res.json({
            success: true,
            data: hotel
        });
    }
    catch (error) {
        console.error('Error fetching hotel:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching hotel',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getHotel = getHotel;
const createHotel = async (req, res) => {
    try {
        const hotelData = req.body;
        const hotel = await models_1.HotelModel.create(hotelData);
        return res.status(201).json({
            success: true,
            data: hotel,
            message: 'Hotel created successfully'
        });
    }
    catch (error) {
        console.error('Error creating hotel:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating hotel',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createHotel = createHotel;
const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotelData = req.body;
        const hotel = await models_1.HotelModel.update(parseInt(id), hotelData);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }
        return res.json({
            success: true,
            data: hotel,
            message: 'Hotel updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating hotel:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating hotel',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateHotel = updateHotel;
const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await models_1.HotelModel.delete(parseInt(id));
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }
        return res.json({
            success: true,
            message: 'Hotel deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting hotel:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting hotel',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteHotel = deleteHotel;
const addHotelToTour = async (req, res) => {
    try {
        const tourId = req.params.tourId || req.body.tourId;
        const hotelId = req.params.hotelId || req.body.hotelId;
        const { pricePerNight, isDefault } = req.body;
        const tourHotel = await models_1.HotelModel.addToTour(parseInt(tourId), parseInt(hotelId), pricePerNight, isDefault);
        return res.json({
            success: true,
            data: tourHotel,
            message: 'Hotel added to tour successfully'
        });
    }
    catch (error) {
        console.error('Error adding hotel to tour:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding hotel to tour',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.addHotelToTour = addHotelToTour;
const removeHotelFromTour = async (req, res) => {
    try {
        const { tourId, hotelId } = req.params;
        const removed = await models_1.HotelModel.removeFromTour(parseInt(tourId), parseInt(hotelId));
        if (!removed) {
            return res.status(404).json({
                success: false,
                message: 'Hotel-Tour association not found'
            });
        }
        return res.json({
            success: true,
            message: 'Hotel removed from tour successfully'
        });
    }
    catch (error) {
        console.error('Error removing hotel from tour:', error);
        return res.status(500).json({
            success: false,
            message: 'Error removing hotel from tour',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.removeHotelFromTour = removeHotelFromTour;
//# sourceMappingURL=hotelController.js.map