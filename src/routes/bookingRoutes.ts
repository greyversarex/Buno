import express from 'express';
import { bookingController } from '../controllers/bookingController';
import { orderLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Booking routes - 3-step booking system с защитой от спама
router.post('/start', orderLimiter, bookingController.startBooking);              // Step 1: Start booking
router.put('/:id/step1', bookingController.updateBookingStep1);     // Step 1: Hotel/room selection
router.post('/:id/calculate-price', bookingController.calculatePrice);  // Calculate price in real-time
router.put('/:id/details', bookingController.updateBookingDetails); // Step 2: Tourist details
router.post('/:id/create-order', bookingController.createOrderFromBooking); // Step 3: Create Order
router.put('/:id/pay', bookingController.processPayment);           // Step 3: Payment
router.get('/:id', bookingController.getBooking);                   // Get booking details

// Helper routes
router.get('/tour/:tourId/hotels', bookingController.getTourHotels);

export default router;