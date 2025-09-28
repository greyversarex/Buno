export interface MultilingualContent {
    en: string;
    ru: string;
    tj?: string;
}
export interface CategoryData {
    id: number;
    name: MultilingualContent;
}
export interface CreateCategoryData {
    name?: MultilingualContent;
    title?: MultilingualContent;
}
export interface TourData {
    id: number;
    title: MultilingualContent;
    description: MultilingualContent;
    duration: string;
    price: string;
    priceType?: string;
    categoryId: number;
    category?: CategoryData;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateTourData {
    title: MultilingualContent;
    description: MultilingualContent;
    shortDescription?: MultilingualContent;
    duration: string;
    price: string;
    priceType?: string;
    originalPrice?: string;
    categoryId: number;
    tourBlockId?: number;
    countryId?: number;
    cityId?: number;
    country?: string;
    city?: string;
    durationDays?: number;
    format?: string;
    tourType?: string;
    difficulty?: string;
    maxPeople?: number;
    minPeople?: number;
    mainImage?: string;
    images?: string;
    highlights?: string;
    itinerary?: string;
    included?: string;
    excluded?: string;
    isFeatured?: boolean;
    pickupInfo?: string;
    startTimeOptions?: string;
    languages?: string;
    availableMonths?: string;
    availableDays?: string;
    startDate?: string;
    endDate?: string;
    rating?: number;
    reviewsCount?: number;
    includes?: string;
    theme?: string;
    requirements?: string;
    tags?: string;
    location?: string;
    services?: string;
    assignedGuideId?: number | null;
    pricingComponents?: string;
    pricingData?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface BookingRequestData {
    id: number;
    customerName: string;
    customerEmail: string;
    preferredDate: string;
    numberOfPeople: number;
    tourId: number;
    tour?: TourData;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateBookingRequestData {
    customerName: string;
    customerEmail: string;
    preferredDate: string;
    numberOfPeople: number;
    tourId: number;
}
export interface ReviewData {
    id: number;
    customerId?: number;
    reviewerName: string;
    rating: number;
    text: string;
    photos?: string;
    isModerated: boolean;
    isApproved: boolean;
    tourId: number;
    customer?: {
        id: number;
        fullName: string;
        email: string;
        phone?: string;
    };
    tour?: TourData;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateReviewData {
    customerId?: number;
    reviewerName: string;
    rating: number;
    text: string;
    tourId: number;
    photos?: string[];
}
export interface UpdateReviewData {
    isModerated?: boolean;
    isApproved?: boolean;
}
export interface ApiError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
//# sourceMappingURL=index.d.ts.map