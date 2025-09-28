export declare const sendAdminNotification: (bookingData: {
    fullName: string;
    email: string;
    preferredDate: string;
    numberOfPeople: number;
    tourTitle: string;
}) => Promise<{
    success: boolean;
    reason: string;
} | {
    success: boolean;
    reason?: undefined;
}>;
export declare const sendCustomerConfirmation: (bookingData: {
    fullName: string;
    email: string;
    preferredDate: string;
    numberOfPeople: number;
    tourTitle: string;
}) => Promise<{
    success: boolean;
    reason: string;
} | {
    success: boolean;
    reason?: undefined;
}>;
declare const _default: {
    sendAdminNotification: (bookingData: {
        fullName: string;
        email: string;
        preferredDate: string;
        numberOfPeople: number;
        tourTitle: string;
    }) => Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
    sendCustomerConfirmation: (bookingData: {
        fullName: string;
        email: string;
        preferredDate: string;
        numberOfPeople: number;
        tourTitle: string;
    }) => Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
};
export default _default;
//# sourceMappingURL=email.d.ts.map