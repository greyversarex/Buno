import { Request, Response } from 'express';
import { HotelModel } from '../models';
import { HotelCategory } from '@prisma/client';
import { 
  getLanguageFromRequest, 
  createLocalizedResponse, 
  parseMultilingualField,
  localizeArray,
  safeJsonParse
} from '../utils/multilingual';

// Функция для получения переводов категорий отелей
const getHotelCategoryTranslation = (category: HotelCategory | null, language: string): string => {
  if (!category) return '';
  
  const translations: Record<HotelCategory, { ru: string; en: string }> = {
    [HotelCategory.STANDARD]: { ru: 'Стандарт', en: 'Standard' },
    [HotelCategory.SEMI_LUX]: { ru: 'Полулюкс', en: 'Semi-Luxury' },
    [HotelCategory.LUX]: { ru: 'Люкс', en: 'Luxury' },
    [HotelCategory.DELUXE]: { ru: 'Делюкс', en: 'Deluxe' }
  };
  
  return translations[category]?.[language as 'ru' | 'en'] || translations[category]?.ru || category;
};

// Get all hotels with multilingual support
// GET /api/hotels?lang=en/ru&includeRaw=true&tourId=123
export const getHotels = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tourId } = req.query;
    const language = getLanguageFromRequest(req);
    const includeRaw = req.query.includeRaw === 'true';
    
    let hotels;
    if (tourId) {
      // Get hotels for specific tour
      hotels = await HotelModel.findByTourId(parseInt(tourId as string));
    } else {
      // Get all hotels
      hotels = await HotelModel.findAll();
    }

    // Localize hotels data with safe JSON parsing
    const localizedHotels = hotels.map((hotel: any) => {
      try {
        if (includeRaw) {
          // ДЛЯ АДМИНКИ: возвращаем ТОЛЬКО БЕЗОПАСНЫЕ поля + raw JSON + локализованные поля
          return {
            id: hotel.id,
            images: hotel.images,
            rating: hotel.rating,
            stars: hotel.stars,
            amenities: hotel.amenities,
            brand: hotel.brand,
            category: hotel.category,
            categoryTranslated: getHotelCategoryTranslation(hotel.category, language),
            countryId: hotel.countryId,
            cityId: hotel.cityId,
            country: hotel.hotelCountry, // ДОБАВЛЕНО: связанная страна (правильное имя поля)
            city: hotel.hotelCity, // ДОБАВЛЕНО: связанный город (правильное имя поля)
            pension: hotel.pension,
            roomTypes: hotel.roomTypes,
            mealTypes: hotel.mealTypes,
            isActive: hotel.isActive,
            createdAt: hotel.createdAt,
            updatedAt: hotel.updatedAt,
            _localized: {
              name: parseMultilingualField(hotel.name, language),
              description: parseMultilingualField(hotel.description, language),
              address: parseMultilingualField(hotel.address, language)
            },
            // Добавляем raw JSON для админки
            _raw: {
              name: safeJsonParse(hotel.name),
              description: safeJsonParse(hotel.description),
              address: safeJsonParse(hotel.address)
            }
          };
        } else {
          // ДЛЯ ПУБЛИЧНОГО ИСПОЛЬЗОВАНИЯ: только локализованный контент + связанные данные
          return {
            ...hotel,
            name: parseMultilingualField(hotel.name, language),
            description: parseMultilingualField(hotel.description, language),
            address: parseMultilingualField(hotel.address, language),
            categoryTranslated: getHotelCategoryTranslation(hotel.category, language),
            country: hotel.hotelCountry, // Добавляем связанную страну для публичного API
            city: hotel.hotelCity // Добавляем связанный город для публичного API
          };
        }
      } catch (jsonError) {
        console.error('Error parsing hotel JSON fields:', jsonError, 'Hotel ID:', hotel.id);
        return {
          ...hotel,
          name: hotel.name || '',
          description: hotel.description || '',
          address: hotel.address || ''
        };
      }
    });

    const response = createLocalizedResponse(
      localizedHotels,
      [], // Поля уже обработаны выше
      language,
      'Hotels retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get single hotel with multilingual support
// GET /api/hotels/:id?lang=en/ru&includeRaw=true
export const getHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const language = getLanguageFromRequest(req);
    const includeRaw = req.query.includeRaw === 'true';
    
    const hotel = await HotelModel.findById(parseInt(id));
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Localize hotel data with safe JSON parsing
    let localizedHotel;
    try {
      if (includeRaw) {
        // ДЛЯ АДМИНКИ: возвращаем ТОЛЬКО БЕЗОПАСНЫЕ поля + raw JSON + локализованные поля
        localizedHotel = {
          id: hotel.id,
          images: hotel.images,
          rating: hotel.rating,
          stars: hotel.stars,
          amenities: hotel.amenities,
          brand: hotel.brand,
          category: hotel.category,
          countryId: hotel.countryId,
          cityId: hotel.cityId,
          pension: hotel.pension,
          roomTypes: hotel.roomTypes,
          mealTypes: hotel.mealTypes,
          isActive: hotel.isActive,
          createdAt: hotel.createdAt,
          updatedAt: hotel.updatedAt,
          _localized: {
            name: parseMultilingualField(hotel.name, language),
            description: parseMultilingualField(hotel.description, language),
            address: parseMultilingualField(hotel.address, language)
          },
          // Добавляем raw JSON для админки
          _raw: {
            name: safeJsonParse(hotel.name),
            description: safeJsonParse(hotel.description),
            address: safeJsonParse(hotel.address)
          }
        };
      } else {
        // ДЛЯ ПУБЛИЧНОГО ИСПОЛЬЗОВАНИЯ: только локализованный контент + связанные данные
        localizedHotel = {
          ...hotel,
          name: parseMultilingualField(hotel.name, language),
          description: parseMultilingualField(hotel.description, language),
          address: parseMultilingualField(hotel.address, language),
          country: hotel.hotelCountry, // Добавляем связанную страну для публичного API
          city: hotel.hotelCity // Добавляем связанный город для публичного API
        };
      }
    } catch (jsonError) {
      console.error('Error parsing hotel JSON fields:', jsonError, 'Hotel ID:', hotel.id);
      localizedHotel = {
        ...hotel,
        name: hotel.name || '',
        description: hotel.description || '',
        address: hotel.address || ''
      };
    }

    const response = createLocalizedResponse(
      localizedHotel,
      [], // Поля уже обработаны выше
      language,
      'Hotel retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching hotel',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create hotel
export const createHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const hotelData = req.body;
    
    const hotel = await HotelModel.create(hotelData);

    return res.status(201).json({
      success: true,
      data: hotel,
      message: 'Hotel created successfully'
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating hotel',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update hotel
export const updateHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const hotelData = req.body;
    
    const hotel = await HotelModel.update(parseInt(id), hotelData);

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
  } catch (error) {
    console.error('Error updating hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating hotel',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete hotel
export const deleteHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const deleted = await HotelModel.delete(parseInt(id));

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
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting hotel',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add hotel to tour
export const addHotelToTour = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Support both URL params and body data
    const tourId = req.params.tourId || req.body.tourId;
    const hotelId = req.params.hotelId || req.body.hotelId;
    const { pricePerNight, isDefault } = req.body;
    
    const tourHotel = await HotelModel.addToTour(
      parseInt(tourId), 
      parseInt(hotelId), 
      pricePerNight,
      isDefault
    );

    return res.json({
      success: true,
      data: tourHotel,
      message: 'Hotel added to tour successfully'
    });
  } catch (error) {
    console.error('Error adding hotel to tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding hotel to tour',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Remove hotel from tour
export const removeHotelFromTour = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tourId, hotelId } = req.params;
    
    const removed = await HotelModel.removeFromTour(parseInt(tourId), parseInt(hotelId));

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
  } catch (error) {
    console.error('Error removing hotel from tour:', error);
    return res.status(500).json({
      success: false,
      message: 'Error removing hotel from tour',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};