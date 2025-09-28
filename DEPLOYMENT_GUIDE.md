# ТЕХНИЧЕСКАЯ ДОКУМЕНТАЦИЯ - BUNYOD-TOUR 
# Полное руководство по развертыванию на Linux-сервере (Timeweb)

## РАЗДЕЛ 1: ВЫСОКОУРОВНЕВЫЙ ОБЗОР АРХИТЕКТУРЫ

### 1.1. Полный технологический стек

**БЭКЕНД:**
- **Основной фреймворк:** Express.js 5.1.0 
- **Язык:** TypeScript (компилируется в JavaScript)
- **Среда выполнения:** Node.js 20+
- **База данных:** PostgreSQL 16 с ORM Prisma 6.15.0
- **Аутентификация:** JWT токены + bcrypt для хеширования паролей
- **Email:** Nodemailer 7.0.6
- **Загрузка файлов:** Multer 2.0.2
- **Платежи:** Stripe 18.5.0, AlifPay, Payler
- **HTTP-клиент:** Axios 1.11.0, node-fetch 3.3.2

**ФРОНТЕНД:**
- **Основа:** Статические HTML/CSS/JavaScript файлы
- **CSS Framework:** Tailwind CSS (подключается через CDN)
- **Иконки:** Font Awesome 6.0+
- **Компоненты:** Vanilla JavaScript (без фреймворков)
- **Админ-панель:** Монолитный HTML файл с встроенным JavaScript

### 1.2. Архитектура приложения

**ТИП АРХИТЕКТУРЫ:** Монолитное веб-приложение с тесной интеграцией фронтенда и бэкенда.

**ВЗАИМОДЕЙСТВИЕ:**
- Единый сервер Express.js обслуживает и API эндпоинты (/api/*), и статические HTML файлы
- Фронтенд отправляет AJAX запросы на тот же домен к API эндпоинтам
- Авторизация через JWT токены, хранящиеся в localStorage браузера
- Нет разделения на отдельные приложения - всё работает как единое целое

### 1.3. Комментарий по структуре

**ОСНОВНЫЕ КОМПОНЕНТЫ:**
- **Актуальные:** `src/` (TypeScript бэкенд), `frontend/` (HTML/CSS/JS), `prisma/` (схема БД)
- **Лишние/устаревшие:** `server/` (пустая папка), некоторые файлы в `attached_assets/`

**ДУБЛИРУЮЩИЙСЯ КОД:** Отсутствует. Проект имеет единую структуру без дублирования функционала.

---

## РАЗДЕЛ 2: ДЕТАЛИЗАЦИЯ БЭКЕНДА

### 2.1. Основной фреймворк и версия
**Express.js 5.1.0** с TypeScript

### 2.2. Точка входа
**ГЛАВНЫЙ ФАЙЛ:** `index.js` (корневая папка)
- Запускает Express сервер на порту 5000 (или PORT из переменных окружения)
- Подключает TypeScript бэкенд через ts-node/register
- Настраивает статическую раздачу файлов из папки frontend/

### 2.3. Роутинг (Маршрутизация)
**API МАРШРУТЫ:** `src/routes/index.ts` - главный роутер, подключающий:
- `/api/tours` - управление турами
- `/api/admin` - административные функции
- `/api/hotels` - управление отелями
- `/api/guides` - управление гидами
- `/api/drivers` - управление водителями
- `/api/orders` - управление заказами
- `/api/payments` - обработка платежей
- `/api/transfer-requests` - заявки на трансфер
- и другие...

**СТАТИЧЕСКИЕ СТРАНИЦЫ:** Обслуживаются Express.static из папки `frontend/`

### 2.4. Зависимости
**package.json:**
```json
{
  "dependencies": {
    "@prisma/client": "^6.15.0",
    "express": "^5.1.0",
    "typescript": "^5.9.2",
    "ts-node": "^10.9.2",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "multer": "^2.0.2",
    "nodemailer": "^7.0.6",
    "stripe": "^18.5.0",
    "axios": "^1.11.0",
    "prisma": "^6.15.0"
  }
}
```

### 2.5. Механизм аутентификации

**ТИП:** JWT токены + bcrypt хеширование паролей

**КОМПОНЕНТЫ:**
- **Контроллер:** `src/controllers/adminController.ts`
- **Middleware:** `src/middleware/auth.ts`, `adminAuthMiddleware`
- **Библиотеки:** jsonwebtoken 9.0.2, bcrypt 6.0.0

**ПРОЦЕСС ВХОДА:**
1. Пользователь отправляет username/password на `/api/admin/login`
2. Система ищет админа в БД по username
3. Проверяет пароль через `bcrypt.compare()`
4. При успехе создает JWT токен с payload: `{adminId, username, role}`
5. Токен отправляется клиенту и сохраняется в localStorage
6. Все защищенные запросы требуют заголовок: `Authorization: Bearer TOKEN`

**СЕКРЕТНЫЙ КЛЮЧ:** `process.env.JWT_SECRET || 'fallback_secret_key'`

---

## РАЗДЕЛ 3: ДЕТАЛИЗАЦИЯ ФРОНТЕНДА

### 3.1. Тип фронтенда
**СТАТИЧЕСКИЕ HTML/CSS/JS файлы** без использования современных фреймворков (React/Vue/Angular)

**СТРУКТУРА:**
- HTML файлы с встроенным JavaScript
- Tailwind CSS через CDN
- Font Awesome иконки через CDN
- Vanilla JavaScript для интерактивности

### 3.2. Процесс сборки
**НЕ ТРЕБУЕТСЯ** - фронтенд состоит из готовых статических файлов

**ФАЙЛЫ ГОТОВЫ К ИСПОЛЬЗОВАНИЮ:**
- Нет этапа компиляции
- Нет процесса сборки (build)
- Файлы обслуживаются напрямую через Express.static

### 3.3. Взаимодействие с бэкендом

**МЕТОД:** AJAX запросы через fetch() API

**ЖЕСТКО ПРОПИСАННЫЕ URL:** Отсутствуют - все запросы идут на относительные пути:
- `/api/admin/login`
- `/api/tours`
- `/api/hotels`
- etc.

**ФАЙЛЫ С API ВЫЗОВАМИ:**
- `frontend/admin-dashboard.html` (строки с fetch() запросами)
- `frontend/booking.html`
- `frontend/tour-template.html`

**ДЛЯ ЗАМЕНЫ ДОМЕНА:** Поиск по паттерну `fetch\('\/api\/` в HTML файлах

---

## РАЗДЕЛ 4: БАЗА ДАННЫХ

### 4.1. Тип СУБД
**PostgreSQL 16** (указано в .replit файле)

### 4.2. Конфигурация подключения

**ФАЙЛ КОНФИГУРАЦИИ:** `src/config/database.ts`
**СХЕМА PRISMA:** `prisma/schema.prisma`

**СТРОКА ПОДКЛЮЧЕНИЯ:**
```typescript
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**ПЕРЕМЕННАЯ ОКРУЖЕНИЯ:** `DATABASE_URL` (обязательная)

### 4.3. ORM/Библиотека
**Prisma ORM 6.15.0**

**КЛИЕНТ:** Автогенерируемый из схемы в `@prisma/client`
**ГЛОБАЛЬНЫЙ ЭКЗЕМПЛЯР:** `src/config/database.ts`

### 4.4. Миграции

**КОМАНДЫ:**
- `npx prisma migrate deploy` - применение миграций в продакшене
- `npx prisma db push` - синхронизация схемы в разработке
- `npx prisma generate` - генерация клиента

**ФАЙЛЫ МИГРАЦИЙ:** `prisma/migrations/` (если используются)

---

## РАЗДЕЛ 5: ОКРУЖЕНИЕ И КОНФИГУРАЦИЯ

### 5.1. Переменные окружения (ПОЛНЫЙ СПИСОК)

**ОБЯЗАТЕЛЬНЫЕ:**
- `DATABASE_URL` - строка подключения к PostgreSQL
- `JWT_SECRET` - секретный ключ для подписи JWT токенов

**ОПЦИОНАЛЬНЫЕ:**
- `PORT` - порт сервера (по умолчанию 5000)
- `NODE_ENV` - окружение (development/production)
- `CORS_ORIGINS` - разрешенные домены для CORS

**EMAIL НАСТРОЙКИ:**
- `SMTP_HOST` - SMTP сервер (по умолчанию smtp.gmail.com)
- `SMTP_PORT` - порт SMTP (по умолчанию 587)
- `SMTP_USER` - имя пользователя SMTP
- `SMTP_PASS` - пароль SMTP
- `EMAIL_USER` - отправитель писем
- `EMAIL_PASSWORD` - пароль для email
- `ADMIN_EMAIL` - email администратора
- `PUBLIC_URL` - базовый URL сайта

**ПЛАТЕЖНЫЕ СИСТЕМЫ:**
- `STRIPE_SECRET_KEY` - секретный ключ Stripe
- `STRIPE_WEBHOOK_SECRET` - секрет для вебхуков Stripe
- `ALIF_MERCHANT_KEY` - ключ мерчанта AlifPay
- `ALIF_MERCHANT_PASSWORD` - пароль мерчанта AlifPay
- `ALIF_API_URL` - URL API AlifPay
- `PAYLER_KEY` - ключ PaylerPay
- `BASE_URL` - базовый URL для callback'ов

**ДОПОЛНИТЕЛЬНЫЕ:**
- `OPENAI_API_KEY` - ключ OpenAI для переводов
- `FRONTEND_URL` - URL фронтенда
- `REPLIT_DEV_DOMAIN` - домен Replit для разработки

### 5.2. Конфигурационные файлы Replit

**.replit:**
```toml
modules = ["web", "nodejs-20", "php-8.2", "postgresql-16"]
run = "npm run start"

[deployment]
deploymentTarget = "autoscale"
run = ["node", "index.js"]
```

**ОБЪЯСНЕНИЕ [run]:**
- `npm run start` - команда для разработки (запускает `node index.js`)
- `["node", "index.js"]` - команда для продакшена на Replit

**replit.nix:** НЕ НАЙДЕН (отсутствует в проекте)

### 5.3. Статические и медиафайлы

**СТАТИЧЕСКИЕ ФАЙЛЫ:** 
- Папка `frontend/` - HTML, CSS, JS, изображения
- Обслуживается через `express.static()`

**ЗАГРУЖАЕМЫЕ ФАЙЛЫ:**
- Папка `uploads/` - загруженные пользователями файлы
- Папка `attached_assets/` - дополнительные ресурсы
- Маршрут `/attached_assets` для публичного доступа

**КОНФИГУРАЦИЯ В index.js:**
```javascript
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/attached_assets', express.static(path.join(__dirname, 'attached_assets')));
```

---

## РАЗДЕЛ 6: ИНСТРУКЦИИ ПО РАЗВЕРТЫВАНИЮ

### 6.1. Установка зависимостей

**СИСТЕМНЫЕ ТРЕБОВАНИЯ:**
```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установить PostgreSQL 16
sudo apt install postgresql postgresql-contrib

# Установить PM2 для управления процессами
sudo npm install -g pm2

# Установить Prisma CLI глобально (опционально)
sudo npm install -g prisma
```

**ЗАВИСИМОСТИ ПРОЕКТА:**
```bash
# В папке проекта
npm install

# Генерация Prisma клиента
npx prisma generate
```

### 6.2. Сборка проекта
**НЕ ТРЕБУЕТСЯ** - TypeScript компилируется налету через ts-node

### 6.3. Миграция БД
```bash
# Создать базу данных в PostgreSQL
sudo -u postgres createdb bunyod_tour

# Применить схему (синхронизация)
npx prisma db push

# ИЛИ применить миграции (если есть)
npx prisma migrate deploy

# Создать начального администратора (если нужно)
npx prisma db seed
```

### 6.4. Запуск сервера

**PRODUCTION КОМАНДА:**
```bash
# С PM2 (рекомендуемый способ)
pm2 start index.js --name "bunyod-tour" --env production

# Сохранить конфигурацию PM2
pm2 save
pm2 startup

# Альтернативно - прямой запуск
NODE_ENV=production node index.js
```

**ВАЖНО:** Проект НЕ требует отдельного WSGI сервера, так как это Node.js приложение.

**НАСТРОЙКА NGINX (прокси):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## РАЗДЕЛ 7: СТРУКТУРА ПРОЕКТА

### 7.1. Дерево файлов

```
bunyod-tour/
├── index.js                    # Главная точка входа
├── package.json               # Зависимости Node.js
├── .replit                   # Конфигурация Replit
├── start.sh                  # Скрипт запуска
├── prisma/
│   ├── schema.prisma         # Схема базы данных
│   └── database.db          # SQLite файл (не используется)
├── src/                     # TypeScript бэкенд
│   ├── config/
│   │   ├── database.ts      # Конфигурация Prisma
│   │   └── email.ts         # Конфигурация email
│   ├── controllers/         # Контроллеры API
│   │   ├── adminController.ts
│   │   ├── tourController.ts
│   │   ├── hotelController.ts
│   │   └── ...
│   ├── routes/              # Маршруты API
│   │   ├── index.ts         # Главный роутер
│   │   ├── adminRoutes.ts
│   │   └── ...
│   ├── middleware/          # Промежуточное ПО
│   │   ├── auth.ts          # JWT аутентификация
│   │   └── errorHandler.ts
│   └── types/               # TypeScript типы
├── frontend/                # Статический фронтенд
│   ├── index.html           # Главная страница
│   ├── admin-dashboard.html # Админ-панель (12,506 строк)
│   ├── booking.html         # Форма бронирования
│   ├── transfer.html        # Страница трансферов
│   ├── hotels-catalog.html  # Каталог отелей
│   └── ...
├── attached_assets/         # Статические ресурсы
└── uploads/                 # Загруженные файлы
```

### 7.2. Описание ключевых файлов/папок

**СЕРВЕРНАЯ ЧАСТЬ:**
- `index.js` - Запуск Express сервера, настройка middleware, статические файлы
- `src/` - TypeScript бэкенд с MVC архитектурой
- `src/controllers/` - Бизнес-логика для обработки API запросов
- `src/routes/` - Определение маршрутов API
- `prisma/schema.prisma` - Схема базы данных с 30+ таблицами

**КЛИЕНТСКАЯ ЧАСТЬ:**
- `frontend/` - Статические HTML страницы с встроенным JavaScript
- `frontend/admin-dashboard.html` - Монолитная админ-панель (основной файл управления)
- `frontend/index.html` - Главная страница сайта

**КОНФИГУРАЦИЯ:**
- `.replit` - Настройки для развертывания и модулей
- `package.json` - Зависимости и скрипты Node.js
- `start.sh` - Скрипт запуска для продакшена

---

## ВАЖНЫЕ ЗАМЕЧАНИЯ ДЛЯ ПЕРЕНОСА НА TIMEWEB

### Проблема с авторизацией
**ПРИЧИНА:** Изменение домена требует обновления JWT секретного ключа и возможно пересоздания администратора.

**РЕШЕНИЕ:**
1. Установить переменную окружения `JWT_SECRET` с вашим секретным ключом
2. Проверить/создать администратора в базе данных
3. Убедиться что пароль правильно захеширован через bcrypt

### Обязательные переменные окружения для Timeweb
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/bunyod_tour"
JWT_SECRET="your-secret-key-min-32-chars"
NODE_ENV="production"
PORT="5000"
PUBLIC_URL="https://yourdomain.com"
```

### Создание администратора
```javascript
// Выполнить в консоли Node.js или создать скрипт
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash('123', 10);
// Вставить в базу с хешированным паролем
```

**ВАЖНО:** Пароль "123" должен быть захеширован с помощью bcrypt перед сохранением в базу данных.