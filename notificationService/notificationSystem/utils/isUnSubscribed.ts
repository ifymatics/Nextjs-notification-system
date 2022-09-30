import { ChannelUnsubscription } from "../../models/channelUnsubscription.model"

export const isUnsubscribed = async ({ userId, companyId }: { userId: string, companyId: string }, channelName: string): Promise<boolean> => {
    const unsubscribed = await ChannelUnsubscription.findOne({ $or: [{ userId }, { companyId }], channelName: channelName, unsubscribed: true })
    if (unsubscribed) {
        return true
    }


    return false
}
