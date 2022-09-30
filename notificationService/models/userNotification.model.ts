import { mongoose } from "@typegoose/typegoose";

const userNotificationnModel = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    channelId: {
        type: String,
        require: true
    },
    notification: {
        type: {
            subject: String,
            content: { type: String, require: true }
        }
    },
    isViewed: {
        type: Boolean,
        default: false
    }
});

export const UserNotification = mongoose.model("UserNotification", userNotificationnModel)