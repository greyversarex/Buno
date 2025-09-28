"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const client_1 = require("@prisma/client");
const emailService_1 = require("../services/emailService");
const prisma = new client_1.PrismaClient();
async function getBasicAccommodationPrice() {
    try {
        const accommodationComponent = await prisma.priceCalculatorComponent.findUnique({
            where: {
                key: 'accommodation_basic',
                isActive: true
            }
        });
        if (accommodationComponent) {
            return accommodationComponent.price;
        }
        return 25.0;
    }
    catch (error) {
        console.error('Error getting basic accommodation price:', error);
        return 25.0;
    }
}
exports.bookingController = {
    async startBooking(req, res) {
        try {
            const { tourId, hotelId, tourDate, numberOfTourists } = req.body;
            console.log('📋 startBooking получил данные:', { tourId, hotelId, tourDate, numberOfTourists });
            console.log('📋 Типы данных:', {
                tourIdType: typeof tourId,
                tourDateType: typeof tourDate,
                numberOfTouristsType: typeof numberOfTourists
            });
            if (!tourId || !tourDate || !numberOfTourists) {
                console.log('❌ Валидация не прошла:', { tourId, tourDate, numberOfTourists });
                return res.status(400).json({
                    success: false,
                    message: 'Tour ID, tour date, and number of tourists are required'
                });
            }
            const tour = await prisma.tour.findUnique({
                where: { id: parseInt(tourId.toString()) },
                include: {
                    category: true,
                    tourHotels: {
                        include: {
                            hotel: true
                        }
                    }
                }
            });
            if (!tour) {
                return res.status(404).json({
                    success: false,
                    message: 'Tour not found'
                });
            }
            let hotel = null;
            if (hotelId) {
                hotel = await prisma.hotel.findUnique({
                    where: { id: parseInt(hotelId.toString()) }
                });
                if (!hotel) {
                    return res.status(404).json({
                        success: false,
                        message: 'Hotel not found'
                    });
                }
            }
            const { roomSelection, mealSelection } = req.body;
            let totalPrice = 0;
            const tourPrice = parseFloat(tour.price);
            const tourPriceType = tour.priceType;
            if (tourPriceType === 'за человека') {
                totalPrice += tourPrice * parseInt(numberOfTourists.toString());
            }
            else {
                totalPrice += tourPrice;
            }
            if (roomSelection && hotel) {
                const tourDuration = parseInt(tour.duration.replace(/\D/g, '')) || 1;
                const basicAccommodationPrice = await getBasicAccommodationPrice();
                if (tourPriceType === 'за человека') {
                    const numberOfTouristsNum = parseInt(numberOfTourists.toString());
                    const accommodationRoomsNeeded = Math.ceil(numberOfTouristsNum / 2);
                    totalPrice -= basicAccommodationPrice * accommodationRoomsNeeded * tourDuration;
                }
                else {
                    const numberOfTouristsNum = parseInt(numberOfTourists.toString());
                    const accommodationRoomsNeeded = Math.ceil(numberOfTouristsNum / 2);
                    totalPrice -= basicAccommodationPrice * accommodationRoomsNeeded * tourDuration;
                }
                for (const [roomType, roomData] of Object.entries(roomSelection)) {
                    const room = roomData;
                    if (room.quantity > 0) {
                        totalPrice += room.price * room.quantity * tourDuration;
                    }
                }
            }
            if (mealSelection && hotel) {
                const tourDuration = parseInt(tour.duration.replace(/\D/g, '')) || 1;
                for (const [mealType, mealData] of Object.entries(mealSelection)) {
                    const meal = mealData;
                    if (meal.selected) {
                        totalPrice += meal.price * parseInt(numberOfTourists.toString()) * tourDuration;
                    }
                }
            }
            const booking = await prisma.booking.create({
                data: {
                    tourId: parseInt(tourId.toString()),
                    hotelId: hotelId ? parseInt(hotelId.toString()) : null,
                    tourDate,
                    numberOfTourists: parseInt(numberOfTourists.toString()),
                    tourists: JSON.stringify([]),
                    contactName: null,
                    contactPhone: null,
                    contactEmail: null,
                    roomSelection: roomSelection ? JSON.stringify(roomSelection) : null,
                    mealSelection: mealSelection ? JSON.stringify(mealSelection) : null,
                    totalPrice,
                    status: 'draft'
                }
            });
            return res.status(201).json({
                success: true,
                data: {
                    bookingId: booking.id,
                    tour: {
                        ...tour,
                        title: JSON.parse(tour.title),
                        description: JSON.parse(tour.description)
                    },
                    hotel: hotel ? {
                        ...hotel,
                        name: JSON.parse(hotel.name),
                        description: hotel.description ? JSON.parse(hotel.description) : null
                    } : null
                },
                message: 'Booking draft created successfully'
            });
        }
        catch (error) {
            console.error('Error creating booking draft:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create booking draft',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    async updateBookingDetails(req, res) {
        try {
            const { id } = req.params;
            const { contactName, contactPhone, contactEmail, tourists, specialRequests, roomSelection, mealSelection } = req.body;
            if (!contactName || !contactPhone || !contactEmail || !tourists || tourists.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Contact details and at least one tourist are required'
                });
            }
            const existingBooking = await prisma.booking.findUnique({
                where: { id: parseInt(id) },
                include: {
                    tour: true,
                    hotel: true
                }
            });
            if (!existingBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            let totalPrice = 0;
            const tourPrice = parseFloat(existingBooking.tour.price);
            const tourPriceType = existingBooking.tour.priceType;
            if (tourPriceType === 'за человека') {
                totalPrice += tourPrice * existingBooking.numberOfTourists;
            }
            else {
                totalPrice += tourPrice;
            }
            if (roomSelection && existingBooking.hotel) {
                const tourDuration = parseInt(existingBooking.tour.duration.replace(/\D/g, '')) || 1;
                const basicAccommodationPrice = await getBasicAccommodationPrice();
                if (tourPriceType === 'за человека') {
                    const accommodationRoomsNeeded = Math.ceil(existingBooking.numberOfTourists / 2);
                    totalPrice -= basicAccommodationPrice * accommodationRoomsNeeded * tourDuration;
                }
                else {
                    const accommodationRoomsNeeded = Math.ceil(existingBooking.numberOfTourists / 2);
                    totalPrice -= basicAccommodationPrice * accommodationRoomsNeeded * tourDuration;
                }
                for (const [roomType, roomData] of Object.entries(roomSelection)) {
                    const room = roomData;
                    if (room.quantity > 0) {
                        totalPrice += room.price * room.quantity * tourDuration;
                    }
                }
            }
            if (mealSelection && existingBooking.hotel) {
                const tourDuration = parseInt(existingBooking.tour.duration.replace(/\D/g, '')) || 1;
                for (const [mealType, mealData] of Object.entries(mealSelection)) {
                    const meal = mealData;
                    if (meal.selected) {
                        totalPrice += meal.price * existingBooking.numberOfTourists * tourDuration;
                    }
                }
            }
            const updatedBooking = await prisma.booking.update({
                where: { id: parseInt(id) },
                data: {
                    contactName,
                    contactPhone,
                    contactEmail,
                    tourists: JSON.stringify(tourists),
                    specialRequests,
                    roomSelection: roomSelection ? JSON.stringify(roomSelection) : null,
                    mealSelection: mealSelection ? JSON.stringify(mealSelection) : null,
                    totalPrice,
                    status: 'pending'
                }
            });
            return res.json({
                success: true,
                data: updatedBooking,
                message: 'Booking details updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating booking details:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update booking details',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    async createOrderFromBooking(req, res) {
        try {
            const { id } = req.params;
            const booking = await prisma.booking.findUnique({
                where: { id: parseInt(id) },
                include: {
                    tour: {
                        include: {
                            category: true
                        }
                    },
                    hotel: true
                }
            });
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            if (!booking.contactEmail || !booking.contactName) {
                return res.status(400).json({
                    success: false,
                    message: 'Contact information is required'
                });
            }
            let customer = await prisma.customer.findUnique({
                where: { email: booking.contactEmail }
            });
            if (!customer) {
                customer = await prisma.customer.create({
                    data: {
                        fullName: booking.contactName,
                        email: booking.contactEmail,
                        phone: booking.contactPhone || ''
                    }
                });
            }
            const generateOrderNumber = () => {
                const timestamp = Date.now().toString();
                const random = Math.random().toString(36).substring(2, 8).toUpperCase();
                return `BT-${timestamp.slice(-6)}${random}`;
            };
            const orderNumber = generateOrderNumber();
            const order = await prisma.order.create({
                data: {
                    orderNumber,
                    customerId: customer.id,
                    tourId: booking.tourId,
                    hotelId: booking.hotelId,
                    guideId: null,
                    tourDate: booking.tourDate,
                    tourists: booking.tourists,
                    wishes: booking.specialRequests || '',
                    totalAmount: booking.totalPrice,
                    status: 'pending',
                    paymentStatus: 'unpaid'
                },
                include: {
                    customer: true,
                    tour: {
                        include: {
                            category: true
                        }
                    },
                    hotel: true
                }
            });
            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    status: 'order_created'
                }
            });
            return res.json({
                success: true,
                data: {
                    order: order,
                    orderNumber: order.orderNumber,
                    totalAmount: order.totalAmount
                },
                message: 'Order created successfully from booking'
            });
        }
        catch (error) {
            console.error('Error creating order from booking:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create order from booking',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    async processPayment(req, res) {
        try {
            const { id } = req.params;
            const { paymentMethod, totalAmount } = req.body;
            console.log('💳 Processing payment for booking ID:', id);
            console.log('💰 Payment data:', { paymentMethod, totalAmount });
            const booking = await prisma.booking.findUnique({
                where: { id: parseInt(id) },
                include: {
                    tour: true,
                    hotel: true
                }
            });
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            const isSuccess = Math.random() > 0.1;
            if (isSuccess) {
                const updatedBooking = await prisma.booking.update({
                    where: { id: parseInt(id) },
                    data: {
                        status: 'paid',
                        paymentMethod,
                        totalPrice: totalAmount || booking.totalPrice
                    }
                });
                try {
                    if (booking.contactEmail && booking.tour) {
                        const customerData = {
                            id: 0,
                            fullName: booking.contactName || 'Клиент',
                            email: booking.contactEmail,
                            phone: booking.contactPhone || null,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        };
                        const orderData = {
                            ...updatedBooking,
                            orderNumber: `BT-${updatedBooking.id}`,
                            totalAmount: updatedBooking.totalPrice,
                            tourists: updatedBooking.tourists || '[]'
                        };
                        await emailService_1.emailService.sendBookingConfirmation(orderData, customerData, booking.tour);
                        console.log('✅ Booking confirmation email sent successfully');
                    }
                }
                catch (emailError) {
                    console.error('⚠️ Failed to send email notifications:', emailError);
                }
                return res.json({
                    success: true,
                    data: updatedBooking,
                    message: 'Payment processed successfully and confirmation emails sent'
                });
            }
            else {
                await prisma.booking.update({
                    where: { id: parseInt(id) },
                    data: {
                        status: 'error'
                    }
                });
                return res.status(400).json({
                    success: false,
                    message: 'Payment failed. Please try again.'
                });
            }
        }
        catch (error) {
            console.error('Error processing payment:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to process payment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    async getBooking(req, res) {
        try {
            const { id } = req.params;
            const booking = await prisma.booking.findUnique({
                where: { id: parseInt(id) },
                include: {
                    tour: {
                        include: {
                            category: true
                        }
                    },
                    hotel: true
                }
            });
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            const formattedBooking = {
                ...booking,
                tourists: booking.tourists ? JSON.parse(booking.tourists) : [],
                roomSelection: booking.roomSelection ? JSON.parse(booking.roomSelection) : null,
                mealSelection: booking.mealSelection ? JSON.parse(booking.mealSelection) : null,
                tour: {
                    ...booking.tour,
                    title: JSON.parse(booking.tour.title),
                    description: JSON.parse(booking.tour.description),
                    category: {
                        ...booking.tour.category,
                        name: JSON.parse(booking.tour.category.name)
                    }
                },
                hotel: booking.hotel ? {
                    ...booking.hotel,
                    name: JSON.parse(booking.hotel.name),
                    description: booking.hotel.description ? JSON.parse(booking.hotel.description) : null,
                    amenities: booking.hotel.amenities ? JSON.parse(booking.hotel.amenities) : [],
                    roomTypes: booking.hotel.roomTypes,
                    mealTypes: booking.hotel.mealTypes
                } : null
            };
            return res.json({
                success: true,
                data: formattedBooking
            });
        }
        catch (error) {
            console.error('Error fetching booking:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch booking',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    async updateBookingStep1(req, res) {
        try {
            const { id } = req.params;
            const { hotelId, roomSelection, mealSelection, totalPrice, status = 'draft' } = req.body;
            console.log('📝 Updating booking step 1:', { id, hotelId, roomSelection, mealSelection, totalPrice });
            const existingBooking = await prisma.booking.findUnique({
                where: { id: parseInt(id) }
            });
            if (!existingBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            const updatedBooking = await prisma.booking.update({
                where: { id: parseInt(id) },
                data: {
                    hotelId: hotelId ? parseInt(hotelId) : null,
                    roomSelection: roomSelection ? JSON.stringify(roomSelection) : null,
                    mealSelection: mealSelection ? JSON.stringify(mealSelection) : null,
                    totalPrice: totalPrice ? parseFloat(totalPrice) : existingBooking.totalPrice,
                    status,
                    updatedAt: new Date()
                },
                include: {
                    tour: true,
                    hotel: true
                }
            });
            console.log('✅ Booking updated successfully:', updatedBooking.id);
            return res.json({
                success: true,
                data: updatedBooking
            });
        }
        catch (error) {
            console.error('Error updating booking step 1:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update booking',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    async getTourHotels(req, res) {
        try {
            const { tourId } = req.params;
            const tourHotels = await prisma.tourHotel.findMany({
                where: { tourId: parseInt(tourId) },
                include: {
                    hotel: true
                }
            });
            const hotels = tourHotels.map((th) => ({
                ...th.hotel,
                name: JSON.parse(th.hotel.name),
                description: th.hotel.description ? JSON.parse(th.hotel.description) : null,
                amenities: th.hotel.amenities ? JSON.parse(th.hotel.amenities) : [],
                images: th.hotel.images ? JSON.parse(th.hotel.images) : []
            }));
            return res.json({
                success: true,
                data: hotels
            });
        }
        catch (error) {
            console.error('Error fetching tour hotels:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch tour hotels',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};
//# sourceMappingURL=bookingController.js.map