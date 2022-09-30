import { mongoose } from "@typegoose/typegoose";
export default async () => {
    let connectedDb: any = null;
    try {
        connectedDb = await mongoose.connect('');
        // return connectedDb

    } catch (error) {
        console.log("===>ERROR OCCURED WHILE CONNECTING TO DB");
        return false
    }
    return connectedDb
}