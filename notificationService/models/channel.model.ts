import { mongoose } from "@typegoose/typegoose";
const channel = new mongoose.Schema({
    name: {
        type: String
    }
});
export const Channel = mongoose.model("Channel", channel);