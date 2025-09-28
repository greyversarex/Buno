// === ЦЕНТРАЛЬНАЯ СИСТЕМА ИНТЕРНАЦИОНАЛИЗАЦИИ ===
// Используется на всех страницах сайта для двуязычной поддержки (EN/RU)

// === ЗАЩИТА ОТ ДВОЙНОЙ ЗАГРУЗКИ ===
(function() {
if (window.bunyodTourI18nLoaded) {
    return; // Просто выходим из IIFE без ошибки
}

// Помечаем что система загружена в самом начале
window.bunyodTourI18nLoaded = true;

// Глобальная переменная для текущего языка
window.currentLanguage = window.currentLanguage || 'ru'; // По умолчанию русский

// Поддерживаемые языки
window.supportedLanguages = window.supportedLanguages || ['en', 'ru'];

// === СЛОВАРЬ ПЕРЕВОДОВ ===
window.translations = window.translations || {
    // Главное меню
    'nav.home': { ru: 'Главная', en: 'Home' },
    'nav.tours': { ru: 'Туры', en: 'Tours' },
    'nav.hotels': { ru: 'Отели', en: 'Hotels' },
    'nav.visa_support': { ru: 'Визовая поддержка', en: 'Visa Support' },
    'nav.tour_agents': { ru: 'Турагентам', en: 'For Tour Agents' },
    'nav.about': { ru: 'О нас', en: 'About Us' },
    'nav.reviews': { ru: 'Отзывы', en: 'Reviews' },
    'nav.blog': { ru: 'Блог', en: 'Blog' },
    'nav.contacts': { ru: 'Контакты', en: 'Contacts' },
    'nav.transfer': { ru: 'Трансфер', en: 'Transfer' },
    'nav.guides': { ru: 'Тургиды', en: 'Tour Guides' },
    'nav.book_tour': { ru: 'Заказ тура', en: 'Book Tour' },
    'nav.tourists': { ru: 'Туристам', en: 'For Tourists' },
    'nav.site_guide': { ru: 'Инструкция сайта', en: 'Site Guide' },
    'nav.special_notes': { ru: 'Специальные заметки', en: 'Special Notes' },
    'nav.offer_agreement': { ru: 'Договор оферта', en: 'Offer Agreement' },
    'nav.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    'nav.promotions': { ru: 'Акции', en: 'Promotions' },
    'nav.news': { ru: 'Новости', en: 'News' },
    'nav.our_agents': { ru: 'Наши турагенты', en: 'Our Tour Agents' },
    
    // Кнопки и действия
    'btn.more_details': { ru: 'Подробнее', en: 'More Details' },
    'btn.more_photos': { ru: 'Ещё фото', en: 'More Photos' },
    'btn.view_all_photos': { ru: 'Посмотреть все фотографии', en: 'View All Photos' },
    'btn.share': { ru: 'Поделиться', en: 'Share' },
    'btn.copy_link': { ru: 'Скопировать ссылку', en: 'Copy Link' },
    'btn.download_pdf': { ru: 'Скачать PDF', en: 'Download PDF' },
    'btn.book_now': { ru: 'Забронировать сейчас', en: 'Book Now' },
    'btn.apply': { ru: 'Применить', en: 'Apply' },
    'btn.view_all': { ru: 'Смотреть все', en: 'View All' },
    'btn.send': { ru: 'Отправить', en: 'Send' },
    'btn.search': { ru: 'Поиск', en: 'Search' },
    'btn.filter': { ru: 'Фильтры', en: 'Filters' },
    'btn.contact_us': { ru: 'Связаться с нами', en: 'Contact Us' },
    
    // Заголовки и подзаголовки
    'title.popular_tours': { ru: 'Популярные туры', en: 'Popular Tours' },
    'title.recommended_tours': { ru: 'Рекомендованные туры по Центральной Азии', en: 'Recommended Central Asia Tours' },
    'title.tajikistan_tours': { ru: 'Туры по Таджикистану', en: 'Tajikistan Tours' },
    'title.uzbekistan_tours': { ru: 'Туры по Узбекистану', en: 'Uzbekistan Tours' },
    'title.kyrgyzstan_tours': { ru: 'Туры по Киргизстану', en: 'Kyrgyzstan Tours' },
    'title.turkmenistan_tours': { ru: 'Туры по Туркменистану', en: 'Turkmenistan Tours' },
    'title.tours_by_cities': { ru: 'Туры по городам', en: 'Tours by Cities' },
    'title.find_perfect_tour': { ru: 'Найдите идеальный тур', en: 'Find the Perfect Tour' },
    'title.free_cancellation': { ru: 'Бесплатная отмена', en: 'Free Cancellation' },
    'title.book_now_pay_later': { ru: 'Бронируй сейчас - плати потом', en: 'Book Now - Pay Later' },
    'title.hot_tours': { ru: 'Горящие туры', en: 'Last-minute Tours' },
    'title.promotions': { ru: 'Акции', en: 'Promotions' },
    'title.search_results': { ru: 'Результаты поиска', en: 'Search Results' },
    'title.our_services': { ru: 'Наши услуги', en: 'Our Services' },
    'title.why_choose_us': { ru: 'Почему выбирают нас', en: 'Why Choose Us' },
    
    // Ценовые обозначения
    'price.from': { ru: 'Цена от:', en: 'Price from:' },
    'price.per_person': { ru: 'за человека', en: 'per person' },
    'price.per_group': { ru: 'за группу', en: 'per group' },
    'price.days': { ru: 'дней', en: 'days' },
    'price.day': { ru: 'день', en: 'day' },
    
    // Формы и поля
    'form.name': { ru: 'Имя', en: 'Name' },
    'form.email': { ru: 'Email', en: 'Email' },
    'form.phone': { ru: 'Телефон', en: 'Phone' },
    'form.message': { ru: 'Сообщение', en: 'Message' },
    'form.check_in': { ru: 'Заезд', en: 'Check-in' },
    'form.check_out': { ru: 'Выезд', en: 'Check-out' },
    'form.guests': { ru: 'Гостей', en: 'Guests' },
    'form.select_country': { ru: 'Выберите страну', en: 'Select Country' },
    'form.select_city': { ru: 'Выберите город', en: 'Select City' },
    'form.select_type': { ru: 'Выберите тип', en: 'Select Type' },
    
    // Услуги и заголовки секций
    'service.tours': { ru: 'Туры и экскурсии', en: 'Tours & Excursions' },
    'service.transfer': { ru: 'Трансфер', en: 'Transfer Service' },
    'service.guide': { ru: 'Гид-сопровождение', en: 'Guide Service' },
    'service.agency': { ru: 'Турагентство', en: 'Travel Agency' },
    'service.transfer_title': { ru: 'ТРАНСФЕР', en: 'TRANSFER' },
    'service.guides_title': { ru: 'ТУР-ГИДЫ', en: 'TOUR GUIDES' },
    'service.agency_title': { ru: 'АГЕНТСКИЙ СЕРВИС', en: 'AGENCY SERVICE' },
    'service.custom_tour_title': { ru: 'СОБСТВЕННЫЙ ТУР', en: 'CUSTOM TOUR' },
    
    // Подвал сайта
    'footer.contact_info': { ru: 'Контактная информация', en: 'Contact Information' },
    'footer.quick_links': { ru: 'Быстрые ссылки', en: 'Quick Links' },
    'footer.social_media': { ru: 'Социальные сети', en: 'Social Media' },
    'footer.our_location': { ru: 'Наше местоположение:', en: 'Our Location:' },
    
    // Фильтры
    'filters.title': { ru: 'Фильтры поиска', en: 'Search Filters' },
    'filters.search_filters': { ru: '🔍 Фильтры поиска', en: '🔍 Search Filters' },
    'filters.destination': { ru: 'Направление', en: 'Destination' },
    'filter.country': { ru: 'Страна', en: 'Country' },
    'filter.city': { ru: 'Город', en: 'City' },
    'filter.tour_type': { ru: 'Тип тура', en: 'Tour Type' },
    'filter.category': { ru: 'Категория', en: 'Category' },
    'filter.date': { ru: 'Дата', en: 'Date' },
    'filter.hotel_brand': { ru: 'Бренд отеля', en: 'Hotel Brand' },
    'filter.hotel_stars': { ru: 'Звезды отеля', en: 'Hotel Stars' },
    
    // Формы
    'form.country': { ru: 'Страна', en: 'Country' },
    
    // Страны  
    'country.tajikistan': { ru: 'Таджикистан', en: 'Tajikistan' },
    'country.uzbekistan': { ru: 'Узбекистан', en: 'Uzbekistan' },
    'country.kyrgyzstan': { ru: 'Киргизстан', en: 'Kyrgyzstan' },
    'country.turkmenistan': { ru: 'Туркменистан', en: 'Turkmenistan' },
    
    // Общие элементы
    'common.loading': { ru: 'Загрузка...', en: 'Loading...' },
    'common.no_results': { ru: 'Результаты не найдены', en: 'No results found' },
    'common.error': { ru: 'Произошла ошибка', en: 'An error occurred' },
    'common.success': { ru: 'Успешно!', en: 'Success!' },
    'common.show_all_tours': { ru: 'Показать все туры', en: 'Show All Tours' },
    'common.clear_search': { ru: 'Очистить поиск', en: 'Clear Search' },
    'common.save': { ru: 'Сохранить', en: 'Save' },
    'common.cancel': { ru: 'Отмена', en: 'Cancel' },
    'common.edit': { ru: 'Редактировать', en: 'Edit' },
    'common.delete': { ru: 'Удалить', en: 'Delete' },
    'common.add': { ru: 'Добавить', en: 'Add' },
    'common.create': { ru: 'Создать', en: 'Create' },
    
    // Placeholders для форм и поиска
    'placeholder.search_tours': { ru: 'Поиск туров...', en: 'Search tours...' },
    'placeholder.search_perfect_tour': { ru: 'Найдите идеальный тур: Памир, Искандеркуль, треккинг...', en: 'Find the perfect tour: Pamir, Iskanderkul, trekking...' },
    'placeholder.select_date': { ru: 'Выберите дату', en: 'Select date' },
    'placeholder.enter_name': { ru: 'Введите ваше имя', en: 'Enter your name' },
    'placeholder.enter_email': { ru: 'Введите email', en: 'Enter email' },
    'placeholder.enter_phone': { ru: 'Введите телефон', en: 'Enter phone' },
    'placeholder.enter_message': { ru: 'Введите сообщение', en: 'Enter message' },

    // === ЗАГОЛОВКИ СТРАНИЦ ===
    'page.title': { ru: 'Bunyod-Tour - Туры по Таджикистану', en: 'Bunyod-Tour - Tours in Tajikistan' },
    'hotel.catalog_title': { ru: 'Каталог отелей', en: 'Hotels Catalog' },
    'hotel.catalog_subtitle': { ru: 'Выберите идеальное место для вашего отдыха', en: 'Choose the perfect place for your stay' },
    'tours.page_title': { ru: 'Поиск туров - Bunyod-Tour', en: 'Search Tours - Bunyod-Tour' },
    'tour.page_title': { ru: 'Тур - Bunyod-Tour', en: 'Tour - Bunyod-Tour' },
    'hotel.catalog_description': { ru: 'Найдите идеальное размещение для вашего путешествия по Центральной Азии', en: 'Find the perfect accommodation for your Central Asia journey' },
    
    // Категории отелей
    'hotel.category_luxury': { ru: 'Люкс', en: 'Luxury' },
    'hotel.category_premium': { ru: 'Премиум', en: 'Premium' },
    'hotel.category_budget': { ru: 'Бюджетный', en: 'Budget' },
    
    // Поиск и сообщения отелей
    'hotel.search_placeholder': { ru: 'Название отеля...', en: 'Hotel name...' },
    'hotel.no_hotels_found': { ru: 'Отели не найдены', en: 'No hotels found' },
    'hotel.try_different_filters': { ru: 'Попробуйте изменить фильтры поиска', en: 'Try adjusting your search filters' },
    
    // Фильтры отелей
    'filters.country': { ru: 'Страна', en: 'Country' },
    'filters.all_countries': { ru: 'Все страны', en: 'All Countries' },
    'filters.category': { ru: 'Категория', en: 'Category' },
    'filters.all_categories': { ru: 'Все категории', en: 'All Categories' },
    'filters.stars': { ru: 'Звезды', en: 'Stars' },
    'filters.any_stars': { ru: 'Любое количество', en: 'Any Rating' },
    'filters.five_stars': { ru: '5 звезд', en: '5 Stars' },
    'filters.four_stars': { ru: '4 звезды', en: '4 Stars' },
    'filters.three_stars': { ru: '3 звезды', en: '3 Stars' },
    'filters.two_stars': { ru: '2 звезды', en: '2 Stars' },
    'filters.one_star': { ru: '1 звезда', en: '1 Star' },
    'filters.search': { ru: 'Поиск', en: 'Search' },
    
    // Кнопки каталога отелей
    'btn.clear_filters': { ru: 'Очистить фильтры', en: 'Clear Filters' },
    
    // Ключи для tour-template.html
    'tour.duration_label': { ru: 'Длительность:', en: 'Duration:' },
    'tour.meals_not_included': { ru: 'Приём не включен', en: 'Meals Not Included' },
    'tour.languages_label': { ru: 'Языки:', en: 'Languages:' },
    'tour.included': { ru: 'Что включено:', en: 'What\'s Included:' },
    'tour.not_included': { ru: 'Не включено в тур:', en: 'Not Included:' },
    'tour.tab.description': { ru: 'Описание тура', en: 'Tour Description' },
    'tour.tab.program': { ru: 'Программа тура', en: 'Tour Program' },
    
    // Особенности бронирования
    'booking.free_cancellation': { ru: 'Бесплатная отмена', en: 'Free Cancellation' },
    'booking.cancellation_terms': { ru: 'до 24 часов до начала тура (местное время)', en: 'up to 24 hours before tour start (local time)' },
    'booking.book_now_pay_later': { ru: 'Забронировать сейчас, оплатить позже', en: 'Book Now, Pay Later' },
    'booking.reserve_flexibility': { ru: 'Забронируйте место и сохраните гибкость', en: 'Reserve your spot and stay flexible' },
    'booking.book_ahead': { ru: 'Бронируйте заранее!', en: 'Book Ahead!' },
    'booking.average_notice': { ru: 'В среднем этот тур бронируют за 20 дней.', en: 'On average, this tour is booked 20 days in advance.' },
    'booking.tour_start_time': { ru: 'Время начала тура', en: 'Tour Start Time' },
    
    // Возрастные категории
    'form.adults_age': { ru: 'Взрослые (от 9 лет)', en: 'Adults (9+ years)' },
    'form.children_age': { ru: 'Ребёнок (до 8 лет)', en: 'Children (up to 8 years)' },
    'form.infants_age': { ru: 'Младенцы (0-2 лет)', en: 'Infants (0-2 years)' },
    'form.max_travelers_note': { ru: 'Вы можете выбрать до 15 туристов всего', en: 'You can select up to 15 travelers total' },
    
    // Навигация и breadcrumbs
    'breadcrumb.central_asia': { ru: 'Туры по Центральной Азии', en: 'Central Asia Tours' },
    'breadcrumb.tajikistan': { ru: 'Туры по Таджикистану', en: 'Tajikistan Tours' },
    'breadcrumb.mountain_tours': { ru: 'Горные туры', en: 'Mountain Tours' },
    
    // Страны Центральной Азии
    'country.uzbekistan': { ru: 'Узбекистан', en: 'Uzbekistan' },
    'country.tajikistan': { ru: 'Таджикистан', en: 'Tajikistan' },
    'country.kyrgyzstan': { ru: 'Киргизстан', en: 'Kyrgyzstan' },
    'country.turkmenistan': { ru: 'Туркменистан', en: 'Turkmenistan' },
    'country.kazakhstan': { ru: 'Казахстан', en: 'Kazakhstan' },

    // Города Центральной Азии
    'city.dushanbe': { ru: 'Душанбе', en: 'Dushanbe' },
    'city.khorog': { ru: 'Хорог', en: 'Khorog' },
    'city.khujand': { ru: 'Худжанд', en: 'Khujand' },
    'city.tashkent': { ru: 'Ташкент', en: 'Tashkent' },
    'city.samarkand': { ru: 'Самарканд', en: 'Samarkand' },
    'city.bukhara': { ru: 'Бухара', en: 'Bukhara' },
    'city.bishkek': { ru: 'Бишкек', en: 'Bishkek' },
    'city.astana': { ru: 'Астана', en: 'Astana' },
    'city.almaty': { ru: 'Алматы', en: 'Almaty' },
    'city.ashgabat': { ru: 'Ашхабад', en: 'Ashgabat' },
    
    // Расширенная навигация и услуги
    'nav.services': { ru: 'Услуги', en: 'Services' },
    'nav.guides': { ru: 'Тургиды', en: 'Tour Guides' },
    'nav.transfer': { ru: 'Трансфер', en: 'Transfer' },
    'nav.book_tour': { ru: 'Заказ тура', en: 'Book Tour' },
    'nav.tourists': { ru: 'Туристам', en: 'For Tourists' },
    'nav.site_guide': { ru: 'Инструкция сайта', en: 'Site Guide' },
    'nav.special_notes': { ru: 'Специальные заметки', en: 'Special Notes' },
    'nav.offer_agreement': { ru: 'Договор оферта', en: 'Offer Agreement' },
    'nav.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    'nav.promotions': { ru: 'Акции', en: 'Promotions' },
    'nav.news': { ru: 'Новости', en: 'News' },
    
    // Типы туров по категориям
    'tour.single_day': { ru: 'Однодневные', en: 'Single Day' },
    'tour.multi_day': { ru: 'Многодневные', en: 'Multi-Day' },
    'tour.excursions': { ru: 'Экскурсии', en: 'Excursions' },
    'tour.city_tours': { ru: 'Городские', en: 'City Tours' },
    'tour.nature_eco': { ru: 'Природа/экологические', en: 'Nature/Eco Tours' },
    'tour.cultural': { ru: 'Культурно познавательные', en: 'Cultural Tours' },
    'tour.historical': { ru: 'Исторические', en: 'Historical Tours' },
    'tour.trekking': { ru: 'Походы/трекинги', en: 'Trekking/Hiking' },
    'tour.mountain_landscapes': { ru: 'Горные ландшафты', en: 'Mountain Landscapes' },
    'tour.lake_landscapes': { ru: 'Озерные ландшафты', en: 'Lake Landscapes' },
    'tour.adventure': { ru: 'Приключенческие', en: 'Adventure Tours' },
    'tour.gastronomy': { ru: 'Гастрономические', en: 'Culinary Tours' },
    'tour.auto_safari': { ru: 'Авто/сафари/джип', en: 'Auto Tours/Safari/Jeep Tours' },
    'tour.agro': { ru: 'Агротуризм', en: 'Agro Tours' },
    'tour.vip': { ru: 'VIP', en: 'VIP Tours' },

    // Типы туров по формату
    'tour_type.personal': { ru: 'Персональный', en: 'Personal' },
    'tour_type.group_personal': { ru: 'Групповой персональный', en: 'Group Personal' },
    'tour_type.group_general': { ru: 'Групповой общий', en: 'Group General' },
    'tour_type.special': { ru: 'Специальный', en: 'Special' },
    
    'footer.public_offer': { ru: 'Публичная Оферта-Договор', en: 'Public Offer Agreement' },
    'footer.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    'footer.privacy_policy': { ru: 'Политика конфиденциальности', en: 'Privacy Policy' },
    'footer.company_info': { ru: 'Все права защищены | ООО "Бунёд-Тур" (2017-2025) | ИНН: 010098739; ОГРН: 0110023137', en: 'All rights reserved | Bunyod-Tour LLC (2017-2025) | TIN: 010098739; OGRN: 0110023137' },
    
    // Селектор языка
    'language.russian': { ru: 'Русский', en: 'Russian' },
    'language.english': { ru: 'English', en: 'English' },
    
    // Дополнительные языки (для совместимости)
    'lang.russian': { ru: 'Русский', en: 'Russian' },
    'lang.english': { ru: 'English', en: 'English' },
    
    // === ПОЛНЫЕ ПЕРЕВОДЫ ДЛЯ ВСЕХ СТРАНИЦ ===
    
    // About Us страница
    'about.page_title': { ru: 'О нас - Bunyod-Tour', en: 'About Us - Bunyod-Tour' },
    'about.main_title': { ru: 'О компании Bunyod-Tour', en: 'About Bunyod-Tour Company' },
    'about.subtitle': { ru: 'Ваш надежный партнер в путешествиях по Центральной Азии', en: 'Your reliable partner for travels in Central Asia' },
    'about.mission_title': { ru: 'Наша миссия', en: 'Our Mission' },
    'about.mission_text': { ru: 'Мы стремимся показать красоту и богатство культуры Центральной Азии каждому путешественнику, создавая незабываемые впечатления и безопасные путешествия.', en: 'We strive to show the beauty and richness of Central Asian culture to every traveler, creating unforgettable experiences and safe journeys.' },
    'about.vision_title': { ru: 'Наше видение', en: 'Our Vision' },
    'about.vision_text': { ru: 'Стать ведущей туристической компанией в регионе, объединяющей традиции и современные технологии для создания лучших туристических продуктов.', en: 'To become the leading tourism company in the region, combining traditions and modern technologies to create the best tourism products.' },
    'about.experience_years': { ru: 'лет опыта', en: 'years of experience' },
    'about.happy_clients': { ru: 'довольных клиентов', en: 'happy clients' },
    'about.tours_completed': { ru: 'проведенных туров', en: 'completed tours' },
    'about.team_members': { ru: 'участников команды', en: 'team members' },
    
    // News страница
    'news.page_title': { ru: 'Новости - Bunyod-Tour', en: 'News - Bunyod-Tour' },
    'news.main_title': { ru: 'Новости туризма', en: 'Tourism News' },
    'news.subtitle': { ru: 'Последние новости и события в мире туризма Центральной Азии', en: 'Latest news and events in Central Asian tourism' },
    'news.read_more': { ru: 'Читать далее', en: 'Read More' },
    'news.date_published': { ru: 'Дата публикации', en: 'Published on' },
    'news.no_news': { ru: 'Новостей пока нет', en: 'No news available yet' },
    'news.load_more': { ru: 'Загрузить еще', en: 'Load More' },
    'news.category_general': { ru: 'Общие новости', en: 'General News' },
    'news.category_tours': { ru: 'Туры', en: 'Tours' },
    'news.category_events': { ru: 'События', en: 'Events' },
    
    // Visa Support страница  
    'visa.page_title': { ru: 'Визовая поддержка - Bunyod-Tour', en: 'Visa Support - Bunyod-Tour' },
    'visa.main_title': { ru: 'Визовая поддержка', en: 'Visa Support' },
    'visa.subtitle': { ru: 'Полная поддержка в оформлении виз для путешествий по Центральной Азии', en: 'Complete support for visa processing for travel in Central Asia' },
    'visa.countries_title': { ru: 'Визовые требования по странам', en: 'Visa Requirements by Country' },
    'visa.tajikistan': { ru: 'Таджикистан', en: 'Tajikistan' },
    'visa.uzbekistan': { ru: 'Узбекистан', en: 'Uzbekistan' },
    'visa.kyrgyzstan': { ru: 'Кыргызстан', en: 'Kyrgyzstan' },
    'visa.kazakhstan': { ru: 'Казахстан', en: 'Kazakhstan' },
    'visa.turkmenistan': { ru: 'Туркменистан', en: 'Turkmenistan' },
    'visa.services_title': { ru: 'Наши услуги', en: 'Our Services' },
    'visa.consultation': { ru: 'Консультация по визовым вопросам', en: 'Visa consultation' },
    'visa.document_preparation': { ru: 'Подготовка документов', en: 'Document preparation' },
    'visa.invitation_letters': { ru: 'Приглашения и письма поддержки', en: 'Invitation and support letters' },
    'visa.processing_assistance': { ru: 'Помощь в подаче документов', en: 'Processing assistance' },
    'visa.contact_us': { ru: 'Свяжитесь с нами для получения визовой поддержки', en: 'Contact us for visa support' },
    
    // Tour Guides страница
    'guides.page_title': { ru: 'Тургиды - Bunyod-Tour', en: 'Tour Guides - Bunyod-Tour' },
    'guides.main_title': { ru: 'Наши профессиональные тургиды', en: 'Our Professional Tour Guides' },
    'guides.subtitle': { ru: 'Знакомьтесь с нашей командой экспертов, которые сделают ваше путешествие по Центральной Азии незабываемым. Каждый наш тургид — это профессионал с многолетним опытом и глубокими знаниями региона.', en: 'Meet our team of experts who will make your journey through Central Asia unforgettable. Each of our tour guides is a professional with years of experience and deep knowledge of the region.' },
    'guides.licensed_guides': { ru: 'Лицензированные гиды', en: 'Licensed Guides' },
    'guides.happy_clients': { ru: 'Более 1000 довольных клиентов', en: 'Over 1000 Happy Clients' },
    'guides.multilingual_support': { ru: 'Многоязычная поддержка', en: 'Multilingual Support' },
    'guides.coming_soon': { ru: 'Скоро здесь появятся наши тургиды', en: 'Our tour guides will appear here soon' },
    'guides.forming_team': { ru: 'Мы формируем команду профессиональных гидов для создания незабываемых путешествий', en: 'We are forming a team of professional guides to create unforgettable journeys' },
    'guides.hire_guide': { ru: 'Нанять тургида', en: 'Hire Tour Guide' },
    'guides.select_dates': { ru: 'Выберите даты', en: 'Select Dates' },
    'guides.cost_calculation': { ru: 'Расчет стоимости', en: 'Cost Calculation' },
    'guides.your_data': { ru: 'Ваши данные', en: 'Your Information' },
    'guides.price_per_day': { ru: 'Цена за день:', en: 'Price per day:' },
    'guides.selected_days': { ru: 'Выбрано дней:', en: 'Selected days:' },
    'guides.total': { ru: 'Итого:', en: 'Total:' },
    'guides.selected': { ru: 'Выбрано', en: 'Selected' },
    'guides.available': { ru: 'Доступно', en: 'Available' },
    'guides.occupied': { ru: 'Занято', en: 'Occupied' },
    'guides.unavailable': { ru: 'Недоступно', en: 'Unavailable' },
    'guides.experience': { ru: 'Опыт работы', en: 'Experience' },
    'guides.languages': { ru: 'Языки', en: 'Languages' },
    'guides.specialization': { ru: 'Специализация', en: 'Specialization' },
    'guides.rating': { ru: 'Рейтинг', en: 'Rating' },
    'guides.contact': { ru: 'Связаться', en: 'Contact' },
    'guides.reviews': { ru: 'отзывов', en: 'reviews' },
    'guides.book_guide': { ru: 'Забронировать гида', en: 'Book Guide' },
    'guides.view_profile': { ru: 'Посмотреть профиль', en: 'View Profile' },
    'guides.no_guides': { ru: 'Гиды не найдены', en: 'No guides found' },
    
    // Дни недели для календаря
    'calendar.monday': { ru: 'Пн', en: 'Mo' },
    'calendar.tuesday': { ru: 'Вт', en: 'Tu' },
    'calendar.wednesday': { ru: 'Ср', en: 'We' },
    'calendar.thursday': { ru: 'Чт', en: 'Th' },
    'calendar.friday': { ru: 'Пт', en: 'Fr' },
    'calendar.saturday': { ru: 'Сб', en: 'Sa' },
    'calendar.sunday': { ru: 'Вс', en: 'Su' },
    
    // Общие элементы для всех страниц
    'common.loading': { ru: 'Загрузка...', en: 'Loading...' },
    'common.error': { ru: 'Произошла ошибка', en: 'An error occurred' },
    'common.try_again': { ru: 'Попробовать снова', en: 'Try again' },
    'common.contact_us': { ru: 'Свяжитесь с нами', en: 'Contact Us' },
    'common.email': { ru: 'Электронная почта', en: 'Email' },
    'common.phone': { ru: 'Телефон', en: 'Phone' },
    'common.address': { ru: 'Адрес', en: 'Address' },
    'common.back_to_top': { ru: 'Наверх', en: 'Back to Top' },
    
    // НОВЫЕ PLACEHOLDER'Ы ДЛЯ АДМИН-ПАНЕЛИ
    'placeholder.search_hotels': { ru: 'Поиск отелей...', en: 'Search hotels...' },
    'placeholder.search_tour_agents': { ru: 'Поиск турагентов...', en: 'Search tour agents...' },
    'placeholder.enter_text_for_translation': { ru: 'Введите текст для перевода...', en: 'Enter text for translation...' },
    'placeholder.translated_text_will_appear': { ru: 'Переведенный текст появится здесь...', en: 'Translated text will appear here...' },
    'placeholder.service_name_example': { ru: 'Например: Обед в ресторане', en: 'For example: Restaurant lunch' },
    'placeholder.component_additional_info': { ru: 'Дополнительная информация о компоненте', en: 'Additional component information' },
    'placeholder.slide_title': { ru: 'Заголовок слайда', en: 'Slide title' },
    'placeholder.slide_description': { ru: 'Описание слайда', en: 'Slide description' },
    'placeholder.learn_more': { ru: 'Узнать больше', en: 'Learn more' },
    'placeholder.hotel_name_example': { ru: 'Отель Хилтон Душанбе, Серена Отель и т.д.', en: 'Hilton Dushanbe, Serena Hotel, etc.' },
    'placeholder.hotel_description_ru': { ru: 'Краткое описание отеля, расположения и особенностей на русском языке...', en: 'Brief hotel description, location and features in Russian...' },
    'placeholder.enter_new_brand': { ru: 'Введите название нового бренда', en: 'Enter new brand name' },
    'placeholder.city_examples': { ru: 'Душанбе, Самарканд, Бишкек и т.д.', en: 'Dushanbe, Samarkand, Bishkek, etc.' },
    'placeholder.enter_new_amenity': { ru: 'Введите название нового удобства', en: 'Enter new amenity name' },
    'placeholder.meeting_with_guide': { ru: 'Встреча с гидом', en: 'Meeting with guide' },
    'placeholder.detailed_stage_description': { ru: 'Подробное описание этапа программы', en: 'Detailed stage description' },
    'placeholder.pickup_info_example': { ru: 'Например: Приём включён, Место сбора: отель, и т.д.', en: 'For example: Pickup included, Meeting point: hotel, etc.' },
    'placeholder.enter_service_name': { ru: 'Введите название услуги', en: 'Enter service name' },
    'placeholder.news_brief_description': { ru: 'Краткое описание новости (optional)', en: 'Brief news description (optional)' },
    
    // Title атрибуты (всплывающие подсказки)
    'title.language_switcher': { ru: 'Переключить язык', en: 'Switch language' },
    'title.currency_switcher': { ru: 'Переключить валюту', en: 'Switch currency' },
    'title.search_button': { ru: 'Начать поиск', en: 'Start search' },
    'title.filter_button': { ru: 'Применить фильтры', en: 'Apply filters' },
    'title.book_tour': { ru: 'Забронировать тур', en: 'Book tour' },
    'title.view_details': { ru: 'Посмотреть детали', en: 'View details' },
    
    // АДМИН-ПАНЕЛЬ
    'admin.dashboard': { ru: 'Главная', en: 'Dashboard' },
    'admin.administrator': { ru: 'Администратор', en: 'Administrator' },
    'admin.logout': { ru: 'Выйти', en: 'Logout' },
    'admin.tours': { ru: 'Туры', en: 'Tours' },
    'admin.hotels': { ru: 'Отели', en: 'Hotels' },
    'admin.guides': { ru: 'Гиды', en: 'Guides' },
    'admin.bookings': { ru: 'Заказы', en: 'Bookings' },
    'admin.orders': { ru: 'Заказы', en: 'Orders' },
    'admin.settings': { ru: 'Настройки', en: 'Settings' },
    'admin.translations': { ru: 'Переводы', en: 'Translations' },
    'admin.cms': { ru: 'CMS - Контент', en: 'CMS - Content' },
    'admin.news': { ru: 'Новости', en: 'News' },
    'admin.drivers': { ru: 'Водители', en: 'Drivers' },
    'admin.transfers': { ru: 'Трансферы', en: 'Transfers' },
    'admin.transfer': { ru: 'Трансфер', en: 'Transfer' },
    'admin.countries': { ru: 'Страны', en: 'Countries' },
    'admin.cities': { ru: 'Города', en: 'Cities' },
    'admin.customers': { ru: 'Клиенты', en: 'Customers' },
    'admin.reviews': { ru: 'Отзывы', en: 'Reviews' },
    'admin.payments': { ru: 'Платежи', en: 'Payments' },
    'admin.control_panel': { ru: 'Панель управления', en: 'Control Panel' },
    'admin.admin_panel': { ru: 'Админ-панель', en: 'Admin Panel' },
    'admin.login_message': { ru: 'Войдите в систему управления', en: 'Sign in to the management system' },
    'admin.username': { ru: 'Имя пользователя', en: 'Username' },
    'admin.password': { ru: 'Пароль', en: 'Password' },
    'admin.login_button': { ru: 'Войти в систему', en: 'Sign In' },
    'admin.test_credentials': { ru: 'Тестовые данные: admin / admin123', en: 'Test credentials: admin / admin123' },
    'admin.recent_orders': { ru: 'Последние заказы', en: 'Recent Orders' },
    'admin.active_tours': { ru: 'Активных туров', en: 'Active Tours' },
    'admin.orders_this_month': { ru: 'Заказов за месяц', en: 'Orders This Month' },
    'admin.monthly_revenue': { ru: 'Доход за месяц', en: 'Monthly Revenue' },
    'admin.active_customers': { ru: 'Активных клиентов', en: 'Active Customers' },
    
    // НОВЫЕ АДМИНИСТРАТИВНЫЕ РАЗДЕЛЫ
    'admin.price_calculator': { ru: 'Калькулятор цен', en: 'Price Calculator' },
    'admin.banner_management': { ru: 'Управление баннером', en: 'Banner Management' },
    
    // Категории отелей
    'hotel.category.STANDARD': { ru: 'Стандарт', en: 'Standard' },
    'hotel.category.SEMI_LUX': { ru: 'Полулюкс', en: 'Semi-Luxury' },
    'hotel.category.LUX': { ru: 'Люкс', en: 'Luxury' },
    'hotel.category.DELUXE': { ru: 'Делюкс', en: 'Deluxe' },
    'admin.tour_agents': { ru: 'Турагенты', en: 'Tour Agents' },
    'admin.trips': { ru: 'Поездки', en: 'Trips' },
    'admin.exchange_rates': { ru: 'Курсы валют', en: 'Exchange Rates' },
    'admin.cms_content': { ru: 'CMS - Контент', en: 'CMS - Content' },
    'admin.sales_chart': { ru: 'График продаж', en: 'Sales Chart' },
    'admin.popular_destinations': { ru: 'Популярные направления', en: 'Popular Destinations' },
    'admin.manage_hotels': { ru: 'Управление отелями', en: 'Hotel Management' },
    'admin.manage_guides': { ru: 'Управление гидами', en: 'Guide Management' },
    'admin.manage_tour_agents': { ru: 'Управление турагентами', en: 'Tour Agent Management' },
    'admin.manage_drivers': { ru: 'Управление водителями', en: 'Driver Management' },
    'admin.manage_trips': { ru: 'Управление поездками', en: 'Trip Management' },
    'admin.transfer_requests': { ru: 'Заявки на трансфер', en: 'Transfer Requests' },
    'admin.manage_countries': { ru: 'Управление странами', en: 'Country Management' },
    'admin.manage_cities': { ru: 'Управление городами', en: 'City Management' },
    'admin.total_views': { ru: 'Всего просмотров', en: 'Total Views' },
    'admin.total_news': { ru: 'Всего новостей', en: 'Total News' },
    'admin.published': { ru: 'Опубликовано', en: 'Published' },
    'admin.drafts': { ru: 'Черновики', en: 'Drafts' },
    'admin.tour_blocks': { ru: 'Блоки туров', en: 'Tour Blocks' },
    'admin.site_settings': { ru: 'Настройки сайта', en: 'Site Settings' },
    'admin.tour_form': { ru: 'Форма тура', en: 'Tour Form' },
    'admin.manage_tour_blocks': { ru: 'Управление блоками туров', en: 'Tour Block Management' },
    
    // ТАБЛИЦЫ
    'table.order_number': { ru: 'Номер заказа', en: 'Order #' },
    'table.client': { ru: 'Клиент', en: 'Client' },
    'table.tour': { ru: 'Тур', en: 'Tour' },
    'table.date': { ru: 'Дата', en: 'Date' },
    'table.amount': { ru: 'Сумма', en: 'Amount' },
    'table.status': { ru: 'Статус', en: 'Status' },
    'table.actions': { ru: 'Действия', en: 'Actions' },
    'table.name': { ru: 'Название', en: 'Name' },
    'table.category': { ru: 'Категория', en: 'Category' },
    'table.country': { ru: 'Страна', en: 'Country' },
    'table.city': { ru: 'Город', en: 'City' },
    'table.duration': { ru: 'Длительность', en: 'Duration' },
    'table.price': { ru: 'Цена', en: 'Price' },
    'table.title': { ru: 'Заголовок', en: 'Title' },
    'table.author': { ru: 'Автор', en: 'Author' },
    'table.publish_date': { ru: 'Дата публикации', en: 'Publish Date' },
    'table.views': { ru: 'Просмотры', en: 'Views' },
    'table.block_name_ru': { ru: 'Название блока (RU)', en: 'Block Name (RU)' },
    'table.block_name_en': { ru: 'Название блока (EN)', en: 'Block Name (EN)' },
    'table.slug': { ru: 'URL-адрес', en: 'Slug' },
    'table.tour_count': { ru: 'Количество туров', en: 'Tour Count' },
    'table.order': { ru: 'Порядок', en: 'Order' },
    
    // КНОПКИ
    'btn.add_tour': { ru: 'Добавить тур', en: 'Add Tour' },
    'btn.create_tour_block': { ru: 'Создать блок туров', en: 'Create Tour Block' },
    'btn.add_hotel': { ru: 'Добавить отель', en: 'Add Hotel' },
    'btn.add_guide': { ru: 'Добавить гида', en: 'Add Guide' },
    'btn.add_tour_agent': { ru: 'Добавить турагента', en: 'Add Tour Agent' },
    'btn.add_driver': { ru: 'Добавить водителя', en: 'Add Driver' },
    'btn.add_trip': { ru: 'Добавить поездку', en: 'Add Trip' },
    'btn.add_country': { ru: 'Добавить страну', en: 'Add Country' },
    'btn.add_city': { ru: 'Добавить город', en: 'Add City' },
    
    // СТАТУСЫ
    'status.pending': { ru: 'Ожидание', en: 'Pending' },
    'status.confirmed': { ru: 'Подтвержден', en: 'Confirmed' },
    'status.paid': { ru: 'Оплачен', en: 'Paid' },
    'status.completed': { ru: 'Завершен', en: 'Completed' },
    'status.cancelled': { ru: 'Отменен', en: 'Cancelled' },
    
    // ТАБЫ
    'tab.all_orders': { ru: 'Все заказы', en: 'All Orders' },
    
    // ФОРМЫ
    'form.pickup_info': { ru: 'Информация о встрече/трансфере', en: 'Pickup/Meeting Information' },
    'form.tour_languages': { ru: 'Языки тура', en: 'Tour Languages' },
    'form.min_people': { ru: 'Минимальное количество людей', en: 'Minimum Number of People' },
    'form.max_people': { ru: 'Максимальное количество людей', en: 'Maximum Number of People' },
    'form.available_months': { ru: 'Доступные месяцы', en: 'Available Months' },
    'form.available_days': { ru: 'Доступные дни', en: 'Available Days' },
    'form.tour_photos': { ru: 'Фотографии тура', en: 'Tour Photos' },
    
    // ЯЗЫКИ
    'language.russian': { ru: 'Русский', en: 'Russian' },
    
    // НОВЫЕ КЛЮЧИ ДЛЯ РАСШИРЕННОГО ПОКРЫТИЯ
    'nav.services': { ru: 'Услуги', en: 'Services' },
    'nav.guides': { ru: 'Тургиды', en: 'Tour Guides' },
    'nav.transfer': { ru: 'Трансфер', en: 'Transfer' },
    'nav.book_tour': { ru: 'Заказ тура', en: 'Book Tour' },
    'nav.tourists': { ru: 'Туристам', en: 'For Tourists' },
    'nav.promotions': { ru: 'Акции', en: 'Promotions' },
    'nav.news': { ru: 'Новости', en: 'News' },
    
    // Фильтры и кнопки
    'btn.apply_filters': { ru: 'Применить фильтры', en: 'Apply Filters' },
    'btn.reset_filters': { ru: 'Сбросить все фильтры', en: 'Reset all filters' },
    
    // Сообщения о поиске
    'common.no_tours_found': { ru: 'Туры не найдены', en: 'No tours found' },
    'common.try_different_search': { ru: 'Попробуйте изменить параметры поиска', en: 'Try changing search parameters' },
    'common.tours_shown': { ru: 'Показано туров:', en: 'Tours shown:' },
    
    // Формы и поля
    'form.date_from': { ru: 'От', en: 'From' },
    'form.date_to': { ru: 'До', en: 'To' },
    
    // Модальные окна
    'modal.tour_details': { ru: 'Детали тура', en: 'Tour Details' },
    'modal.description': { ru: 'Описание тура', en: 'Tour Description' },
    'modal.program': { ru: 'Программа тура', en: 'Tour Program' },
    'modal.hotels': { ru: 'Отели', en: 'Hotels' },
    'modal.features': { ru: 'Особенности тура:', en: 'Tour Features:' },
    
    // === НОВЫЕ КЛЮЧИ ДЛЯ index.html ===
    
    // Заголовок страницы
    'page.title': { ru: 'Bunyod-Tour - Туры по Таджикистану', en: 'Bunyod-Tour - Tours in Tajikistan' },

    // Дополнительная навигация
    'nav.site_guide': { ru: 'Инструкция сайта', en: 'Site Guide' },
    'nav.special_notes': { ru: 'Специальные заметки', en: 'Special Notes' },
    'nav.offer_agreement': { ru: 'Договор оферта', en: 'Offer Agreement' },
    'nav.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    'nav.our_agents': { ru: 'Наши турагенты', en: 'Our Travel Agents' },

    // Типы туров в навигации
    'tour.single_day': { ru: 'Однодневные', en: 'Single Day' },
    'tour.multi_day': { ru: 'Многодневные', en: 'Multi Day' },
    'tour.excursions': { ru: 'Экскурсии', en: 'Excursions' },
    'tour.city_tours': { ru: 'Городские', en: 'City Tours' },
    'tour.nature_eco': { ru: 'Природа/экологические', en: 'Nature/Eco Tours' },
    'tour.cultural': { ru: 'Культурно познавательные', en: 'Cultural Educational Tours' },
    'tour.historical': { ru: 'Исторические', en: 'Historical Tours' },
    'tour.trekking': { ru: 'Походы/трекинги', en: 'Hiking/Trekking' },
    'tour.mountain_landscapes': { ru: 'Горные ландшафты', en: 'Mountain Landscapes' },
    'tour.lake_landscapes': { ru: 'Озерные ландшафты', en: 'Lake Landscapes' },
    'tour.adventure': { ru: 'Приключенческие', en: 'Adventure Tours' },
    'tour.gastronomy': { ru: 'Гастрономические', en: 'Gastronomy Tours' },
    'tour.auto_safari': { ru: 'Авто/сафари/джип', en: 'Auto/Safari/Jeep Tours' },
    'tour.agro': { ru: 'Агротуризм', en: 'Agro Tours' },
    'tour.vip': { ru: 'VIP', en: 'VIP Tours' },

    // Placeholder
    'placeholder.search_perfect_tour': { ru: 'Найдите идеальный тур: Памир, Искандеркуль, треккинг...', en: 'Find the perfect tour: Pamir, Iskanderkul, trekking...' },


    // Типы туров
    'tour_type.personal': { ru: 'Персональный', en: 'Personal' },
    'tour_type.group_personal': { ru: 'Групповой персональный', en: 'Group Personal' },
    'tour_type.group_general': { ru: 'Групповой общий', en: 'Group General' },
    'tour_type.special': { ru: 'Специальный', en: 'Special' },

    // Заголовки сервисов
    'service.transfer_title': { ru: 'ТРАНСФЕР', en: 'TRANSFER' },
    'service.guides_title': { ru: 'ТУР-ГИДЫ', en: 'TOUR GUIDES' },
    'service.agency_title': { ru: 'АГЕНТСКИЙ СЕРВИС', en: 'AGENCY SERVICE' },
    'service.custom_tour_title': { ru: 'СОБСТВЕННЫЙ ТУР', en: 'CUSTOM TOUR' },

    // Города
    'city.dushanbe': { ru: 'Душанбе', en: 'Dushanbe' },
    'city.khorog': { ru: 'Хорог', en: 'Khorog' },
    'city.khujand': { ru: 'Худжанд', en: 'Khujand' },
    'city.tashkent': { ru: 'Ташкент', en: 'Tashkent' },
    'city.samarkand': { ru: 'Самарканд', en: 'Samarkand' },
    'city.bukhara': { ru: 'Бухара', en: 'Bukhara' },
    'city.bishkek': { ru: 'Бишкек', en: 'Bishkek' },
    'city.astana': { ru: 'Астана', en: 'Astana' },
    'city.almaty': { ru: 'Алматы', en: 'Almaty' },
    'city.ashgabat': { ru: 'Ашхабад', en: 'Ashgabat' },

    // Подвал (без дублирования)

    // Языки
    'lang.russian': { ru: 'Русский', en: 'Russian' },

    // Дополнительные языки для списков
    'lang.english': { ru: 'Английский', en: 'English' },
    'lang.tajik': { ru: 'Таджикский', en: 'Tajik' },
    
    // Единицы времени
    'time.hours': { ru: 'часов', en: 'hours' },
    'time.hour': { ru: 'час', en: 'hour' },
    
    // Navigation submenus for tours
    'nav.tours.one_day': { ru: 'Однодневные', en: 'One Day' },
    'nav.tours.multi_day': { ru: 'Многодневные', en: 'Multi Day' },
    'nav.tours.excursions': { ru: 'Экскурсии', en: 'Excursions' },
    'nav.tours.city_tours': { ru: 'Городские', en: 'City Tours' },
    'nav.tours.nature_eco': { ru: 'Природа/экологические', en: 'Nature/Eco Tours' },
    'nav.tours.cultural': { ru: 'Культурно познавательные', en: 'Cultural Educational Tours' },
    'nav.tours.historical': { ru: 'Исторические', en: 'Historical Tours' },
    'nav.tours.hiking': { ru: 'Походы/трекинги', en: 'Hiking/Trekking' },
    'nav.tours.mountain': { ru: 'Горные ландшафты', en: 'Mountain Landscapes' },
    'nav.tours.lakes': { ru: 'Озерные ландшафты', en: 'Lake Landscapes' },
    'nav.tours.adventure': { ru: 'Приключенческие', en: 'Adventure Tours' },
    'nav.tours.gastronomy': { ru: 'Гастрономические', en: 'Gastronomy Tours' },
    'nav.tours.safari': { ru: 'Авто/сафари/джип', en: 'Auto/Safari/Jeep Tours' },
    'nav.tours.agro': { ru: 'Агротуризм', en: 'Agro Tours' },
    'nav.tours.vip': { ru: 'VIP', en: 'VIP Tours' },
    
    // Tourist menu navigation
    'nav.tourists.instructions': { ru: 'Инструкция сайта', en: 'Site Instructions' },
    'nav.tourists.special_notes': { ru: 'Специальные заметки', en: 'Special Notes' },
    'nav.tourists.contract': { ru: 'Договор оферта', en: 'Offer Agreement' },
    'nav.tourists.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    
    // Tour agents navigation
    'nav.agents': { ru: 'Тур-агенты', en: 'Tour Agents' },
    'nav.agents.our_agents': { ru: 'Наши турагенты', en: 'Our Tour Agents' },
    'nav.agents.for_agents': { ru: 'Для турагентов', en: 'For Tour Agents' },
    
    // Ключи для about-us.html
    'about.page_title': { ru: 'О нас - Bunyod-Tour', en: 'About Us - Bunyod-Tour' },
    'about.nav.about': { ru: 'О нас', en: 'About Us' },
    'about.nav.mission': { ru: 'Миссия', en: 'Mission' },
    'about.nav.team': { ru: 'Команда', en: 'Team' },
    'about.title': { ru: 'О НАС', en: 'ABOUT US' },
    'about.mission_title': { ru: 'МИССИЯ', en: 'MISSION' },
    'about.services_title': { ru: 'НАШИ УСЛУГИ / ПРОДУКТЫ', en: 'OUR SERVICES / PRODUCTS' },
    'about.company_title': { ru: 'Наша компания', en: 'Our Company' },
    'about.agency_service': { ru: 'АГЕНТСКИЙ СЕРВИС', en: 'AGENCY SERVICE' },
    
    // Ключи для news.html
    'news.page_title': { ru: 'Новости - Bunyod-Tour', en: 'News - Bunyod-Tour' },
    'news.featured_news': { ru: 'Рекомендуемая новость', en: 'Featured News' },
    'news.all_news': { ru: 'Все новости', en: 'All News' },
    'news.no_news_found': { ru: 'Новостей не найдено', en: 'No news found' },
    'news.loading_error': { ru: 'Ошибка при загрузке новостей', en: 'Error loading news' },
    'news.connection_error': { ru: 'Ошибка подключения к серверу', en: 'Server connection error' },
    'news.error': { ru: 'Ошибка', en: 'Error' },
    'news.read_more': { ru: 'Читать далее', en: 'Read More' },
    
    // Ключи для visa-support.html
    'visa.page_title': { ru: 'Визовая поддержка - Bunyod-Tour', en: 'Visa Support - Bunyod-Tour' },
    'visa.main_title': { ru: 'ВИЗА ТАДЖИКИСТАНА', en: 'TAJIKISTAN VISA' },
    'visa.intro_text': { ru: 'Для визита в Таджикистан выдается три вида визы:', en: 'Three types of visas are issued for visiting Tajikistan:' },
    'visa.visa_free': { ru: 'Безвизовый режим', en: 'Visa-free regime' },
    'visa.e_visa': { ru: 'Электронная виза', en: 'Electronic visa' },
    'visa.standard_visa': { ru: 'Стандартная виза', en: 'Standard visa' },
    'visa.visa_free_section': { ru: 'БЕЗВИЗОВЫЙ РЕЖИМ', en: 'VISA-FREE REGIME' },
    
    // Ключи для tour-guides.html
    'guides.page_title': { ru: 'Тургиды - Bunyod-Tour', en: 'Tour Guides - Bunyod-Tour' },
    'guides.main_title': { ru: 'НАШИ ТУРГИДЫ', en: 'OUR TOUR GUIDES' },
    'guides.coming_soon': { ru: 'Скоро здесь появятся наши тургиды', en: 'Our tour guides will appear here soon' },
    'guides.hire_guide': { ru: 'Нанять тургида', en: 'Hire a Tour Guide' },
    'guides.select_dates': { ru: 'Выберите даты', en: 'Select Dates' },
    'guides.cost_calculation': { ru: 'Расчет стоимости', en: 'Cost Calculation' },
    'guides.your_data': { ru: 'Ваши данные', en: 'Your Information' },
    
    // Language selector
    'nav.lang.russian': { ru: 'Русский', en: 'Russian' },
    
    // Breadcrumb navigation
    'breadcrumb.central_asia': { ru: 'Туры по Центральной Азии', en: 'Central Asia Tours' },
    'breadcrumb.tajikistan': { ru: 'Туры по Таджикистану', en: 'Tajikistan Tours' },
    'breadcrumb.mountain_tours': { ru: 'Горные туры', en: 'Mountain Tours' },
    
    // Buttons and actions
    'btn.more_photos': { ru: 'Ещё фото', en: 'More Photos' },
    'btn.view_all_photos': { ru: 'Посмотреть все фотографии', en: 'View All Photos' },
    'btn.share': { ru: 'Поделиться', en: 'Share' },
    'btn.copy_link': { ru: 'Скопировать ссылку', en: 'Copy Link' },
    'btn.download_pdf': { ru: 'Скачать PDF', en: 'Download PDF' },
    'btn.apply': { ru: 'Применить', en: 'Apply' },
    
    // Form elements
    'form.check_dates': { ru: 'Проверить доступные даты', en: 'Check Available Dates' },
    'form.travelers_count': { ru: 'Количество туристов', en: 'Number of Travelers' },
    'form.one_adult': { ru: '1 взрослый', en: '1 Adult' },
    'form.max_travelers_note': { ru: 'Вы можете выбрать до 15 туристов всего', en: 'You can select up to 15 travelers total' },
    'form.adults_age': { ru: 'Взрослые (от 9 лет)', en: 'Adults (9+ years)' },
    'form.adults_range': { ru: 'Минимум: 1, Максимум: 15', en: 'Minimum: 1, Maximum: 15' },
    'form.children_age': { ru: 'Ребёнок (до 8 лет)', en: 'Child (up to 8 years)' },
    'form.children_range': { ru: 'Минимум: 0, Максимум: 15', en: 'Minimum: 0, Maximum: 15' },
    'form.infants_age': { ru: 'Младенцы (0-2 лет)', en: 'Infants (0-2 years)' },
    'form.tour_start_time': { ru: 'Время начала тура', en: 'Tour Start Time' },
    'form.no_hidden_fees': { ru: 'Никаких скрытых платежей', en: 'No Hidden Fees' },
    'form.select_country_first': { ru: 'Сначала выберите страну', en: 'Select country first' },
    
    // Calendar days
    'calendar.mon': { ru: 'Пн', en: 'Mon' },
    'calendar.tue': { ru: 'Вт', en: 'Tue' },
    'calendar.wed': { ru: 'Ср', en: 'Wed' },
    'calendar.thu': { ru: 'Чт', en: 'Thu' },
    'calendar.fri': { ru: 'Пт', en: 'Fri' },
    'calendar.sat': { ru: 'Сб', en: 'Sat' },
    'calendar.sun': { ru: 'Вс', en: 'Sun' },
    
    // Filter sections for tours.html
    'filters.title': { ru: 'Фильтры поиска', en: 'Search Filters' },
    'filters.destination': { ru: 'Направление', en: 'Destination' },
    'filters.format': { ru: 'Формат тура', en: 'Tour Format' },
    'filters.duration': { ru: 'Длительность тура', en: 'Tour Duration' },
    'filters.theme': { ru: 'Тематика тура', en: 'Tour Theme' },
    'filters.group': { ru: 'Групповой', en: 'Group' },
    'filters.individual': { ru: 'Индивидуальный', en: 'Individual' },
    'filters.one_day': { ru: 'Однодневный', en: 'One Day' },
    'filters.multi_day': { ru: 'Многодневный (2-5 дней)', en: 'Multi Day (2-5 days)' },
    'filters.long_term': { ru: 'Длительный (6+ дней)', en: 'Long Term (6+ days)' },
    
    // Filter theme options
    'filters.theme.overview': { ru: 'Обзорная экскурсия', en: 'Overview Excursion' },
    'filters.theme.trekking': { ru: 'Походы / трекинг', en: 'Hiking / Trekking' },
    'filters.theme.mountain': { ru: 'Горные маршруты', en: 'Mountain Routes' },
    'filters.theme.lake': { ru: 'Озёрные маршруты', en: 'Lake Routes' },
    'filters.theme.historical': { ru: 'Исторический тур', en: 'Historical Tour' },
    'filters.theme.recreational': { ru: 'Рекреационный тур', en: 'Recreational Tour' },
    'filters.theme.agro': { ru: 'Агро-туризм', en: 'Agro Tourism' },
    'filters.theme.health': { ru: 'Санаторно-оздоровительный тур', en: 'Health & Wellness Tour' },
    'filters.theme.combined': { ru: 'Комбинированный тур по Центральной Азии', en: 'Combined Central Asia Tour' },
    
    // Date filter
    'filters.date': { ru: 'Дата проведения', en: 'Date' },
    
    // === НОВЫЕ КЛЮЧИ ДЛЯ АДМИН-ПАНЕЛИ ===
    
    // Дополнительные административные разделы
    'admin.price_calculator': { ru: 'Калькулятор цен', en: 'Price Calculator' },
    'admin.banner_management': { ru: 'Управление баннерами', en: 'Banner Management' },
    'admin.tour_agents': { ru: 'Турагенты', en: 'Tour Agents' },
    'admin.trips': { ru: 'Поездки', en: 'Trips' },
    'admin.exchange_rates': { ru: 'Курсы валют', en: 'Exchange Rates' },
    'admin.cms_content': { ru: 'CMS - Контент', en: 'CMS - Content' },
    'admin.translations': { ru: 'Переводы', en: 'Translations' },
    'admin.monthly_revenue': { ru: 'Доход за месяц', en: 'Monthly Revenue' },
    'admin.active_customers': { ru: 'Активные клиенты', en: 'Active Customers' },
    'admin.sales_chart': { ru: 'График продаж', en: 'Sales Chart' },
    'admin.popular_destinations': { ru: 'Популярные направления', en: 'Popular Destinations' },
    'admin.manage_hotels': { ru: 'Управление отелями', en: 'Hotel Management' },
    'admin.manage_guides': { ru: 'Управление гидами', en: 'Guide Management' },
    'admin.manage_tour_agents': { ru: 'Управление турагентами', en: 'Tour Agent Management' },
    'admin.manage_drivers': { ru: 'Управление водителями', en: 'Driver Management' },
    'admin.manage_trips': { ru: 'Управление поездками', en: 'Trip Management' },
    'admin.transfer_requests': { ru: 'Запросы трансфера', en: 'Transfer Requests' },
    'admin.manage_countries': { ru: 'Управление странами', en: 'Country Management' },
    'admin.manage_cities': { ru: 'Управление городами', en: 'City Management' },
    'admin.total_views': { ru: 'Всего просмотров', en: 'Total Views' },
    'admin.total_news': { ru: 'Всего новостей', en: 'Total News' },
    'admin.published': { ru: 'Опубликовано', en: 'Published' },
    'admin.drafts': { ru: 'Черновики', en: 'Drafts' },
    'admin.tour_blocks': { ru: 'Блоки туров', en: 'Tour Blocks' },
    'admin.site_settings': { ru: 'Настройки сайта', en: 'Site Settings' },
    'admin.tour_form': { ru: 'Форма тура', en: 'Tour Form' },
    'admin.manage_tour_blocks': { ru: 'Управление блоками туров', en: 'Tour Block Management' },

    // Заголовки таблиц
    'table.order_number': { ru: 'Заказ №', en: 'Order #' },
    'table.client': { ru: 'Клиент', en: 'Client' },
    'table.tour': { ru: 'Тур', en: 'Tour' },
    'table.date': { ru: 'Дата', en: 'Date' },
    'table.amount': { ru: 'Сумма', en: 'Amount' },
    'table.status': { ru: 'Статус', en: 'Status' },
    'table.actions': { ru: 'Действия', en: 'Actions' },
    'table.name': { ru: 'Название', en: 'Name' },
    'table.category': { ru: 'Категория', en: 'Category' },
    'table.country': { ru: 'Страна', en: 'Country' },
    'table.city': { ru: 'Город', en: 'City' },
    'table.duration': { ru: 'Длительность', en: 'Duration' },
    'table.price': { ru: 'Цена', en: 'Price' },
    'table.title': { ru: 'Заголовок', en: 'Title' },
    'table.author': { ru: 'Автор', en: 'Author' },
    'table.publish_date': { ru: 'Дата публикации', en: 'Publish Date' },
    'table.views': { ru: 'Просмотры', en: 'Views' },
    'table.block_name_ru': { ru: 'Название блока (RU)', en: 'Block Name (RU)' },
    'table.block_name_en': { ru: 'Название блока (EN)', en: 'Block Name (EN)' },
    'table.slug': { ru: 'Слаг', en: 'Slug' },
    'table.tour_count': { ru: 'Количество туров', en: 'Tour Count' },
    'table.order': { ru: 'Порядок', en: 'Order' },

    // Дополнительные кнопки
    'btn.add_tour': { ru: 'Добавить тур', en: 'Add Tour' },
    'btn.create_tour_block': { ru: 'Создать блок туров', en: 'Create Tour Block' },
    'btn.add_hotel': { ru: 'Добавить отель', en: 'Add Hotel' },
    'btn.add_guide': { ru: 'Добавить гида', en: 'Add Guide' },
    'btn.add_tour_agent': { ru: 'Добавить турагента', en: 'Add Tour Agent' },
    'btn.add_driver': { ru: 'Добавить водителя', en: 'Add Driver' },
    'btn.add_trip': { ru: 'Добавить поездку', en: 'Add Trip' },
    'btn.add_country': { ru: 'Добавить страну', en: 'Add Country' },
    'btn.add_city': { ru: 'Добавить город', en: 'Add City' },

    // Статусы заказов
    'status.pending': { ru: 'В ожидании', en: 'Pending' },
    'status.confirmed': { ru: 'Подтвержден', en: 'Confirmed' },
    'status.paid': { ru: 'Оплачен', en: 'Paid' },
    'status.completed': { ru: 'Завершен', en: 'Completed' },
    'status.cancelled': { ru: 'Отменен', en: 'Cancelled' },

    // Вкладки
    'tab.all_orders': { ru: 'Все заказы', en: 'All Orders' },

    // Формы и поля
    'form.pickup_info': { ru: 'Информация о встрече/трансфере', en: 'Pickup/Meeting Information' },
    'form.tour_languages': { ru: 'Языки тура', en: 'Tour Languages' },
    'form.min_people': { ru: 'Минимальное количество людей', en: 'Minimum Number of People' },
    'form.max_people': { ru: 'Максимальное количество людей', en: 'Maximum Number of People' },
    'form.available_months': { ru: 'Доступные месяцы', en: 'Available Months' },
    'form.available_days': { ru: 'Доступные дни', en: 'Available Days' },
    'form.tour_photos': { ru: 'Фотографии тура', en: 'Tour Photos' },

    // Дополнительные placeholder'ы
    'placeholder.search_tours': { ru: 'Поиск туров...', en: 'Search tours...' },
    'placeholder.search_hotels': { ru: 'Поиск отелей...', en: 'Search hotels...' },
    'placeholder.search_tour_agents': { ru: 'Поиск турагентов...', en: 'Search tour agents...' },
    'placeholder.enter_text_for_translation': { ru: 'Введите текст для перевода...', en: 'Enter text for translation...' },
    'placeholder.translated_text_will_appear': { ru: 'Переведенный текст появится здесь...', en: 'Translated text will appear here...' },
    'placeholder.service_name_example': { ru: 'Например: Обед в ресторане', en: 'For example: Restaurant lunch' },
    'placeholder.component_additional_info': { ru: 'Дополнительная информация о компоненте', en: 'Additional component information' },
    'placeholder.slide_title': { ru: 'Заголовок слайда', en: 'Slide title' },
    'placeholder.slide_description': { ru: 'Описание слайда', en: 'Slide description' },
    'placeholder.learn_more': { ru: 'Узнать больше', en: 'Learn more' },
    'placeholder.hotel_name_example': { ru: 'Hilton Dushanbe, Serena Hotel и т.д.', en: 'Hilton Dushanbe, Serena Hotel, etc.' },
    'placeholder.hotel_description_ru': { ru: 'Краткое описание отеля, местоположение и особенности на русском...', en: 'Brief hotel description, location and features in Russian...' },
    'placeholder.enter_new_brand': { ru: 'Введите название нового бренда', en: 'Enter new brand name' },
    'placeholder.city_examples': { ru: 'Душанбе, Самарканд, Бишкек и т.д.', en: 'Dushanbe, Samarkand, Bishkek, etc.' },
    'placeholder.enter_new_amenity': { ru: 'Введите название новой услуги', en: 'Enter new amenity name' },
    'placeholder.meeting_with_guide': { ru: 'Встреча с гидом', en: 'Meeting with guide' },
    'placeholder.detailed_stage_description': { ru: 'Подробное описание этапа', en: 'Detailed stage description' },
    'placeholder.pickup_info_example': { ru: 'Например: Трансфер включен, Место встречи: отель и т.д.', en: 'For example: Pickup included, Meeting point: hotel, etc.' },
    'placeholder.enter_service_name': { ru: 'Введите название услуги', en: 'Enter service name' },
    'placeholder.news_brief_description': { ru: 'Краткое описание новости (по желанию)', en: 'Brief news description (optional)' },

    // Языки
    'language.russian': { ru: 'Русский', en: 'Russian' },
    
    // === ДОПОЛНИТЕЛЬНЫЕ ПЕРЕВОДЫ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ===
    
    // Заголовки основных секций
    'hero.more_with_bunyod': { ru: 'Больше с Bunyod-Tour', en: 'More with Bunyod-Tour' },
    'title.tour_types': { ru: 'Виды туров', en: 'Tour Types' },
    
    // Описания типов туров
    'tour_type.personal_desc': { ru: 'Только для вас с персональным подходом', en: 'Just for you with a personal approach' },
    'tour_type.group_personal_desc': { ru: 'Комфортный тур для группы до 4 человек с персональным подходом', en: 'Comfortable tour for groups up to 4 people with personal approach' },
    'tour_type.group_general_desc': { ru: 'Экономичный тур для группы до 20 человек, куда каждый может присоединиться', en: 'Economical tour for groups up to 20 people, anyone can join' },
    'tour_type.special_desc': { ru: 'Тур, составленный по вашим личным пожеланиям с персональным подходом', en: 'Tour tailored to your personal preferences with individual approach' },
    
    // Информационные блоки - краткие описания
    'info.free_cancellation_desc': { ru: 'Отмена бронирования до 30 дней до начала тура, возврат 100%', en: 'Cancel booking up to 30 days before tour start, 100% refund' },
    'info.book_pay_later_desc': { ru: 'Записывайтесь на групповые туры всего за 10% от стоимости тура', en: 'Book group tours for just 10% of the tour cost' },
    'info.hot_tours_desc': { ru: 'Успейте забронировать туры и экскурсии за доступные цены!', en: 'Hurry to book last-minute deals at great prices!' },
    'info.promotions_desc': { ru: 'Бронируйте любой тур за 12 месяцев и экономьте 12%, это и другие привилегии у нас!', en: 'Book any tour 12 months in advance and save 12%, plus other privileges!' },
    
    // Кнопки для информационных блоков
    'btn.details': { ru: 'подробнее', en: 'details' },
    'btn.hide': { ru: 'скрыть', en: 'hide' },
    
    // Детальные описания в overlay блоках
    'info.free_cancellation_detail1': { ru: 'Бесплатная отмена – отмена тура со стороны клиента в срок до 30 дней до начала тура, возврат 100%. Однако данный возврат не распространяется на туры, забронированные менее чем за этот срок.', en: 'Free cancellation - tour cancellation by the client up to 30 days before the tour start, 100% refund. However, this refund does not apply to tours booked less than this period.' },
    'info.free_cancellation_detail2': { ru: 'Система должна распознавать эти требования автоматически.', en: 'The system should recognize these requirements automatically.' },
    
    'info.book_pay_later_detail1': { ru: 'Турист записывается на групповой общий тур; оплачивает 10% от стоимости тура, чтобы забронировать тур. Это раннее бронирование за 12 месяцев (минимум до 30 дней до начала тура).', en: 'Tourist books a group shared tour; pays 10% of the tour cost to reserve the tour. This is early booking up to 12 months (minimum until 30 days before tour start).' },
    'info.book_pay_later_detail2': { ru: 'В калькуляторе нужно установить ограничение: любая запись на тур доступна в срок бронирования до 30 дней; в 29-й день до срока доступ закрывается.', en: 'In the calculator, a restriction should be set: any tour booking is available up to 30 days; on the 29th day before the deadline, access closes.' },
    
    'info.hot_tours_detail1': { ru: 'В системе бронирования необходимо установить лимит, когда необходимо, чтобы туры, особенно групповые общие экскурсии, были переключены в категорию "Горящие туры".', en: 'In the booking system, it is necessary to set a limit when tours, especially group shared excursions, should be switched to the "Hot Tours" category.' },
    'info.hot_tours_detail2': { ru: 'Пока остается так, однако два предыдущих блока "Бронируй сейчас, плати потом" и "Горящие туры" входят в этот компонент.', en: 'For now it remains like this, however the two previous blocks "Book now, pay later" and "Hot tours" are part of this component.' },
    
    'info.promotions_detail': { ru: 'Пока остается так, однако два предыдущих блока "Бронируй сейчас, плати потом" входят в этот компонент.', en: 'For now it remains like this, however the two previous blocks "Book now, pay later" are part of this component.' },
    
    // Описания услуг в карточках
    'service.transfer_feature1': { ru: 'Поездки по территории всех 5-СТАН с опытными водителями', en: 'Trips across all 5-STAN territories with experienced drivers' },
    'service.transfer_feature2': { ru: 'Встречи в аэропорту, ЖД и границах 5-СТАН', en: 'Airport, railway and border pickups in 5-STAN' },
    'service.transfer_feature3': { ru: 'Межстрановые и межгородские поездки', en: 'Inter-country and inter-city trips' },
    'service.transfer_feature4': { ru: 'Доступные и комфортные автомобили', en: 'Affordable and comfortable vehicles' },
    'btn.order_transfer': { ru: 'Заказать трансфер', en: 'Order Transfer' },
    
    'service.guides_feature1': { ru: 'Опытные тур-гиды во всех 5-СТАН', en: 'Experienced tour guides in all 5-STAN' },
    'service.guides_feature2': { ru: 'Профессиональное сопровождение', en: 'Professional accompaniment' },
    'service.guides_feature3': { ru: 'Знание местности и владение разными языками', en: 'Local knowledge and multilingual skills' },
    'service.guides_feature4': { ru: 'Друг в поездке, экономия и безопасность', en: 'Friend on the trip, savings and safety' },
    'btn.order_guide': { ru: 'Заказать тур-гида', en: 'Order Tour Guide' },
    
    // Optgroup labels для селекторов отелей
    'hotel_segment.luxury': { ru: 'Люкс сегмент', en: 'Luxury Segment' },
    'hotel_segment.premium': { ru: 'Премиум сегмент', en: 'Premium Segment' },
    'hotel_segment.middle': { ru: 'Средний сегмент', en: 'Mid-range Segment' },
    'hotel_segment.budget': { ru: 'Бюджетный сегмент', en: 'Budget Segment' },
    'hotel_segment.local': { ru: 'Местные и региональные', en: 'Local and Regional' },

    // === ФИЛЬТРЫ СТРАНИЦЫ TOURS ===
    'filters.duration': { ru: 'Длительность тура', en: 'Tour duration' },
    'filters.theme': { ru: 'Тематика тура', en: 'Tour theme' },
    'filters.date_period': { ru: 'Дата проведения', en: 'Date range' },
    
    // Варианты длительности
    'duration.single_day': { ru: 'Однодневный', en: 'Single-day' },
    'duration.multi_day': { ru: 'Многодневный (2-5 дней)', en: 'Multi-day (2-5 days)' },
    'duration.long_term': { ru: 'Длительный (6+ дней)', en: 'Extended (6+ days)' },
    
    // Тематики туров
    'theme.overview': { ru: 'Обзорная экскурсия', en: 'Sightseeing tour' },
    'theme.trekking': { ru: 'Походы / треккинг', en: 'Hiking / trekking' },
    'theme.mountain': { ru: 'Горные маршруты', en: 'Mountain tours' },
    'theme.lake': { ru: 'Озёрные маршруты', en: 'Lake tours' },
    'theme.historical': { ru: 'Исторический тур', en: 'Historical tour' },
    'theme.recreational': { ru: 'Рекреационный тур', en: 'Leisure tour' },
    'theme.agro': { ru: 'Агро-туризм', en: 'Agritourism' },
    'theme.health': { ru: 'Санаторно-оздоровительный тур', en: 'Health & wellness tour' },
    'theme.combined': { ru: 'Комбинированный тур по Центральной Азии', en: 'Multi-country Central Asia tour' },
    
    // Кнопки и действия для tours
    'btn.reset_filters': { ru: 'Сбросить все фильтры', en: 'Reset all filters' },
    'tours.results_count': { ru: 'Показано туров:', en: 'Tours shown:' },
    'tours.tour_details': { ru: 'Детали тура', en: 'Tour Details' },
    
    // Поля дат
    'form.date_from': { ru: 'От', en: 'From' },
    'form.date_to': { ru: 'До', en: 'To' },

    // === ОТЕЛИ - ДОПОЛНИТЕЛЬНЫЕ ПЕРЕВОДЫ ===
    'hotel.page_title': { ru: 'Каталог отелей - Bunyod-Tour', en: 'Hotel catalog - Bunyod-Tour' },
    'tour.page_title': { ru: 'Тур - Bunyod-Tour', en: 'Tour - Bunyod-Tour' },
    'hotel.5_stars': { ru: '5 звезд', en: '5 stars' },
    'hotel.4_stars': { ru: '4 звезды', en: '4 stars' },
    'hotel.3_stars': { ru: '3 звезды', en: '3 stars' },
    'hotel.2_stars': { ru: '2 звезды', en: '2 stars' },
    'hotel.1_star': { ru: '1 звезда', en: '1 star' },
    'hotel.loading_error': { ru: 'Ошибка загрузки', en: 'Loading error' },
    'hotel.failed_to_load': { ru: 'Не удалось загрузить список отелей', en: 'Failed to load the hotel list' },
    
    // Дополнительные ключи для отелей
    'hotel.default_name': { ru: 'Отель', en: 'Hotel' },
    'hotel.no_description': { ru: 'Описание недоступно', en: 'Description unavailable' },
    'hotel.no_location': { ru: 'Местоположение не указано', en: 'Location not specified' },
    'hotel.view_details': { ru: 'Подробнее', en: 'View details' },

    // === ФУТЕР ===
    'footer.company': { ru: 'Компания:', en: 'Company:' },
    'footer.social_pages': { ru: 'Социальные страницы:', en: 'Social Pages:' },
    'footer.contact_info': { ru: 'Контакты:', en: 'Contact Info:' },
    
    // Ссылки в разделе компании  
    'footer.tour_agents': { ru: 'Тур-агентам', en: 'For Tour Agents' },
    'footer.partners': { ru: 'Партнеры', en: 'Partners' },
    'footer.investment_projects': { ru: 'Инвестиционные Проекты', en: 'Investment Projects' },
    'footer.how_to_book': { ru: 'Как бронировать туры?', en: 'How to Book a Tour?' },
    'footer.tours_catalog': { ru: 'Каталог туров', en: 'Tour Catalog' },
    
    // Информация о лицензии
    'footer.license_info': { ru: 'Лицензия на туристическую деятельность ФС№ 0000253, от 25.10.2022 г.', en: 'Tourism Activity License FS№ 0000253, dated 25.10.2022' },
    
    // Документы
    'footer.public_offer': { ru: 'Публичная Оферта-Договор', en: 'Public Offer Agreement' },
    'footer.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    'footer.privacy_policy': { ru: 'Политика конфиденциальности', en: 'Privacy Policy' },
    
    // Копирайт
    'footer.copyright': { ru: 'Все права защищены | ООО "Бунёд-Тур" (2017-2025) | ИНН: 010098739; ОГРН: 0110023137', en: 'All rights reserved | LLC "Bunyod-Tour" (2017-2025) | TIN: 010098739; OGRN: 0110023137' },
    
};

// Убираем const aliases - используем прямые ссылки на window.*

// === ФУНКЦИЯ ПОЛУЧЕНИЯ ПЕРЕВОДА ===
function getTranslation(key, lang = window.currentLanguage) {
    if (window.translations[key] && window.translations[key][lang]) {
        return window.translations[key][lang];
    }
    // Возвращаем русский как fallback
    if (window.translations[key] && window.translations[key]['ru']) {
        return window.translations[key]['ru'];
    }
    // Если перевода вообще нет, возвращаем ключ
    return key;
}

// === ГЛАВНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА ===
function switchSiteLanguage(lang) {
    // ВАЛИДАЦИЯ ВХОДНЫХ ДАННЫХ
    if (!lang || typeof lang !== 'string') {
        console.warn('Недопустимый язык, используем русский по умолчанию');
        lang = 'ru';
    }
    
    if (!window.supportedLanguages.includes(lang)) {
        console.warn(`Неподдерживаемый язык "${lang}", используем русский`);
        lang = 'ru';
    }
    
    // БЕЗОПАСНОЕ СОХРАНЕНИЕ В LOCALSTORAGE
    try {
        localStorage.setItem('selectedLanguage', lang);
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
    }
    
    window.currentLanguage = lang;
    
    // ОБНОВЛЯЕМ ВСЕ ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
    updateLanguageSelector(lang);
    translateStaticInterface(lang);
    
    // ОБНОВЛЯЕМ HTML LANG АТРИБУТ
    document.documentElement.lang = lang;
    
    // ЗАКРЫВАЕМ DROPDOWN БЕЗОПАСНО
    const dropdown = document.getElementById('langDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
    
    if (dropdown) dropdown.classList.remove('show');
    if (arrow) arrow.classList.remove('open');
    
}

// === ОБНОВЛЕНИЕ ПЕРЕКЛЮЧАТЕЛЯ ЯЗЫКОВ ===
function updateLanguageSelector(lang) {
    const languages = {
        'ru': { name: 'Русский', flag: '🇷🇺', flagClass: 'flag-ru', code: 'RU' },
        'en': { name: 'English', flag: '🇺🇸', flagClass: 'flag-us', code: 'EN' },
    };
    
    const selectedLang = languages[lang];
    if (!selectedLang) return;
    
    // Обновляем основную кнопку (обычные страницы)
    const selectedFlag = document.querySelector('.selected-flag');
    const selectedLangText = document.querySelector('.selected-lang');
    
    if (selectedFlag) {
        selectedFlag.textContent = selectedLang.flag;
        selectedFlag.className = `selected-flag ${selectedLang.flagClass}`;
    }
    
    if (selectedLangText) {
        selectedLangText.textContent = selectedLang.name;
    }
    
    // Обновляем новый переключатель с ID current-language
    const currentLanguageElement = document.getElementById('current-language');
    if (currentLanguageElement) {
        currentLanguageElement.textContent = selectedLang.name;
    }
    
    // ОБНОВЛЯЕМ ПЕРЕКЛЮЧАТЕЛЬ В АДМИН-ПАНЕЛИ
    const currentLanguageAdmin = document.getElementById('currentLanguageAdmin');
    if (currentLanguageAdmin) {
        currentLanguageAdmin.textContent = selectedLang.code;
    }
    
    // Обновляем активную опцию в dropdown (обычные страницы)
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === lang) {
            option.classList.add('active');
        }
    });
    
    // Обновляем активную опцию в dropdown админ-панели
    document.querySelectorAll('#languageDropdownAdmin .lang-option, #languageDropdownAdmin a[onclick*="switchAdminLanguage"]').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('onclick') && option.getAttribute('onclick').includes(`'${lang}'`)) {
            option.classList.add('active');
        }
    });
}

// === ИНИЦИАЛИЗАЦИЯ ЯЗЫКА ===
function initializeLanguage() {
    let savedLanguage = 'ru'; // Безопасное значение по умолчанию
    
    // БЕЗОПАСНОЕ ЧТЕНИЕ ИЗ LOCALSTORAGE
    try {
        const stored = localStorage.getItem('selectedLanguage');
        
        // Валидируем сохранённое значение
        if (stored && window.supportedLanguages.includes(stored)) {
            savedLanguage = stored;
        } else {
            console.warn(`Недопустимое значение "${stored}", используем русский по умолчанию`);
            // Исправляем в localStorage
            localStorage.setItem('selectedLanguage', 'ru');
        }
    } catch (error) {
        console.error('Ошибка чтения localStorage:', error);
    }
    
    // УСТАНАВЛИВАЕМ ЯЗЫК
    window.currentLanguage = savedLanguage;
    
    // ОБНОВЛЯЕМ HTML LANG АТРИБУТ
    document.documentElement.lang = savedLanguage;
    
    // ПРИМЕНЯЕМ ПЕРЕВОДЫ И ОБНОВЛЯЕМ ИНТЕРФЕЙС
    updateLanguageSelector(savedLanguage);
    translateStaticInterface(savedLanguage);
}

// === ФУНКЦИЯ ПЕРЕВОДА СТАТИЧЕСКОГО ИНТЕРФЕЙСА ===
function translateStaticInterface(lang) {
    let translatedCount = 0;
    
    // ПЕРЕВОДИМ ОСНОВНОЙ ТЕКСТ (data-translate)
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            // Безопасное обновление текста
            if (element.children.length === 0) {
                element.textContent = translation;
            } else {
                updateTextNodes(element, translation);
            }
            translatedCount++;
        } else {
            console.warn(`Перевод не найден для ключа: ${key}`);
        }
    });
    
    // ПЕРЕВОДИМ PLACEHOLDERS (data-translate-placeholder)
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.placeholder = translation;
            translatedCount++;
        } else {
            console.warn(`Placeholder перевод не найден для ключа: ${key}`);
        }
    });
    
    // ПЕРЕВОДИМ ALT АТРИБУТЫ (data-translate-alt)
    document.querySelectorAll('[data-translate-alt]').forEach(element => {
        const key = element.getAttribute('data-translate-alt');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.alt = translation;
            translatedCount++;
        }
    });
    
    // ПЕРЕВОДИМ TITLE АТРИБУТЫ (data-translate-title)
    document.querySelectorAll('[data-translate-title]').forEach(element => {
        const key = element.getAttribute('data-translate-title');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.title = translation;
            translatedCount++;
        }
    });
    
    // ПЕРЕВОДИМ VALUE АТРИБУТЫ (data-translate-value)
    document.querySelectorAll('[data-translate-value]').forEach(element => {
        const key = element.getAttribute('data-translate-value');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.value = translation;
            translatedCount++;
        }
    });
    
    // ПЕРЕВОДИМ LABEL АТРИБУТЫ (data-translate-label) - для optgroup и других элементов
    document.querySelectorAll('[data-translate-label]').forEach(element => {
        const key = element.getAttribute('data-translate-label');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.label = translation;
            translatedCount++;
        }
    });
    
}

// === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ТЕКСТОВЫХ УЗЛОВ ===
function updateTextNodes(element, newText) {
    for (let node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            node.textContent = newText;
            return; // Обновляем только первый найденный текстовый узел
        }
    }
    // Если текстовых узлов не найдено, создаем новый
    if (element.children.length === 0) {
        element.textContent = newText;
    }
}

// === ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ DROPDOWN ЯЗЫКОВ ===
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('langDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
    
    if (dropdown) dropdown.classList.toggle('show');
    if (arrow) arrow.classList.toggle('open');
}

// === БЕЗОПАСНАЯ ФУНКЦИЯ ЭКРАНИРОВАНИЯ HTML ===
function escapeHTML(unsafe) {
    if (typeof unsafe !== 'string') {
        unsafe = String(unsafe || '');
    }
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// === БЕЗОПАСНАЯ ФУНКЦИЯ ЭКРАНИРОВАНИЯ ДЛЯ DATA-АТРИБУТОВ ===
function escapeDataAttribute(unsafe) {
    if (typeof unsafe !== 'string') {
        unsafe = String(unsafe || '');
    }
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// === АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
});

// === ЭКСПОРТ ДЛЯ ГЛОБАЛЬНОГО ИСПОЛЬЗОВАНИЯ ===
window.i18n = {
    supportedLanguages: window.supportedLanguages,
    currentLanguage: () => window.currentLanguage,
    initializeLanguage,
    switchSiteLanguage,
    translateStaticInterface,
    getTranslation,
    toggleLanguageDropdown,
    updateLanguageSelector,
    // Безопасные функции экранирования
    escapeHTML,
    escapeDataAttribute
};

// === ЭКСПОРТ ФУНКЦИЙ ЭКРАНИРОВАНИЯ ===
window.escapeHTML = escapeHTML;
window.escapeDataAttribute = escapeDataAttribute;

// === ГЛОБАЛЬНЫЕ HELPER ФУНКЦИИ ДЛЯ ДИНАМИЧЕСКОГО КОНТЕНТА (БЕЗОПАСНЫЕ) ===
window.getTitleByLanguage = function(titleObject, lang) {
    try {
        const title = typeof titleObject === 'string' ? JSON.parse(titleObject) : titleObject;
        const result = title[lang] || title.ru || title.en || 'Название не указано';
        return escapeHTML(result);
    } catch (e) {
        return escapeHTML(titleObject || 'Название не указано');
    }
};

window.getDescriptionByLanguage = function(descriptionObject, lang) {
    try {
        const description = typeof descriptionObject === 'string' ? JSON.parse(descriptionObject) : descriptionObject;
        const result = description[lang] || description.ru || description.en || 'Описание не указано';
        return escapeHTML(result);
    } catch (e) {
        return escapeHTML(descriptionObject || 'Описание не указано');
    }
};

window.getCategoryNameByLanguage = function(categoryObject, lang) {
    try {
        const category = typeof categoryObject === 'string' ? JSON.parse(categoryObject) : categoryObject;
        const result = category[lang] || category.ru || category.en || 'Категория';
        return escapeHTML(result);
    } catch (e) {
        return escapeHTML(categoryObject || 'Категория');
    }
};

// === НЕБЕЗОПАСНЫЕ ВЕРСИИ ДЛЯ ОСОБЫХ СЛУЧАЕВ (ИСПОЛЬЗОВАТЬ ОСТОРОЖНО) ===
window.getTitleByLanguageRaw = function(titleObject, lang) {
    try {
        const title = typeof titleObject === 'string' ? JSON.parse(titleObject) : titleObject;
        return title[lang] || title.ru || title.en || 'Название не указано';
    } catch (e) {
        return titleObject || 'Название не указано';
    }
};

window.getDescriptionByLanguageRaw = function(descriptionObject, lang) {
    try {
        const description = typeof descriptionObject === 'string' ? JSON.parse(descriptionObject) : descriptionObject;
        return description[lang] || description.ru || description.en || 'Описание не указано';
    } catch (e) {
        return descriptionObject || 'Описание не указано';
    }
};

window.getCategoryNameByLanguageRaw = function(categoryObject, lang) {
    try {
        const category = typeof categoryObject === 'string' ? JSON.parse(categoryObject) : categoryObject;
        return category[lang] || category.ru || category.en || 'Категория';
    } catch (e) {
        return categoryObject || 'Категория';
    }
};


// === ГЛОБАЛЬНАЯ УТИЛИТА ДЛЯ МНОГОЯЗЫЧНЫХ ДАННЫХ ===
window.getMultilingualValue = function(obj, baseKey, fallback = '') {
    if (!obj) return fallback || '';
    const lang = (window.currentLanguage || 'en').toLowerCase();
    const suffix = lang === 'en' ? 'En' : lang === 'ru' ? 'Ru' : 'Tj';
    const tryKeys = [baseKey + suffix, baseKey + 'En', baseKey + 'Ru', baseKey + 'Tj', baseKey, 'name', 'title'];
    for (const k of tryKeys) {
        const v = obj[k];
        if (v) {
            if (typeof v === 'object') {
                return v[lang] || v.en || v.ru || fallback || '';
            }
            return String(v);
        }
    }
    return fallback || '';
};

// === ЭКСПОРТ КЛЮЧЕВЫХ ФУНКЦИЙ ДЛЯ ВНЕШНЕГО ИСПОЛЬЗОВАНИЯ ===
// Функция переключения языка (используется layout-loader.js)
window.switchLanguage = switchSiteLanguage;

// Функция применения переводов (для прямого вызова)
window.applyTranslations = translateStaticInterface;

// Функция инициализации языка
window.initializeLanguage = initializeLanguage;

// Функция обновления селектора языка
window.updateLanguageSelector = updateLanguageSelector;

// Функция получения переводов (ИСПРАВЛЕНИЕ: экспорт getTranslation)
window.getTranslation = getTranslation;

console.log('🌍 i18n система инициализирована с экспортированными функциями');

})(); // Закрываем IIFE