import { ChannelUnsubscription } from "../../models/channelUnsubscription.model";
import { UserNotification } from "../../models/userNotification.model";
import { BaseChannel } from "../BaseChannel/BaseChannel";
import { NotificationData } from "../interfaces/notification.interface";
import { findUserOrCompany } from "../utils/findUserOrCompany";
import { isUnsubscribed } from "../utils/isUnSubscribed";

export class UIChannel extends BaseChannel {
    //notificationData: NotificationData;
    constructor(private notificationData: NotificationData) {
        super()
        Object.setPrototypeOf(this, UIChannel.prototype)
    }
    public async send(notificationData: NotificationData): Promise<any> {
        this.notificationData = notificationData;
        //const { userId, companyId } = data;

        const user = await findUserOrCompany({ userId: this.notificationData?.userId, companyId: this.notificationData?.companyId });
        if (!user) return { message: "User or company not found!", channel: 'UIChannel', statusCode: 404 }
        //const { userId, companyId } = user;

        const unsubscribed = await this.isUnsubscribed({ userId: this.notificationData.userId, companyId: this.notificationData.companyId }, /*'UIChannel'*/);

        if (unsubscribed) return { message: "User or company has unsubscribed to UIChannel", channel: 'UIChannel', statusCode: 400 };

        const { companyId, notification, userId } = this.notificationData;
        const { content } = notification;
        try {
            await UserNotification.create({ companyId, notification: { content }, userId })
        } catch (error) {

            return { message: "Notification could not be sent,try later", channel: 'UIChannel', statusCode: 500 }
        }


        return { message: "Notification Sent successfully", channel: 'EmailChannel', statusCode: 200 }
    }


    protected async isUnsubscribed({ userId, companyId }: { userId: string; companyId: string; }): Promise<boolean> {
        try {
            const unsubscribed = await ChannelUnsubscription.findOne({ $or: [{ userId }, { companyId }], channelName: this.constructor.name, unsubscribed: true })
            if (!unsubscribed) {
                return false
            }
        } catch (error) {
            return false;
        }


        return true
    }


}