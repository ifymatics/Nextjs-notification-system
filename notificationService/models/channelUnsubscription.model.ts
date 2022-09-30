import { mongoose } from "@typegoose/typegoose";

const channelUnsubscription = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    companyId: {
        type: String,

    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        require: true
    },
    channelName: {
        type: String,
        require: true
    },
    unsubscribed: {
        type: Boolean,
        default: false
    }
});

export const ChannelUnsubscription = mongoose.model('ChannelSubscription', channelUnsubscription) 