"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = exports.PriceCalculatorModel = exports.HotelModel = exports.TourBlockModel = exports.BookingRequestModel = exports.CategoryModel = exports.TourModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class TourModel {
    static async findAll() {
        return await database_1.default.tour.findMany({
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    static async findById(id) {
        return await database_1.default.tour.findUnique({
            where: { id },
            include: {
                category: true,
                tourHotels: {
                    include: {
                        hotel: true
                    }
                },
                tourGuides: {
                    include: {
                        guide: true
                    }
                },
                tourDrivers: {
                    include: {
                        driver: true
                    }
                }
            }
        });
    }
    static async create(data) {
        const category = await database_1.default.category.findUnique({
            where: { id: data.categoryId }
        });
        if (!category) {
            throw new Error('Category not found');
        }
        return await database_1.default.tour.create({
            data: {
                title: JSON.stringify(data.title),
                description: JSON.stringify(data.description),
                shortDesc: data.shortDescription ? JSON.stringify(data.shortDescription) : null,
                duration: String(data.duration),
                price: data.price,
                priceType: data.priceType || 'за человека',
                originalPrice: data.originalPrice || null,
                categoryId: data.categoryId,
                tourBlockId: data.tourBlockId,
                country: data.country,
                city: data.city,
                format: data.format,
                tourType: data.tourType || null,
                durationDays: data.durationDays || null,
                difficulty: data.difficulty || null,
                maxPeople: data.maxPeople || null,
                minPeople: data.minPeople || null,
                mainImage: data.mainImage || null,
                images: data.images || null,
                highlights: data.highlights || null,
                itinerary: data.itinerary || null,
                included: data.included || null,
                includes: data.includes || null,
                excluded: data.excluded || null,
                pickupInfo: data.pickupInfo || null,
                startTimeOptions: data.startTimeOptions || null,
                languages: data.languages || null,
                availableMonths: data.availableMonths || null,
                availableDays: data.availableDays || null,
                rating: data.rating || null,
                reviewsCount: data.reviewsCount || null,
                theme: data.theme || null,
                assignedGuideId: data.assignedGuideId || null,
                requirements: data.requirements || null,
                tags: data.tags || null,
                location: data.location || null,
                services: data.services || null,
                isFeatured: data.isFeatured || false,
                startDate: data.startDate,
                endDate: data.endDate,
                pricingData: data.pricingComponents || null
            },
            include: {
                category: true
            }
        });
    }
    static async update(id, data) {
        const updateData = {};
        if (data.title)
            updateData.title = JSON.stringify(data.title);
        if (data.description)
            updateData.description = JSON.stringify(data.description);
        if (data.shortDescription)
            updateData.shortDesc = JSON.stringify(data.shortDescription);
        if (data.duration)
            updateData.duration = String(data.duration);
        if (data.price)
            updateData.price = data.price;
        if (data.priceType !== undefined)
            updateData.priceType = data.priceType;
        if (data.originalPrice !== undefined)
            updateData.originalPrice = data.originalPrice;
        if (data.country !== undefined)
            updateData.country = data.country;
        if (data.city !== undefined)
            updateData.city = data.city;
        if (data.format !== undefined)
            updateData.format = data.format;
        if (data.tourType !== undefined)
            updateData.tourType = data.tourType;
        if (data.durationDays !== undefined)
            updateData.durationDays = data.durationDays;
        if (data.difficulty !== undefined)
            updateData.difficulty = data.difficulty;
        if (data.maxPeople !== undefined)
            updateData.maxPeople = data.maxPeople;
        if (data.minPeople !== undefined)
            updateData.minPeople = data.minPeople;
        if (data.mainImage !== undefined)
            updateData.mainImage = data.mainImage;
        if (data.images !== undefined)
            updateData.images = data.images;
        if (data.highlights !== undefined)
            updateData.highlights = data.highlights;
        if (data.itinerary !== undefined)
            updateData.itinerary = data.itinerary;
        if (data.included !== undefined)
            updateData.included = data.included;
        if (data.includes !== undefined)
            updateData.includes = data.includes;
        if (data.excluded !== undefined)
            updateData.excluded = data.excluded;
        if (data.pickupInfo !== undefined)
            updateData.pickupInfo = data.pickupInfo;
        if (data.startTimeOptions !== undefined)
            updateData.startTimeOptions = data.startTimeOptions;
        if (data.languages !== undefined)
            updateData.languages = data.languages;
        if (data.availableMonths !== undefined)
            updateData.availableMonths = data.availableMonths;
        if (data.availableDays !== undefined)
            updateData.availableDays = data.availableDays;
        if (data.rating !== undefined)
            updateData.rating = data.rating;
        if (data.reviewsCount !== undefined)
            updateData.reviewsCount = data.reviewsCount;
        if (data.theme !== undefined)
            updateData.theme = data.theme;
        if (data.requirements !== undefined)
            updateData.requirements = data.requirements;
        if (data.tags !== undefined)
            updateData.tags = data.tags;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.services !== undefined)
            updateData.services = data.services;
        if (data.isFeatured !== undefined)
            updateData.isFeatured = data.isFeatured;
        if (data.startDate !== undefined)
            updateData.startDate = data.startDate;
        if (data.endDate !== undefined)
            updateData.endDate = data.endDate;
        if (data.tourBlockId !== undefined)
            updateData.tourBlockId = data.tourBlockId;
        if (data.pricingComponents !== undefined)
            updateData.pricingData = data.pricingComponents;
        if (data.assignedGuideId !== undefined)
            updateData.assignedGuideId = data.assignedGuideId;
        if (data.categoryId) {
            const category = await database_1.default.category.findUnique({
                where: { id: data.categoryId }
            });
            if (!category) {
                throw new Error('Category not found');
            }
            updateData.categoryId = data.categoryId;
        }
        return await database_1.default.tour.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        });
    }
    static async delete(id) {
        return await database_1.default.tour.delete({
            where: { id }
        });
    }
    static async search(filters = {}) {
        return await database_1.default.tour.findMany({
            where: filters,
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}
exports.TourModel = TourModel;
class CategoryModel {
    static async findAll() {
        return await database_1.default.category.findMany({
            include: {
                _count: {
                    select: { tours: true }
                }
            },
            orderBy: {
                id: 'asc'
            }
        });
    }
    static async findById(id) {
        return await database_1.default.category.findUnique({
            where: { id },
            include: {
                tours: true,
                _count: {
                    select: { tours: true }
                }
            }
        });
    }
    static async create(data) {
        return await database_1.default.category.create({
            data: {
                name: JSON.stringify(data.name)
            }
        });
    }
    static async update(id, data) {
        const updateData = {};
        if (data.name)
            updateData.name = JSON.stringify(data.name);
        return await database_1.default.category.update({
            where: { id },
            data: updateData
        });
    }
    static async delete(id) {
        return await database_1.default.category.delete({
            where: { id }
        });
    }
}
exports.CategoryModel = CategoryModel;
class BookingRequestModel {
    static async findAll() {
        return await database_1.default.bookingRequest.findMany({
            include: {
                tour: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    static async findById(id) {
        return await database_1.default.bookingRequest.findUnique({
            where: { id },
            include: {
                tour: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    static async create(data) {
        const tour = await database_1.default.tour.findUnique({
            where: { id: data.tourId }
        });
        if (!tour) {
            throw new Error('Tour not found');
        }
        return await database_1.default.bookingRequest.create({
            data: {
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                preferredDate: data.preferredDate,
                numberOfPeople: data.numberOfPeople,
                tourId: data.tourId
            },
            include: {
                tour: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    static async delete(id) {
        return await database_1.default.bookingRequest.delete({
            where: { id }
        });
    }
}
exports.BookingRequestModel = BookingRequestModel;
class TourBlockModel {
    static async findAll() {
        return await database_1.default.tourBlock.findMany({
            include: {
                tours: true
            },
            orderBy: {
                sortOrder: 'asc'
            }
        });
    }
    static async findById(id) {
        return await database_1.default.tourBlock.findUnique({
            where: { id },
            include: {
                tours: true
            }
        });
    }
    static async create(data) {
        return await database_1.default.tourBlock.create({
            data: {
                title: JSON.stringify(data.title),
                description: JSON.stringify(data.description),
                slug: data.slug,
                sortOrder: data.sortOrder
            }
        });
    }
    static async update(id, data) {
        const updateData = {};
        if (data.title)
            updateData.title = JSON.stringify(data.title);
        if (data.description)
            updateData.description = JSON.stringify(data.description);
        if (data.slug)
            updateData.slug = data.slug;
        if (data.sortOrder)
            updateData.sortOrder = data.sortOrder;
        return await database_1.default.tourBlock.update({
            where: { id },
            data: updateData
        });
    }
    static async delete(id) {
        return await database_1.default.tourBlock.delete({
            where: { id }
        });
    }
}
exports.TourBlockModel = TourBlockModel;
class HotelModel {
    static async findAll() {
        const hotels = await database_1.default.hotel.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        return hotels.map((hotel) => ({
            ...hotel,
            name: typeof hotel.name === 'string' ? JSON.parse(hotel.name) : hotel.name,
            description: hotel.description && typeof hotel.description === 'string' ? JSON.parse(hotel.description) : hotel.description,
            images: hotel.images && typeof hotel.images === 'string' ? JSON.parse(hotel.images) : (hotel.images || []),
            amenities: hotel.amenities && typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : (hotel.amenities || [])
        }));
    }
    static async findByTourId(tourId) {
        const tourHotels = await database_1.default.tourHotel.findMany({
            where: { tourId },
            include: {
                hotel: true
            },
            orderBy: [
                { isDefault: 'desc' },
                { hotel: { name: 'asc' } }
            ]
        });
        return tourHotels.map((th) => ({
            ...th.hotel,
            name: typeof th.hotel.name === 'string' ? JSON.parse(th.hotel.name) : th.hotel.name,
            description: th.hotel.description && typeof th.hotel.description === 'string' ? JSON.parse(th.hotel.description) : th.hotel.description,
            images: th.hotel.images && typeof th.hotel.images === 'string' ? JSON.parse(th.hotel.images) : (th.hotel.images || []),
            amenities: th.hotel.amenities && typeof th.hotel.amenities === 'string' ? JSON.parse(th.hotel.amenities) : (th.hotel.amenities || []),
            pricePerNight: th.pricePerNight,
            isDefault: th.isDefault
        }));
    }
    static async findById(id) {
        const hotel = await database_1.default.hotel.findUnique({
            where: { id },
            include: {
                tourHotels: {
                    include: {
                        tour: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                }
            }
        });
        if (!hotel)
            return null;
        return {
            ...hotel,
            name: typeof hotel.name === 'string' ? JSON.parse(hotel.name) : hotel.name,
            description: hotel.description && typeof hotel.description === 'string' ? JSON.parse(hotel.description) : hotel.description,
            images: hotel.images && typeof hotel.images === 'string' ? JSON.parse(hotel.images) : (hotel.images || []),
            amenities: hotel.amenities && typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : (hotel.amenities || []),
            tourHotels: hotel.tourHotels.map((th) => ({
                ...th,
                tour: {
                    ...th.tour,
                    title: typeof th.tour.title === 'string' ? JSON.parse(th.tour.title) : th.tour.title
                }
            }))
        };
    }
    static async create(data) {
        return await database_1.default.hotel.create({
            data: {
                name: data.name ? (typeof data.name === 'string' ? data.name : JSON.stringify(data.name)) : '{}',
                description: data.description ? (typeof data.description === 'string' ? data.description : JSON.stringify(data.description)) : null,
                images: data.images ? (typeof data.images === 'string' ? data.images : JSON.stringify(data.images)) : null,
                address: data.address,
                rating: data.rating ? parseFloat(data.rating) : null,
                stars: data.stars ? parseInt(data.stars) : null,
                brand: data.brand || null,
                category: data.category || null,
                country: data.country || null,
                city: data.city || null,
                pension: data.pension || 'none',
                amenities: data.amenities ? (typeof data.amenities === 'string' ? data.amenities : JSON.stringify(data.amenities)) : null,
                roomTypes: data.roomTypes ? (typeof data.roomTypes === 'string' ? data.roomTypes : JSON.stringify(data.roomTypes)) : null,
                mealTypes: data.mealTypes ? (typeof data.mealTypes === 'string' ? data.mealTypes : JSON.stringify(data.mealTypes)) : null,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
    }
    static async update(id, data) {
        const updateData = {};
        if (data.name)
            updateData.name = typeof data.name === 'string' ? data.name : JSON.stringify(data.name);
        if (data.description)
            updateData.description = typeof data.description === 'string' ? data.description : JSON.stringify(data.description);
        if (data.images)
            updateData.images = typeof data.images === 'string' ? data.images : JSON.stringify(data.images);
        if (data.address)
            updateData.address = data.address;
        if (data.rating !== undefined)
            updateData.rating = parseFloat(data.rating);
        if (data.stars !== undefined)
            updateData.stars = data.stars ? parseInt(data.stars) : null;
        if (data.brand !== undefined)
            updateData.brand = data.brand;
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.country !== undefined)
            updateData.country = data.country;
        if (data.city !== undefined)
            updateData.city = data.city;
        if (data.pension !== undefined)
            updateData.pension = data.pension;
        if (data.amenities)
            updateData.amenities = typeof data.amenities === 'string' ? data.amenities : JSON.stringify(data.amenities);
        if (data.roomTypes)
            updateData.roomTypes = typeof data.roomTypes === 'string' ? data.roomTypes : JSON.stringify(data.roomTypes);
        if (data.mealTypes)
            updateData.mealTypes = typeof data.mealTypes === 'string' ? data.mealTypes : JSON.stringify(data.mealTypes);
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        const hotel = await database_1.default.hotel.findUnique({ where: { id } });
        if (!hotel)
            return null;
        return await database_1.default.hotel.update({
            where: { id },
            data: updateData
        });
    }
    static async delete(id) {
        const hotel = await database_1.default.hotel.findUnique({ where: { id } });
        if (!hotel)
            return false;
        await database_1.default.hotel.delete({ where: { id } });
        return true;
    }
    static async addToTour(tourId, hotelId, pricePerNight, isDefault = false) {
        return await database_1.default.tourHotel.create({
            data: {
                tourId,
                hotelId,
                pricePerNight,
                isDefault
            }
        });
    }
    static async removeFromTour(tourId, hotelId) {
        const tourHotel = await database_1.default.tourHotel.findUnique({
            where: {
                tourId_hotelId: {
                    tourId,
                    hotelId
                }
            }
        });
        if (!tourHotel)
            return false;
        await database_1.default.tourHotel.delete({
            where: {
                tourId_hotelId: {
                    tourId,
                    hotelId
                }
            }
        });
        return true;
    }
}
exports.HotelModel = HotelModel;
class PriceCalculatorModel {
    static async findAll() {
        return await database_1.default.priceCalculatorComponent.findMany({
            where: { isActive: true },
            orderBy: [
                { category: 'asc' },
                { sortOrder: 'asc' },
                { name: 'asc' }
            ]
        });
    }
    static async findByKey(key) {
        return await database_1.default.priceCalculatorComponent.findUnique({
            where: { key }
        });
    }
    static async create(data) {
        return await database_1.default.priceCalculatorComponent.create({
            data: {
                key: data.key,
                category: data.category,
                name: data.name,
                price: data.price,
                unit: data.unit,
                description: data.description || null,
                sortOrder: data.sortOrder || 0
            }
        });
    }
    static async update(id, data) {
        return await database_1.default.priceCalculatorComponent.update({
            where: { id },
            data: {
                name: data.name,
                price: data.price,
                unit: data.unit,
                description: data.description,
                sortOrder: data.sortOrder,
                isActive: data.isActive
            }
        });
    }
    static async delete(id) {
        return await database_1.default.priceCalculatorComponent.delete({
            where: { id }
        });
    }
    static async initializeDefaults() {
        const defaultComponents = [
            { key: 'transport_offroad', category: 'transport', name: 'Транспорт: внедорожник', price: 64.0, unit: 'км', sortOrder: 1 },
            { key: 'transport_crossover', category: 'transport', name: 'Транспорт: кроссовер', price: 64.0, unit: 'км', sortOrder: 2 },
            { key: 'transport_minibus', category: 'transport', name: 'Транспорт: микроавтобус', price: 2200.0, unit: 'день', sortOrder: 3 },
            { key: 'transport_bus', category: 'transport', name: 'Транспорт: автобус', price: 4400.0, unit: 'день', sortOrder: 4 },
            { key: 'accommodation_5star', category: 'accommodation', name: 'Гостиница: 5*, двухместный', price: 1300.0, unit: 'ночь/номер', sortOrder: 1 },
            { key: 'accommodation_4star', category: 'accommodation', name: 'Гостиница: 4*, двухместный', price: 1100.0, unit: 'ночь/номер', sortOrder: 2 },
            { key: 'accommodation_3star', category: 'accommodation', name: 'Гостиница: 3*, двухместный', price: 850.0, unit: 'ночь/номер', sortOrder: 3 },
            { key: 'accommodation_2star', category: 'accommodation', name: 'Гостиница: 2*, двухместный', price: 450.0, unit: 'ночь/номер', sortOrder: 4 },
            { key: 'accommodation_hostel', category: 'accommodation', name: 'Хостел', price: 200.0, unit: 'ночь/номер', sortOrder: 5 },
            { key: 'meals_lunch', category: 'meals', name: 'Обед', price: 70.0, unit: 'раз', sortOrder: 1 },
            { key: 'meals_dinner', category: 'meals', name: 'Ужин', price: 65.0, unit: 'раз', sortOrder: 2 },
            { key: 'guide_russian', category: 'guides', name: 'Проводник: русскоговорящий', price: 330.0, unit: 'день', sortOrder: 1 },
            { key: 'guide_english', category: 'guides', name: 'Проводник: англоговорящий', price: 650.0, unit: 'день', sortOrder: 2 },
            { key: 'tickets_local', category: 'tickets', name: 'Входные билеты в объектах (для граждан Таджикистана)', price: 11.0, unit: 'раз', sortOrder: 1 },
            { key: 'tickets_foreign', category: 'tickets', name: 'Входные билеты в объектах (для иностранцев)', price: 33.0, unit: 'раз', sortOrder: 2 },
            { key: 'transfer_local', category: 'transfer', name: 'Аэропорт-гостиница (для граждан Таджикистана)', price: 330.0, unit: 'человек', sortOrder: 1 },
            { key: 'transfer_foreign', category: 'transfer', name: 'Аэропорт-гостиница (для иностранцев)', price: 550.0, unit: 'человек', sortOrder: 2 },
            { key: 'documents_gbao', category: 'documents', name: 'Разрешение на въезд в ГБАО', price: 275.0, unit: 'человек', sortOrder: 1 },
            { key: 'documents_visa_support', category: 'documents', name: 'Визовая поддержка (официальное приглашение)', price: 330.0, unit: 'человек', sortOrder: 2 },
            { key: 'documents_foreign_visa', category: 'documents', name: 'Виза в зарубежные страны', price: 1400.0, unit: 'человек', sortOrder: 3 }
        ];
        const results = [];
        for (const component of defaultComponents) {
            try {
                const existing = await this.findByKey(component.key);
                if (!existing) {
                    const created = await this.create(component);
                    results.push(created);
                }
            }
            catch (error) {
                console.error(`Error creating component ${component.key}:`, error);
            }
        }
        return results;
    }
}
exports.PriceCalculatorModel = PriceCalculatorModel;
class ReviewModel {
    static async findAll() {
        return await database_1.default.review.findMany({
            include: {
                customer: true,
                tour: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    static async findModerated() {
        return await database_1.default.review.findMany({
            where: {
                isModerated: true,
                isApproved: true
            },
            include: {
                customer: true,
                tour: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    static async findByTourId(tourId) {
        return await database_1.default.review.findMany({
            where: {
                tourId,
                isModerated: true,
                isApproved: true
            },
            include: {
                customer: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    static async findById(id) {
        return await database_1.default.review.findUnique({
            where: { id },
            include: {
                customer: true,
                tour: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    static async create(data) {
        const tour = await database_1.default.tour.findUnique({
            where: { id: data.tourId }
        });
        if (!tour) {
            throw new Error('Tour not found');
        }
        if (data.rating < 1 || data.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        return await database_1.default.review.create({
            data: {
                customerId: data.customerId || null,
                reviewerName: data.reviewerName,
                rating: data.rating,
                text: data.text,
                tourId: data.tourId,
                photos: data.photos ? JSON.stringify(data.photos) : null
            },
            include: {
                customer: true,
                tour: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    static async update(id, data) {
        return await database_1.default.review.update({
            where: { id },
            data,
            include: {
                customer: true,
                tour: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    static async delete(id) {
        return await database_1.default.review.delete({
            where: { id }
        });
    }
}
exports.ReviewModel = ReviewModel;
//# sourceMappingURL=index.js.map