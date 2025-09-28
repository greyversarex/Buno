export interface TouristData {
    fullName: string;
    dateOfBirth: string;
}
export interface BookingFormData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    tourDate: string;
    tourists: TouristData[];
    wishes?: string;
    selectedHotelId?: number;
    selectedGuideId?: number;
    termsAccepted: boolean;
    paymentRulesAccepted: boolean;
}
export interface OrderData {
    orderNumber: string;
    customerId: number;
    tourId: number;
    hotelId?: number;
    guideId?: number;
    tourDate: string;
    tourists: TouristData[];
    wishes?: string;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed';
    paymentStatus: 'unpaid' | 'paid' | 'refunded';
    paymentMethod?: 'payme' | 'click' | 'stripe' | 'paypal';
    receiptData?: any;
}
export interface PaymentData {
    orderId: number;
    amount: number;
    currency: string;
    method: 'payme' | 'click' | 'stripe' | 'paypal';
    returnUrl?: string;
    cancelUrl?: string;
}
export interface ReviewData {
    customerId?: number;
    tourId: number;
    reviewerName: string;
    rating: number;
    text: string;
    photos?: string[];
}
export interface CreateReviewData {
    customerId?: number;
    tourId: number;
    reviewerName: string;
    rating: number;
    text: string;
    photos?: string[];
}
export interface HotelData {
    name: string;
    description?: string;
    images?: string[];
    address?: string;
    rating?: number;
    amenities?: string[];
}
export interface GuideData {
    name: string;
    description?: string;
    photo?: string;
    languages: string[];
    contact?: {
        phone?: string;
        email?: string;
        whatsapp?: string;
    };
    experience?: number;
    rating?: number;
}
//# sourceMappingURL=booking.d.ts.map