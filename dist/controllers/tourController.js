"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = exports.BookingRequestController = exports.CategoryController = exports.TourController = void 0;
const models_1 = require("../models");
const email_1 = require("../config/email");
const database_1 = __importDefault(require("../config/database"));
class TourController {
    static async getAllTours(req, res, next) {
        try {
            const { blockId, limit } = req.query;
            let filters = {};
            if (blockId) {
                filters.tourBlockId = parseInt(blockId);
            }
            const tours = await models_1.TourModel.search(filters);
            const limitedTours = limit ? tours.slice(0, parseInt(limit)) : tours;
            const parsedTours = limitedTours.map((tour) => {
                try {
                    const tourWithoutImages = { ...tour };
                    delete tourWithoutImages.mainImage;
                    delete tourWithoutImages.images;
                    return {
                        ...tourWithoutImages,
                        title: tour.title ? JSON.parse(tour.title) : { ru: '', en: '' },
                        description: tour.description ? JSON.parse(tour.description) : { ru: '', en: '' },
                        category: tour.category ? {
                            ...tour.category,
                            name: tour.category.name ? JSON.parse(tour.category.name) : { ru: '', en: '' }
                        } : null,
                        hasImages: !!(tour.mainImage || tour.images)
                    };
                }
                catch (jsonError) {
                    console.error('Error parsing tour JSON fields:', jsonError, 'Tour ID:', tour.id);
                    const tourWithoutImages = { ...tour };
                    delete tourWithoutImages.mainImage;
                    delete tourWithoutImages.images;
                    return {
                        ...tourWithoutImages,
                        title: { ru: tour.title || '', en: tour.title || '' },
                        description: { ru: tour.description || '', en: tour.description || '' },
                        category: tour.category ? {
                            ...tour.category,
                            name: { ru: tour.category.name || '', en: tour.category.name || '' }
                        } : null,
                        hasImages: !!(tour.mainImage || tour.images)
                    };
                }
            });
            const response = {
                success: true,
                data: parsedTours,
                message: 'Tours retrieved successfully'
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async getTourMainImage(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid tour ID'
                });
            }
            const tour = await models_1.TourModel.findById(id);
            if (!tour) {
                return res.status(404).json({
                    success: false,
                    error: 'Tour not found'
                });
            }
            let imagePath = tour.mainImage;
            if (!imagePath && tour.images) {
                try {
                    const images = JSON.parse(tour.images);
                    if (images && images.length > 0) {
                        imagePath = images[0];
                    }
                }
                catch (e) {
                    console.error('Error parsing tour images:', e);
                }
            }
            if (!imagePath) {
                return res.status(404).json({
                    success: false,
                    error: 'No image found for this tour'
                });
            }
            if (imagePath.startsWith('/objects/')) {
                return res.redirect(imagePath);
            }
            else {
                return res.redirect(imagePath);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getTourById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            console.log('📋 getTourById called with ID:', id);
            if (isNaN(id)) {
                console.log('❌ Invalid tour ID provided:', req.params.id);
                return res.status(400).json({
                    success: false,
                    error: 'Invalid tour ID'
                });
            }
            console.log('🔍 Searching for tour with ID:', id);
            const tour = await models_1.TourModel.findById(id);
            console.log('📦 Found tour:', tour ? 'Yes' : 'No');
            if (!tour) {
                console.log('❌ Tour not found with ID:', id);
                return res.status(404).json({
                    success: false,
                    error: 'Tour not found'
                });
            }
            let parsedTour;
            try {
                parsedTour = {
                    ...tour,
                    title: tour.title ? JSON.parse(tour.title) : { ru: '', en: '' },
                    description: tour.description ? JSON.parse(tour.description) : { ru: '', en: '' },
                    category: tour.category ? {
                        ...tour.category,
                        name: tour.category.name ? JSON.parse(tour.category.name) : { ru: '', en: '' }
                    } : null
                };
            }
            catch (jsonError) {
                console.error('Error parsing tour JSON fields:', jsonError, 'Tour ID:', tour.id);
                parsedTour = {
                    ...tour,
                    title: { ru: tour.title || '', en: tour.title || '' },
                    description: { ru: tour.description || '', en: tour.description || '' },
                    category: tour.category ? {
                        ...tour.category,
                        name: { ru: tour.category.name || '', en: tour.category.name || '' }
                    } : null
                };
            }
            const response = {
                success: true,
                data: parsedTour,
                message: 'Tour retrieved successfully'
            };
            console.log('✅ Returning tour data successfully for ID:', id);
            return res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ Error in getTourById:', error);
            return next(error);
        }
    }
    static async createTour(req, res, next) {
        try {
            console.log('Creating tour with data:', req.body);
            let { title, description, shortDescription, duration, price, priceType, originalPrice, categoryId, tourBlockId, countryId, cityId, country, city, durationDays, format, tourType, difficulty, maxPeople, minPeople, mainImage, images, services, highlights, itinerary, included, includes, excluded, pickupInfo, startTimeOptions, languages, availableMonths, availableDays, isFeatured, startDate, endDate, rating, reviewsCount, hotelIds, guideIds, driverIds, pricingComponents } = req.body;
            if (typeof title === 'string') {
                try {
                    title = JSON.parse(title);
                    console.log('Parsed title:', title);
                }
                catch (e) {
                    console.error('Failed to parse title:', e);
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid title format'
                    });
                }
            }
            if (!description && shortDescription) {
                description = shortDescription;
                console.log('Using shortDescription as description:', shortDescription);
            }
            if (typeof description === 'string') {
                try {
                    description = JSON.parse(description);
                    console.log('Parsed description:', description);
                }
                catch (e) {
                    console.error('Failed to parse description:', e);
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid description format'
                    });
                }
            }
            if (!title || !title.en || !title.ru) {
                return res.status(400).json({
                    success: false,
                    error: 'Title is required in both English and Russian'
                });
            }
            if (description && (typeof description === 'object')) {
                if (!description.en || !description.ru) {
                    return res.status(400).json({
                        success: false,
                        error: 'Description must have both English and Russian versions if provided'
                    });
                }
            }
            else if (!description) {
                description = { ru: '', en: '' };
                console.log('Using default empty description');
            }
            const finalDuration = duration || durationDays;
            if (!finalDuration) {
                return res.status(400).json({
                    success: false,
                    error: 'Duration is required'
                });
            }
            if (!price) {
                return res.status(400).json({
                    success: false,
                    error: 'Price is required'
                });
            }
            if (!categoryId) {
                return res.status(400).json({
                    success: false,
                    error: 'Category ID is required'
                });
            }
            const categoryIdNumber = parseInt(categoryId);
            const tourBlockIdNumber = tourBlockId ? parseInt(tourBlockId) : undefined;
            const countryIdNumber = countryId ? parseInt(countryId) : undefined;
            const cityIdNumber = cityId ? parseInt(cityId) : undefined;
            const durationDaysNumber = durationDays ? parseInt(durationDays) : undefined;
            const maxPeopleNumber = maxPeople ? parseInt(maxPeople) : undefined;
            const minPeopleNumber = minPeople ? parseInt(minPeople) : undefined;
            const ratingNumber = rating ? parseFloat(rating) : undefined;
            const reviewsCountNumber = reviewsCount ? parseInt(reviewsCount) : undefined;
            if (isNaN(categoryIdNumber)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category ID format'
                });
            }
            console.log('Converted numeric fields:', {
                categoryId: categoryIdNumber,
                tourBlockId: tourBlockIdNumber,
                countryId: countryIdNumber,
                cityId: cityIdNumber,
                durationDays: durationDaysNumber,
                maxPeople: maxPeopleNumber,
                minPeople: minPeopleNumber,
                rating: ratingNumber,
                reviewsCount: reviewsCountNumber
            });
            console.log('🔄 Starting tour creation in database...');
            let tour;
            try {
                tour = await models_1.TourModel.create({
                    title,
                    description,
                    shortDescription: shortDescription || null,
                    duration: String(finalDuration),
                    price: String(price),
                    priceType: priceType || 'за человека',
                    originalPrice: originalPrice || null,
                    categoryId: categoryIdNumber,
                    tourBlockId: tourBlockIdNumber,
                    countryId: countryIdNumber,
                    cityId: cityIdNumber,
                    country: country || null,
                    city: city || null,
                    format: format || null,
                    tourType: tourType || null,
                    durationDays: durationDaysNumber,
                    difficulty: difficulty || null,
                    maxPeople: maxPeopleNumber,
                    minPeople: minPeopleNumber,
                    mainImage: mainImage || null,
                    images: images || null,
                    services: services || null,
                    highlights: highlights || null,
                    itinerary: itinerary || null,
                    included: included || null,
                    includes: includes || null,
                    excluded: excluded || null,
                    pickupInfo: pickupInfo || null,
                    startTimeOptions: startTimeOptions || null,
                    languages: languages || null,
                    availableMonths: availableMonths || null,
                    availableDays: availableDays || null,
                    isFeatured: isFeatured || false,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    rating: ratingNumber,
                    reviewsCount: reviewsCountNumber,
                    pricingComponents: pricingComponents || null
                });
            }
            catch (createError) {
                console.error('❌ Error in TourModel.create:', createError);
                throw createError;
            }
            console.log('✅ Tour created successfully in database with ID:', tour.id);
            if (hotelIds && Array.isArray(hotelIds) && hotelIds.length > 0) {
                console.log('🏨 Creating hotel associations:', hotelIds);
                try {
                    const tourHotelData = hotelIds.map((hotelId) => ({
                        tourId: tour.id,
                        hotelId: hotelId,
                        isDefault: false
                    }));
                    console.log('🏨 TourHotel data to create:', tourHotelData);
                    await database_1.default.tourHotel.createMany({
                        data: tourHotelData
                    });
                    console.log('✅ Hotel associations created successfully');
                }
                catch (hotelError) {
                    console.error('❌ Error creating hotel associations:', hotelError);
                    throw hotelError;
                }
            }
            if (guideIds && Array.isArray(guideIds) && guideIds.length > 0) {
                console.log('👨‍🏫 Creating guide associations:', guideIds);
                try {
                    const tourGuideData = guideIds.map((guideId) => ({
                        tourId: tour.id,
                        guideId: guideId,
                        isDefault: false
                    }));
                    console.log('👨‍🏫 TourGuide data to create:', tourGuideData);
                    await database_1.default.tourGuide.createMany({
                        data: tourGuideData
                    });
                    console.log('✅ Guide associations created successfully');
                }
                catch (guideError) {
                    console.error('❌ Error creating guide associations:', guideError);
                    throw guideError;
                }
            }
            if (driverIds && Array.isArray(driverIds) && driverIds.length > 0) {
                console.log('🚗 Creating driver associations:', driverIds);
                try {
                    const tourDriverData = driverIds.map((driverId) => ({
                        tourId: tour.id,
                        driverId: driverId,
                        isDefault: false
                    }));
                    console.log('🚗 TourDriver data to create:', tourDriverData);
                    await database_1.default.tourDriver.createMany({
                        data: tourDriverData
                    });
                    console.log('✅ Driver associations created successfully');
                }
                catch (driverError) {
                    console.error('❌ Error creating driver associations:', driverError);
                    throw driverError;
                }
            }
            let parsedTour;
            try {
                parsedTour = {
                    ...tour,
                    title: tour.title ? JSON.parse(tour.title) : { ru: '', en: '' },
                    description: tour.description ? JSON.parse(tour.description) : { ru: '', en: '' },
                    category: tour.category ? {
                        ...tour.category,
                        name: tour.category.name ? JSON.parse(tour.category.name) : { ru: '', en: '' }
                    } : null
                };
            }
            catch (jsonError) {
                console.error('Error parsing tour JSON fields:', jsonError, 'Tour ID:', tour.id);
                parsedTour = {
                    ...tour,
                    title: { ru: tour.title || '', en: tour.title || '' },
                    description: { ru: tour.description || '', en: tour.description || '' },
                    category: tour.category ? {
                        ...tour.category,
                        name: { ru: tour.category.name || '', en: tour.category.name || '' }
                    } : null
                };
            }
            const response = {
                success: true,
                data: parsedTour,
                message: 'Tour created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            console.error('❌ Error creating tour:', error);
            if (error instanceof Error) {
                console.error('❌ Error name:', error.name);
                console.error('❌ Error message:', error.message);
                console.error('❌ Error stack:', error.stack);
            }
            if (error instanceof Error && error.message === 'Category not found') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category ID'
                });
            }
            return res.status(500).json({
                success: false,
                error: 'Database error: ' + (error instanceof Error ? error.message : 'Unknown error')
            });
        }
    }
    static async updateTour(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid tour ID'
                });
            }
            let { title, description, duration, price, categoryId, tourBlockId, countryId, cityId, country, city, durationDays, format, tourType, priceType, pickupInfo, startTimeOptions, languages, availableMonths, availableDays, startDate, endDate, shortDescription, mainImage, images, services, highlights, itinerary, included, includes, excluded, difficulty, maxPeople, minPeople, rating, reviewsCount, isFeatured, hotelIds, guideIds, driverIds, pricingComponents } = req.body;
            if (typeof title === 'string') {
                try {
                    title = JSON.parse(title);
                    console.log('Parsed title for update:', title);
                }
                catch (e) {
                    console.error('Failed to parse title:', e);
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid title format'
                    });
                }
            }
            if (typeof description === 'string') {
                try {
                    description = JSON.parse(description);
                    console.log('Parsed description for update:', description);
                }
                catch (e) {
                    console.error('Failed to parse description:', e);
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid description format'
                    });
                }
            }
            if (title && (!title.en || !title.ru)) {
                return res.status(400).json({
                    success: false,
                    error: 'Title must include both English and Russian'
                });
            }
            if (description && (!description.en || !description.ru)) {
                return res.status(400).json({
                    success: false,
                    error: 'Description must include both English and Russian'
                });
            }
            const categoryIdNumber = categoryId ? parseInt(categoryId) : undefined;
            const tourBlockIdNumber = tourBlockId ? parseInt(tourBlockId) : undefined;
            const countryIdNumber = countryId ? parseInt(countryId) : undefined;
            const cityIdNumber = cityId ? parseInt(cityId) : undefined;
            const durationDaysNumber = durationDays ? parseInt(durationDays) : undefined;
            const maxPeopleNumber = maxPeople ? parseInt(maxPeople) : undefined;
            const minPeopleNumber = minPeople ? parseInt(minPeople) : undefined;
            const ratingNumber = rating ? parseFloat(rating) : undefined;
            const reviewsCountNumber = reviewsCount ? parseInt(reviewsCount) : undefined;
            const updateData = {};
            if (title)
                updateData.title = title;
            if (description)
                updateData.description = description;
            if (shortDescription)
                updateData.shortDescription = shortDescription;
            if (duration)
                updateData.duration = String(duration);
            if (price)
                updateData.price = String(price);
            if (categoryIdNumber)
                updateData.categoryId = categoryIdNumber;
            if (tourBlockIdNumber !== undefined)
                updateData.tourBlockId = tourBlockIdNumber;
            if (countryIdNumber !== undefined)
                updateData.countryId = countryIdNumber;
            if (cityIdNumber !== undefined)
                updateData.cityId = cityIdNumber;
            if (country !== undefined)
                updateData.country = country;
            if (city !== undefined)
                updateData.city = city;
            if (durationDaysNumber !== undefined)
                updateData.durationDays = durationDaysNumber;
            if (format !== undefined)
                updateData.format = format;
            if (tourType !== undefined)
                updateData.tourType = tourType;
            if (priceType !== undefined)
                updateData.priceType = priceType;
            if (pickupInfo !== undefined)
                updateData.pickupInfo = pickupInfo;
            if (startTimeOptions !== undefined)
                updateData.startTimeOptions = startTimeOptions;
            if (languages !== undefined)
                updateData.languages = languages;
            if (availableMonths !== undefined)
                updateData.availableMonths = availableMonths;
            if (availableDays !== undefined)
                updateData.availableDays = availableDays;
            if (startDate !== undefined)
                updateData.startDate = startDate;
            if (endDate !== undefined)
                updateData.endDate = endDate;
            if (mainImage !== undefined)
                updateData.mainImage = mainImage;
            if (images !== undefined)
                updateData.images = images;
            if (services !== undefined)
                updateData.services = services;
            if (highlights !== undefined)
                updateData.highlights = highlights;
            if (itinerary !== undefined)
                updateData.itinerary = itinerary;
            if (included !== undefined)
                updateData.included = included;
            if (includes !== undefined)
                updateData.includes = includes;
            if (excluded !== undefined)
                updateData.excluded = excluded;
            if (difficulty !== undefined)
                updateData.difficulty = difficulty;
            if (maxPeopleNumber !== undefined)
                updateData.maxPeople = maxPeopleNumber;
            if (minPeopleNumber !== undefined)
                updateData.minPeople = minPeopleNumber;
            if (ratingNumber !== undefined)
                updateData.rating = ratingNumber;
            if (reviewsCountNumber !== undefined)
                updateData.reviewsCount = reviewsCountNumber;
            if (isFeatured !== undefined)
                updateData.isFeatured = isFeatured;
            if (pricingComponents !== undefined)
                updateData.pricingComponents = pricingComponents;
            if (req.body.assignedGuideId !== undefined) {
                const assignedGuideIdNumber = req.body.assignedGuideId ? parseInt(req.body.assignedGuideId) : null;
                updateData.assignedGuideId = assignedGuideIdNumber;
            }
            const tour = await models_1.TourModel.update(id, updateData);
            if (hotelIds && Array.isArray(hotelIds)) {
                console.log('🏨 Updating hotel associations:', hotelIds);
                await database_1.default.tourHotel.deleteMany({
                    where: { tourId: id }
                });
                if (hotelIds.length > 0) {
                    const tourHotelData = hotelIds.map(hotelId => ({
                        tourId: id,
                        hotelId: hotelId,
                        isDefault: false
                    }));
                    await database_1.default.tourHotel.createMany({
                        data: tourHotelData
                    });
                }
            }
            if (guideIds && Array.isArray(guideIds)) {
                console.log('👨‍🏫 Updating guide associations:', guideIds);
                await database_1.default.tourGuide.deleteMany({
                    where: { tourId: id }
                });
                if (guideIds.length > 0) {
                    const tourGuideData = guideIds.map(guideId => ({
                        tourId: id,
                        guideId: guideId,
                        isDefault: false
                    }));
                    await database_1.default.tourGuide.createMany({
                        data: tourGuideData
                    });
                }
            }
            if (driverIds && Array.isArray(driverIds)) {
                console.log('🚗 Updating driver associations:', driverIds);
                await database_1.default.tourDriver.deleteMany({
                    where: { tourId: id }
                });
                if (driverIds.length > 0) {
                    const tourDriverData = driverIds.map(driverId => ({
                        tourId: id,
                        driverId: driverId,
                        isDefault: false
                    }));
                    await database_1.default.tourDriver.createMany({
                        data: tourDriverData
                    });
                }
            }
            let parsedTour;
            try {
                parsedTour = {
                    ...tour,
                    title: tour.title ? JSON.parse(tour.title) : { ru: '', en: '' },
                    description: tour.description ? JSON.parse(tour.description) : { ru: '', en: '' },
                    category: tour.category ? {
                        ...tour.category,
                        name: tour.category.name ? JSON.parse(tour.category.name) : { ru: '', en: '' }
                    } : null
                };
            }
            catch (jsonError) {
                console.error('Error parsing tour JSON fields:', jsonError, 'Tour ID:', tour.id);
                parsedTour = {
                    ...tour,
                    title: { ru: tour.title || '', en: tour.title || '' },
                    description: { ru: tour.description || '', en: tour.description || '' },
                    category: tour.category ? {
                        ...tour.category,
                        name: { ru: tour.category.name || '', en: tour.category.name || '' }
                    } : null
                };
            }
            const response = {
                success: true,
                data: parsedTour,
                message: 'Tour updated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Category not found') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category ID'
                });
            }
            return next(error);
        }
    }
    static async deleteTour(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid tour ID'
                });
            }
            const existingTour = await models_1.TourModel.findById(id);
            if (!existingTour) {
                return res.status(404).json({
                    success: false,
                    error: 'Tour not found'
                });
            }
            await models_1.TourModel.delete(id);
            const response = {
                success: true,
                message: 'Tour deleted successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async searchTours(req, res, next) {
        try {
            const { query, country, city, format, duration, theme, category, date, dateFrom, dateTo } = req.query;
            const filters = [];
            if (query && typeof query === 'string') {
                const searchQuery = query.toLowerCase().trim();
                const allTours = await models_1.TourModel.findAll();
                const matchingTours = allTours.filter((tour) => {
                    const title = JSON.parse(tour.title);
                    const description = JSON.parse(tour.description);
                    const titleRu = title.ru?.toLowerCase() || '';
                    const descRu = description.ru?.toLowerCase() || '';
                    const cityRu = tour.city?.toLowerCase() || '';
                    const countryRu = tour.country?.toLowerCase() || '';
                    const titleEn = title.en?.toLowerCase() || '';
                    const descEn = description.en?.toLowerCase() || '';
                    return titleRu.includes(searchQuery) ||
                        descRu.includes(searchQuery) ||
                        titleEn.includes(searchQuery) ||
                        descEn.includes(searchQuery) ||
                        cityRu.includes(searchQuery) ||
                        countryRu.includes(searchQuery);
                });
                if (matchingTours.length > 0) {
                    filters.push({ id: { in: matchingTours.map((t) => t.id) } });
                }
                else {
                    const response = {
                        success: true,
                        data: [],
                        message: 'No tours found matching the search criteria'
                    };
                    return res.status(200).json(response);
                }
            }
            if (country) {
                filters.push({ country: country });
            }
            if (city) {
                filters.push({ city: city });
            }
            if (format) {
                const formats = format.split(',');
                filters.push({ format: { in: formats } });
            }
            if (category) {
                const categories = category.split(',');
                filters.push({ theme: { in: categories } });
            }
            if (duration) {
                const durationValue = duration;
                if (durationValue === '1') {
                    filters.push({ durationDays: 1 });
                }
                else if (durationValue === '2-5') {
                    filters.push({
                        durationDays: {
                            gte: 2,
                            lte: 5
                        }
                    });
                }
                else if (durationValue === '6+') {
                    filters.push({
                        durationDays: {
                            gte: 6
                        }
                    });
                }
            }
            if (theme) {
                const themes = theme.split(',');
                filters.push({ theme: { in: themes } });
            }
            if (date) {
                filters.push({ startDate: { gte: date } });
            }
            if (dateFrom || dateTo) {
                const dateConditions = [];
                if (dateFrom) {
                    dateConditions.push({ startDate: { gte: dateFrom } });
                }
                if (dateTo) {
                    dateConditions.push({ endDate: { lte: dateTo } });
                }
                if (dateConditions.length > 0) {
                    filters.push(...dateConditions);
                }
            }
            const tours = await models_1.TourModel.search(filters.length > 0 ? { AND: filters } : {});
            const parsedTours = tours.map((tour) => ({
                ...tour,
                title: JSON.parse(tour.title),
                description: JSON.parse(tour.description),
                category: tour.category ? {
                    ...tour.category,
                    name: JSON.parse(tour.category.name)
                } : null
            }));
            const response = {
                success: true,
                data: parsedTours,
                message: 'Tours searched successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getSearchSuggestions(req, res, next) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'Query parameter is required'
                });
            }
            const searchQuery = query.toLowerCase().trim();
            if (searchQuery.length < 2) {
                return res.status(200).json({
                    success: true,
                    data: [],
                    message: 'Query too short'
                });
            }
            const tours = await models_1.TourModel.findAll();
            const suggestions = [];
            tours.forEach((tour) => {
                const title = JSON.parse(tour.title);
                if (title.ru && title.ru.toLowerCase().includes(searchQuery)) {
                    suggestions.push({
                        text: title.ru,
                        type: 'тур'
                    });
                }
                if (title.en && title.en.toLowerCase().includes(searchQuery)) {
                    suggestions.push({
                        text: title.en,
                        type: 'тур'
                    });
                }
            });
            const locations = [
                'Памир', 'Искандеркуль', 'Душанбе', 'Худжанд', 'Файзабад',
                'Хорог', 'Калаи-Хумб', 'Мургаб', 'Каракуль', 'Ваханский коридор',
                'Самарканд', 'Ташкент', 'Бишкек', 'Алматы'
            ];
            locations.forEach(location => {
                if (location.toLowerCase().includes(searchQuery)) {
                    suggestions.push({
                        text: location,
                        type: 'место'
                    });
                }
            });
            const categories = [
                'Горные туры', 'Трекинг', 'Культурные туры', 'Исторические туры',
                'Природные туры', 'Приключенческие туры', 'Гастрономические туры',
                'Однодневные', 'Многодневные', 'VIP туры'
            ];
            categories.forEach(category => {
                if (category.toLowerCase().includes(searchQuery)) {
                    suggestions.push({
                        text: category,
                        type: 'категория'
                    });
                }
            });
            const uniqueSuggestions = suggestions
                .filter((suggestion, index, self) => index === self.findIndex(s => s.text === suggestion.text))
                .slice(0, 6);
            const response = {
                success: true,
                data: uniqueSuggestions,
                message: 'Search suggestions retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.TourController = TourController;
class CategoryController {
    static async getAllCategories(req, res, next) {
        try {
            const categories = await models_1.CategoryModel.findAll();
            const parsedCategories = categories.map((category) => ({
                ...category,
                name: JSON.parse(category.name)
            }));
            const response = {
                success: true,
                data: parsedCategories,
                message: 'Categories retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getCategoryById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category ID'
                });
            }
            const category = await models_1.CategoryModel.findById(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }
            const parsedCategory = {
                ...category,
                name: JSON.parse(category.name),
                tours: category.tours?.map((tour) => ({
                    ...tour,
                    title: JSON.parse(tour.title),
                    description: JSON.parse(tour.description)
                }))
            };
            const response = {
                success: true,
                data: parsedCategory,
                message: 'Category retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createCategory(req, res, next) {
        try {
            const { name, title } = req.body;
            const categoryName = name || title;
            if (!categoryName || (!categoryName.en && !categoryName.ru)) {
                return res.status(400).json({
                    success: false,
                    error: 'Name is required in both English and Russian'
                });
            }
            const finalName = {
                en: categoryName.en || categoryName.ru || '',
                ru: categoryName.ru || categoryName.en || '',
                tj: categoryName.tj || ''
            };
            const category = await models_1.CategoryModel.create({ name: finalName });
            const parsedCategory = {
                ...category,
                name: JSON.parse(category.name)
            };
            const response = {
                success: true,
                data: parsedCategory,
                message: 'Category created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateCategory(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category ID'
                });
            }
            const { name } = req.body;
            if (name && (!name.en || !name.ru)) {
                return res.status(400).json({
                    success: false,
                    error: 'Name must include both English and Russian'
                });
            }
            const updateData = {};
            if (name)
                updateData.name = name;
            const category = await models_1.CategoryModel.update(id, updateData);
            const parsedCategory = {
                ...category,
                name: JSON.parse(category.name)
            };
            const response = {
                success: true,
                data: parsedCategory,
                message: 'Category updated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteCategory(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category ID'
                });
            }
            const existingCategory = await models_1.CategoryModel.findById(id);
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }
            await models_1.CategoryModel.delete(id);
            const response = {
                success: true,
                message: 'Category deleted successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.CategoryController = CategoryController;
class BookingRequestController {
    static async getAllBookingRequests(req, res, next) {
        try {
            const bookingRequests = await models_1.BookingRequestModel.findAll();
            const parsedBookingRequests = bookingRequests.map((request) => ({
                ...request,
                tour: {
                    ...request.tour,
                    title: JSON.parse(request.tour.title),
                    description: JSON.parse(request.tour.description),
                    category: {
                        ...request.tour.category,
                        name: JSON.parse(request.tour.category.name)
                    }
                }
            }));
            const response = {
                success: true,
                data: parsedBookingRequests,
                message: 'Booking requests retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createBookingRequest(req, res, next) {
        try {
            const { customerName, customerEmail, preferredDate, numberOfPeople, tourId } = req.body;
            if (!customerName) {
                return res.status(400).json({
                    success: false,
                    error: 'Customer name is required'
                });
            }
            if (!customerEmail) {
                return res.status(400).json({
                    success: false,
                    error: 'Customer email is required'
                });
            }
            if (!preferredDate) {
                return res.status(400).json({
                    success: false,
                    error: 'Preferred date is required'
                });
            }
            if (!numberOfPeople || numberOfPeople < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Number of people must be at least 1'
                });
            }
            if (!tourId) {
                return res.status(400).json({
                    success: false,
                    error: 'Tour ID is required'
                });
            }
            const bookingRequest = await models_1.BookingRequestModel.create({
                customerName,
                customerEmail,
                preferredDate,
                numberOfPeople,
                tourId
            });
            const parsedBookingRequest = {
                ...bookingRequest,
                tour: {
                    ...bookingRequest.tour,
                    title: JSON.parse(bookingRequest.tour.title),
                    description: JSON.parse(bookingRequest.tour.description),
                    category: {
                        ...bookingRequest.tour.category,
                        name: JSON.parse(bookingRequest.tour.category.name)
                    }
                }
            };
            try {
                const tourTitle = parsedBookingRequest.tour.title.en || parsedBookingRequest.tour.title.ru || 'Tour';
                const emailData = {
                    fullName: customerName,
                    email: customerEmail,
                    preferredDate,
                    numberOfPeople,
                    tourTitle
                };
                const adminEmailResult = await (0, email_1.sendAdminNotification)(emailData);
                if (!adminEmailResult.success) {
                    console.log('📧 Admin notification skipped:', adminEmailResult.reason);
                }
                const customerEmailResult = await (0, email_1.sendCustomerConfirmation)(emailData);
                if (!customerEmailResult.success) {
                    console.log('📧 Customer confirmation skipped:', customerEmailResult.reason);
                }
                console.log('Email notifications initiated for booking request:', bookingRequest.id);
            }
            catch (emailError) {
                console.error('Error initiating email notifications:', emailError);
            }
            const response = {
                success: true,
                data: parsedBookingRequest,
                message: 'Booking request created successfully'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Tour not found') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid tour ID'
                });
            }
            return next(error);
        }
    }
}
exports.BookingRequestController = BookingRequestController;
class ReviewController {
    static async getAllReviews(req, res, next) {
        try {
            const reviews = await models_1.ReviewModel.findAll();
            const parsedReviews = reviews.map((review) => ({
                ...review,
                customer: review.customer,
                tour: review.tour ? {
                    ...review.tour,
                    title: JSON.parse(review.tour.title),
                    description: JSON.parse(review.tour.description),
                    category: {
                        ...review.tour.category,
                        name: JSON.parse(review.tour.category.name)
                    }
                } : null
            }));
            const response = {
                success: true,
                data: parsedReviews,
                message: 'Reviews retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async createReview(req, res, next) {
        try {
            const { customerId, rating, text, tourId, reviewerName, photos } = req.body;
            if (!reviewerName) {
                return res.status(400).json({
                    success: false,
                    error: 'Reviewer name is required'
                });
            }
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    error: 'Rating must be between 1 and 5'
                });
            }
            if (!text) {
                return res.status(400).json({
                    success: false,
                    error: 'Review text is required'
                });
            }
            if (!tourId) {
                return res.status(400).json({
                    success: false,
                    error: 'Tour ID is required'
                });
            }
            const review = await models_1.ReviewModel.create({
                customerId,
                reviewerName,
                rating,
                text,
                tourId,
                photos
            });
            const parsedReview = {
                ...review,
                customerId,
                tourId,
                rating,
                text
            };
            const response = {
                success: true,
                data: parsedReview,
                message: 'Review created successfully. It will be visible after moderation.'
            };
            return res.status(201).json(response);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Tour not found') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid tour ID'
                });
            }
            if (error instanceof Error && error.message === 'Rating must be between 1 and 5') {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            return next(error);
        }
    }
    static async updateReview(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid review ID'
                });
            }
            const { isModerated } = req.body;
            if (typeof isModerated !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    error: 'isModerated must be a boolean value'
                });
            }
            const review = await models_1.ReviewModel.update(id, { isModerated });
            const parsedReview = {
                ...review,
                tour: {
                    ...review.tour,
                    title: JSON.parse(review.tour.title),
                    description: JSON.parse(review.tour.description),
                    category: {
                        ...review.tour.category,
                        name: JSON.parse(review.tour.category.name)
                    }
                }
            };
            const response = {
                success: true,
                data: parsedReview,
                message: 'Review updated successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=tourController.js.map