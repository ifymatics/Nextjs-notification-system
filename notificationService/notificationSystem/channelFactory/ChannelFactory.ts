
import { channelSystems } from "./../"
import { NotificationData } from "../interfaces/notification.interface";
import { ResponseData } from "../interfaces/responseData.interface";
//import {EmailChannel} from "./EmailChannel"


const NOTIFICATION_TYPES_LIST = [
    { 'monthly-payslip': ['EmailChannel'] },
    { 'leave-balance-reminder': ['UIChannel'] },
    { 'happy-birthday': ['EmailChannel', 'UIChannel'] },
    { 'emergency-meeting': ['WhatsappChannel'] }
]




export class ChannelFactory {
    public notificationData: NotificationData = {} as NotificationData;

    constructor() {
    }

    public async delegateChannel(data: NotificationData): Promise<ResponseData> {
        this.notificationData = data;
        //1.Email notification has subject and content 2. UI has content only


        if (!channelSystems.length) return { message: "Something went wrong", statusCode: 500 }
        const channels: string[] = await this.getChannelType(this.notificationData);
        if (!channels.length) return { message: "The channel for this notification not found!", statusCode: 500 }

        // 1.Delegating channelSystem manually:-

        // return new EmailChannel(this.notification).send() OR


        //2.delegating channelSystems dynamically:-
        const channelsObj = {} as any;

        channelSystems.map((system) => channelsObj[system.name.toLowerCase()] = system);
        let result = [];
        const channelsArray = channels.map((channel: any) => {
            if (channel?.toLowerCase() in channelsObj)
                return new channelsObj[channel.toLowerCase()](this.notificationData).send(this.notificationData)
        });

        result = await Promise.all(channelsArray)


        if (result.length) return result[0]
        return { message: "Something went wrong", statusCode: 500 }

    }
    async getChannelType(notificationData: NotificationData) {
        if (!Object.keys(notificationData).length) return []
        const subject = notificationData?.notification?.subject;
        const type = notificationData?.notification?.type;

        const ch = NOTIFICATION_TYPES_LIST.reduce((prev: any, curr: any) => {


            if (type && type in curr) return curr[type];
            if (subject && subject.toLowerCase().split(' ').join('-') in curr) {

                return curr[subject.toLowerCase().split(' ').join('-')]
            }
            return prev

        }, [])

        return ch;
    }

}
