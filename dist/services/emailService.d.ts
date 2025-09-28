import { Customer } from '@prisma/client';
export declare const emailService: {
    sendBookingConfirmation(order: any, customer: Customer, tour: any): Promise<boolean>;
    sendCancellationEmail(order: any, customer: Customer): Promise<boolean>;
    sendPaymentConfirmation(order: any, customer: Customer): Promise<boolean>;
    sendAdminNotification(order: any, customer: Customer, tour: any): Promise<boolean>;
    testEmailConfiguration(): Promise<boolean>;
};
export default emailService;
//# sourceMappingURL=emailService.d.ts.map