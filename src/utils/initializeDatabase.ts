/**
 * 🗄️ АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ
 * 
 * Этот файл создает базовые данные при развертывании на новом сервере.
 * Запускается автоматически при старте сервера если база данных пустая.
 */

import prisma from '../config/database';
import { safeInitializeWithVersioning, completeInitialization } from './migrationVersioning';

/**
 * 🏷️ Миграция категорий к правильному набору (15 истинных категорий)
 */
async function migrateCategoriesToCorrectSet() {
    console.log('🔄 Миграция категорий к правильному набору...');
    
    // 🎯 ИСТИННЫЕ КАТЕГОРИИ согласно навигационному меню сайта
    const correctCategories = [
        { name: JSON.stringify({ en: "Day Tours", ru: "Однодневные" }) },
        { name: JSON.stringify({ en: "Multi-day Tours", ru: "Многодневные" }) },
        { name: JSON.stringify({ en: "Excursions", ru: "Экскурсии" }) },
        { name: JSON.stringify({ en: "City Tours", ru: "Городские туры" }) },
        { name: JSON.stringify({ en: "Nature/Ecological Tours", ru: "Природа/экологические туры" }) },
        { name: JSON.stringify({ en: "Cultural & Educational Tours", ru: "Культурно познавательные туры" }) },
        { name: JSON.stringify({ en: "Historical Tours", ru: "Исторические туры" }) },
        { name: JSON.stringify({ en: "Hiking/Trekking", ru: "Походы/треккинги" }) },
        { name: JSON.stringify({ en: "Mountain Landscapes", ru: "Горные ландшафты" }) },
        { name: JSON.stringify({ en: "Lake Landscapes", ru: "Озерные ландшафты" }) },
        { name: JSON.stringify({ en: "Adventure Tours", ru: "Приключенческие туры" }) },
        { name: JSON.stringify({ en: "Gastronomic Tours", ru: "Гастрономические туры" }) },
        { name: JSON.stringify({ en: "Auto Tours/Safari/Jeep Tours", ru: "Автотуры/сафари/джип-туры" }) },
        { name: JSON.stringify({ en: "Agrotourism", ru: "Агротуры" }) },
        { name: JSON.stringify({ en: "VIP Tours", ru: "VIP туры" }) }
    ];
    
    try {
        // Безопасно удаляем старые категории (только если нет связанных туров)
        const existingCategories = await prisma.category.findMany({
            include: { _count: { select: { tours: true } } }
        });
        
        console.log(`📊 Найдено ${existingCategories.length} существующих категорий`);
        
        // Удаляем только пустые категории
        for (const category of existingCategories) {
            if (category._count.tours === 0) {
                await prisma.category.delete({ where: { id: category.id } });
                console.log(`🗑️ Удалена пустая категория: ${category.name}`);
            } else {
                console.log(`⚠️ Пропускаем категорию с турами: ${category.name} (${category._count.tours} туров)`);
            }
        }
        
        // Создаем все 15 правильных категорий
        for (const category of correctCategories) {
            // Проверяем, не существует ли уже такая категория
            const existing = await prisma.category.findFirst({
                where: { name: category.name }
            });
            
            if (!existing) {
                await prisma.category.create({ data: category });
                const parsed = JSON.parse(category.name);
                console.log(`✅ Создана категория: ${parsed.ru}`);
            } else {
                const parsed = JSON.parse(category.name);
                console.log(`✅ Категория уже существует: ${parsed.ru}`);
            }
        }
        
        console.log(`✅ Миграция категорий завершена! Всего должно быть ${correctCategories.length} категорий`);
        
    } catch (error) {
        console.error('❌ Ошибка при миграции категорий:', error);
        throw error;
    }
}

/**
 * 🏷️ Создание категорий по умолчанию (только для пустых БД)
 */
async function createDefaultCategories() {
    console.log('🏷️ Создание категорий по умолчанию...');
    
    // Эта функция теперь вызывает миграцию
    await migrateCategoriesToCorrectSet();
}

/**
 * 📋 Создание блоков туров по умолчанию
 */
async function createDefaultTourBlocks() {
    console.log('📋 Создание блоков туров по умолчанию...');
    
    const tourBlocks = [
        {
            title: JSON.stringify({ ru: "Популярные туры", en: "Popular Tours" }),
            description: JSON.stringify({ ru: "Самые востребованные туры нашей компании", en: "Most popular tours of our company" }),
            slug: "popular-tours",
            isActive: true,
            sortOrder: 1
        },
        {
            title: JSON.stringify({ ru: "Рекомендованные туры по Центральной Азии", en: "Recommended Central Asia Tours" }),
            description: JSON.stringify({ ru: "Лучшие туры для знакомства с Центральной Азией", en: "Best tours to discover Central Asia" }),
            slug: "recommended-central-asia",
            isActive: true,
            sortOrder: 2
        },
        {
            title: JSON.stringify({ ru: "Туры по Таджикистану", en: "Tajikistan Tours" }),
            description: JSON.stringify({ ru: "Откройте для себя красоты Таджикистана", en: "Discover the beauty of Tajikistan" }),
            slug: "tajikistan-tours",
            isActive: true,
            sortOrder: 3
        },
        {
            title: JSON.stringify({ ru: "Туры по Узбекистану", en: "Uzbekistan Tours" }),
            description: JSON.stringify({ ru: "Исследуйте древние города Узбекистана", en: "Explore ancient cities of Uzbekistan" }),
            slug: "uzbekistan-tours",
            isActive: true,
            sortOrder: 4
        },
        {
            title: JSON.stringify({ ru: "Туры по Кыргызстану", en: "Kyrgyzstan Tours" }),
            description: JSON.stringify({ ru: "Горные приключения в Кыргызстане", en: "Mountain adventures in Kyrgyzstan" }),
            slug: "kyrgyzstan-tours",
            isActive: true,
            sortOrder: 5
        },
        {
            title: JSON.stringify({ ru: "Эксклюзивные туры", en: "Exclusive Tours" }),
            description: JSON.stringify({ ru: "Уникальные и эксклюзивные туристические программы", en: "Unique and exclusive tour programs" }),
            slug: "exclusive-tours",
            isActive: true,
            sortOrder: 6
        }
    ];
    
    for (const block of tourBlocks) {
        await prisma.tourBlock.create({
            data: block
        });
    }
    
    console.log(`✅ Создано ${tourBlocks.length} блоков туров по умолчанию`);
}

/**
 * 🌍 Создание стран по умолчанию
 */
async function createDefaultCountries() {
    console.log('🌍 Создание стран по умолчанию...');
    
    const countries = [
        { name: "Таджикистан", nameRu: "Таджикистан", nameEn: "Tajikistan", code: "TJ" },
        { name: "Узбекистан", nameRu: "Узбекистан", nameEn: "Uzbekistan", code: "UZ" },
        { name: "Кыргызстан", nameRu: "Кыргызстан", nameEn: "Kyrgyzstan", code: "KG" },
        { name: "Казахстан", nameRu: "Казахстан", nameEn: "Kazakhstan", code: "KZ" },
        { name: "Туркменистан", nameRu: "Туркменистан", nameEn: "Turkmenistan", code: "TM" }
    ];
    
    for (const country of countries) {
        await prisma.country.create({
            data: country
        });
    }
    
    console.log(`✅ Создано ${countries.length} стран по умолчанию`);
}

/**
 * 🏙️ Создание городов по умолчанию
 */
async function createDefaultCities() {
    console.log('🏙️ Создание городов по умолчанию...');
    
    // Сначала получаем ID стран
    const countries = await prisma.country.findMany();
    const countryMap = new Map();
    countries.forEach((country: any) => {
        countryMap.set(country.name, country.id);
    });
    
    const cities = [
        { name: "Душанбе", nameRu: "Душанбе", nameEn: "Dushanbe", countryId: countryMap.get("Таджикистан") },
        { name: "Худжанд", nameRu: "Худжанд", nameEn: "Khujand", countryId: countryMap.get("Таджикистан") },
        { name: "Хорог", nameRu: "Хорог", nameEn: "Khorog", countryId: countryMap.get("Таджикистан") },
        { name: "Ташкент", nameRu: "Ташкент", nameEn: "Tashkent", countryId: countryMap.get("Узбекистан") },
        { name: "Самарканд", nameRu: "Самарканд", nameEn: "Samarkand", countryId: countryMap.get("Узбекистан") },
        { name: "Бухара", nameRu: "Бухара", nameEn: "Bukhara", countryId: countryMap.get("Узбекистан") },
        { name: "Бишкек", nameRu: "Бишкек", nameEn: "Bishkek", countryId: countryMap.get("Кыргызстан") },
        { name: "Астана", nameRu: "Астана", nameEn: "Astana", countryId: countryMap.get("Казахстан") },
        { name: "Алматы", nameRu: "Алматы", nameEn: "Almaty", countryId: countryMap.get("Казахстан") },
        { name: "Ашхабад", nameRu: "Ашхабад", nameEn: "Ashgabat", countryId: countryMap.get("Туркменистан") }
    ];
    
    for (const city of cities) {
        if (city.countryId) {
            await prisma.city.create({
                data: city
            });
        }
    }
    
    console.log(`✅ Создано ${cities.length} городов по умолчанию`);
}

/**
 * 🎬 Создание слайдов по умолчанию
 */
async function createDefaultSlides() {
    console.log('🎬 Создание слайдов по умолчанию...');
    
    const slides = [
        {
            title: JSON.stringify({ 
                ru: "Добро пожаловать в Центральную Азию", 
                en: "Welcome to Central Asia" 
            }),
            description: JSON.stringify({ 
                ru: "Откройте для себя удивительные пейзажи и богатую культуру региона", 
                en: "Discover amazing landscapes and rich culture of the region" 
            }),
            image: "/public/images/default-slide-1.jpg",
            link: "/tours",
            isActive: true,
            order: 1
        },
        {
            title: JSON.stringify({ 
                ru: "Незабываемые приключения", 
                en: "Unforgettable Adventures" 
            }),
            description: JSON.stringify({ 
                ru: "Горы, озера, древние города - все это ждет вас", 
                en: "Mountains, lakes, ancient cities - all this awaits you" 
            }),
            image: "/public/images/default-slide-2.jpg", 
            link: "/tours",
            isActive: true,
            order: 2
        },
        {
            title: JSON.stringify({ 
                ru: "Экспертные гиды", 
                en: "Expert Guides" 
            }),
            description: JSON.stringify({ 
                ru: "Наши опытные гиды покажут вам лучшие места региона", 
                en: "Our experienced guides will show you the best places in the region" 
            }),
            image: "/public/images/default-slide-3.jpg",
            link: "/guides", 
            isActive: true,
            order: 3
        }
    ];
    
    for (const slide of slides) {
        await prisma.slide.create({
            data: slide
        });
    }
    
    console.log(`✅ Создано ${slides.length} слайдов по умолчанию`);
}

/**
 * 🔍 Проверка инициализации базы данных
 */
async function checkDatabaseInitialization() {
    console.log('🔍 Проверка инициализации базы данных...');
    
    try {
        // Проверяем количество записей
        const [categoryCount, tourBlockCount, countryCount, cityCount, slideCount] = await Promise.all([
            prisma.category.count(),
            prisma.tourBlock.count(),
            prisma.country.count(),
            prisma.city.count(),
            prisma.slide.count()
        ]);
        
        console.log(`📊 Текущие данные в БД:`);
        console.log(`   Categories: ${categoryCount}`);
        console.log(`   Tour Blocks: ${tourBlockCount}`);
        console.log(`   Countries: ${countryCount}`);
        console.log(`   Cities: ${cityCount}`);
        console.log(`   Slides: ${slideCount}`);
        
        return {
            categories: categoryCount,
            tourBlocks: tourBlockCount,
            countries: countryCount,
            cities: cityCount,
            slides: slideCount
        };
    } catch (error) {
        console.error('❌ Ошибка при проверке БД:', error);
        return null;
    }
}

/**
 * 🚀 ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
 */
export async function initializeDatabase() {
    console.log('🚀 Начинаем инициализацию базы данных...');
    
    try {
        // 🔒 Проверяем версии миграций для защиты от перезаписи  
        const shouldInitialize = await safeInitializeWithVersioning();
        
        if (!shouldInitialize) {
            console.log('✅ База данных уже инициализирована согласно версии миграций');
            return true;
        }
        
        const stats = await checkDatabaseInitialization();
        
        if (!stats) {
            console.log('❌ Не удалось проверить БД, пропускаем инициализацию');
            return false;
        }
        
        // Создаем недостающие данные ИДЕМПОТЕНТНО (не ломаем существующие связи)
        if (stats.categories === 0) {
            console.log('🏷️ Создание категорий - база данных пустая...');
            await createDefaultCategories();
        } else if (stats.categories === 15) {
            console.log('✅ Категории в правильном количестве (15), пропускаем инициализацию');
        } else {
            console.log(`⚠️ Неожиданное количество категорий: ${stats.categories}, требуется миграция...`);
            await createDefaultCategories();
        }
        
        if (stats.countries === 0) {
            await createDefaultCountries();
        } else {
            console.log('✅ Страны уже существуют, пропускаем создание');
        }
        
        if (stats.cities === 0) {
            await createDefaultCities();
        } else {
            console.log('✅ Города уже существуют, пропускаем создание');
        }
        
        if (stats.tourBlocks === 0) {
            await createDefaultTourBlocks();
        } else {
            console.log('✅ Блоки туров уже существуют, пропускаем создание');
        }
        
        if (stats.slides === 0) {
            await createDefaultSlides();
        } else {
            console.log('✅ Слайды уже существуют, пропускаем создание');
        }
        
        // 🎯 Сохраняем версии миграций после успешной инициализации
        await completeInitialization();
        
        console.log('🎉 Инициализация базы данных завершена!');
        
        // Финальная проверка
        await checkDatabaseInitialization();
        
        return true;
    } catch (error) {
        console.error('❌ Ошибка при инициализации БД:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * 🔧 Принудительная переинициализация (для разработки)
 */
export async function forceResetDatabase() {
    console.log('🔧 ПРИНУДИТЕЛЬНАЯ ПЕРЕИНИЦИАЛИЗАЦИЯ БД...');
    
    try {
        // Удаляем все данные
        await prisma.tourBlockAssignment.deleteMany();
        await prisma.slide.deleteMany();
        await prisma.city.deleteMany();
        await prisma.country.deleteMany();
        await prisma.tourBlock.deleteMany();
        await prisma.category.deleteMany();
        
        console.log('🗑️ Все базовые данные удалены');
        
        // Создаем заново
        await initializeDatabase();
        
        return true;
    } catch (error) {
        console.error('❌ Ошибка при сбросе БД:', error);
        return false;
    }
}