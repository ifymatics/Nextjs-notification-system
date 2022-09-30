import { NotificationData } from "../interfaces/notification.interface";

export abstract class BaseChannel {

    constructor() {
        Object.setPrototypeOf(this, BaseChannel.prototype);
    }
    public abstract send(notification: any): Promise<any>

    protected abstract isUnsubscribed(data: { userId: string, companyId: string }): Promise<boolean>;

}