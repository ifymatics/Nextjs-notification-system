import { BaseChannel } from "../BaseChannel/BaseChannel";
import { NotificationData } from "../interfaces/notification.interface";
import { ChannelUnsubscription } from "../../models/channelUnsubscription.model";
import { findUserOrCompany } from "./../utils/findUserOrCompany"
import { isUnsubscribed } from "../utils/isUnSubscribed";
import { data } from "../../mock-data/company";

export type User = {
    userId: string,
    companyId: string,
    companyName: string,
    userFullName: string
}
export class EmailChannel extends BaseChannel {
    constructor(private notificationData: NotificationData) {
        super();
        Object.setPrototypeOf(this, EmailChannel.prototype);


    }
    public async send(data: NotificationData): Promise<any> {
        this.notificationData = data;


        const user = await findUserOrCompany({ userId: data?.userId, companyId: data?.companyId });
        if (!user) return { message: "User or company not found!", channel: 'EmailChannel', statusCode: 404 }


        const unsubscribed = await this.isUnsubscribed({ userId: data.userId, companyId: data.companyId }, /*'EmailChannel'*/);

        if (unsubscribed) return { message: "User or company has unsubscribed", channel: 'EmailChannel', statusCode: 400 };

        console.log(this.emailTemplate(user, data));


        return { message: "Notification Sent successfully", channel: 'EmailChannel', statusCode: 200 }
    }


    public emailTemplate(user: User, notificationData: NotificationData): string {
        return `${notificationData.notification?.subject} ${notificationData.notification?.subject?.toLowerCase()?.includes('happy birthday') ? user.userFullName : ''} 
        \n${notificationData.notification?.content}`
    }

    public async isUnsubscribed({ userId, companyId }: { userId: string, companyId: string }): Promise<boolean> {
        const unsubscribed = await ChannelUnsubscription.findOne({ $or: [{ userId }, { companyId }], channelName: this.constructor.name, unsubscribed: true })
        if (!unsubscribed) return false


        return true
    }
    public async findUserOrCompany({ userId, companyId }: { userId: string, companyId: string } = {} as { userId: string, companyId: string }): Promise<User | undefined> {
        if (!userId || !companyId) return undefined
        const user = data.find((user: any) => user.userId === userId.toString() && user.companyId === companyId.toString());
        if (user) {

            return user
        }

    }

}