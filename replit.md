# Bunyod-Tour Backend API

## Overview
Bunyod-Tour is a comprehensive tourism booking platform for Central Asia, offering tour, hotel, and guide booking, secure payments, and administrative management. It aims to provide a seamless user experience and efficient tools for administrators, supporting multilingual content and diverse payment methods. The project targets significant market potential by modernizing and streamlining regional tourism services.

## User Preferences
Preferred communication style: Simple, everyday language.
Development approach: Improve existing files rather than creating new ones. User prefers enhancement of existing admin-dashboard.html over creation of separate admin panels.
Frontend structure alignment: Admin panel must perfectly match the frontend homepage structure with exact block names and tour organization as shown in provided screenshots.
System integration preference: User requires simplified and unified pricing systems with single source of truth. Eliminated complex manual categorization in favor of automatic detection.

## System Architecture

### Backend
The backend uses **Express.js and TypeScript** with a **modular architecture** following an **MVC pattern**. It supports full CRUD operations, multilingual content (Russian, English), and robust authentication.

### Database
**PostgreSQL with Prisma ORM** is used for data management. The schema includes **Tours**, **Categories**, **TourBlocks**, **TourGuideProfile**, **GuideReview**, **DriverProfile**, **Countries**, and **Cities**. The system includes automatic database initialization, schema application, and seeding of essential data. It also features a smart category migration system to update from legacy categories to a standardized 15-category structure.

### Key Features
-   **Full CRUD Operations**: Implemented for all major entities (tours, hotels, guides, categories, tour-blocks, drivers, countries, cities).
-   **Multilingual Support**: JSON-based content for Russian and English, with robust JSON parsing and data persistence. Default language is Russian.
-   **Authentication**: Admin, Tour Guide, and Driver login systems are operational with JWT authentication.
-   **Component-based Tour Pricing**: Dynamic pricing with inline editing and a unified system with automatic category detection.
-   **Booking & Order System**: Seamless flow from draft bookings to payment-ready orders.
-   **Payment Integration**: Multiple payment gateways integrated.
-   **Tour Guide Management System**: Comprehensive profiles, review system, extended tour model with guide assignments, and guide dashboard.
-   **Driver Management System**: Profiles, vehicle categories, license management, multi-language support, pricing, working areas, file uploads, and integration with tour assignment.
-   **Country and City Management System**: Models for Central Asian countries and cities with multilingual support and admin panel integration.
-   **Admin Panel Transportation Modules**: Fully implemented "Drivers", "Trips", and "Transfers" sections with CRUD functionality.
-   **Currency System**: Supports TJS, USD, EUR, RUB, CNY with real-time conversion.
-   **API Design**: RESTful endpoints with standardized responses.
-   **Middleware**: CORS, Express JSON processing, centralized error handling, and request logging.
-   **Type System**: Strong typing enforced via TypeScript and Prisma-generated types.
-   **Email Notification System**: Nodemailer for automated confirmations.
-   **Deployment**: Configured for Replit with PostgreSQL, unified server (port 5000), CORS for Replit proxy, and autoscale production environment.
-   **Slide Editing System**: Robust slide editing functionality with secure file uploads, validation, and multilingual support.
-   **Enhanced Multilingual System**: Extended i18n.js with translation keys, multilingual helper functions, and dynamic content updates on language switch.
-   **Unified Language System**: Single entry point `updatePageLanguage()` for all language switching, integrating both static (data-translate) and dynamic (data-multilingual-*) content. MutationObserver automatically translates new DOM elements, eliminating manual translation calls.

### UI/UX
-   **Admin Dashboard**: Comprehensive management for tours, orders, hotels, guides, and reviews.
-   **Booking Flow**: A 3-step process for date/hotel selection, tourist information, and payment.
-   **Universal Tour Template System**: Dynamic display of tour info using JSON and URL parameters.
-   **Responsive Design**: Mobile-first approach.
-   **Universal Tab System**: Consistent two-tab structure ("Tour Description" and "Tour Program") for tour pages.
-   **Navigation System**: Comprehensive dropdown navigation with nested sub-menus.
-   **Toggle Filter System**: Modern filter for tours by country, city, type, and category.
-   **Category System**: 15 specific tourism categories, including a frontend-aligned tour block system with 6 blocks (e.g., Popular Tours, Recommended Tours).
-   **Banner-Style Tour Types**: Elegant banner presentation for "Виды туров".
-   **Static Price Type System**: Database-driven "per person" or "per group" pricing, controlled via admin panel.
-   **Design**: Consistent color palette (HEX codes), Inter font family, and component structures across the platform. Platform-wide button color unification to a gray theme.

## External Dependencies

### Core Framework Dependencies
-   **Express.js**: Web application framework.
-   **Prisma Client**: Database ORM.
-   **CORS**: Cross-origin resource sharing.
-   **Nodemailer**: Email sending.

### Payment Gateways
-   **AlifPay API v2**
-   **Stripe API**
-   **Payme API**
-   **Click API**
-   **PayPal API**

### Development Tools
-   **TypeScript**: Static type checking.

### Database
-   **PostgreSQL**: Relational database.