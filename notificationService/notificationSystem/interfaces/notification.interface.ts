
interface Notification {
    subject?: string;
    content: string;
    type?: string
}
export interface NotificationData {

    userId: string;
    companyId: string;
    notification: Notification;
}