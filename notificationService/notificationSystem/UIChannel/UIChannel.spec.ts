
import { MongoMemoryServer } from "mongodb-memory-server";
import { NotificationData } from "../interfaces/notification.interface";
import { UIChannel } from "./UIChannel";
import { mongoose } from "@typegoose/typegoose";
import { ChannelUnsubscription } from "./../../models/channelUnsubscription.model";
let mongo: any;
let notification: NotificationData;
let uiChannel: any;
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
    notification = {
        "userId": '6',
        "companyId": '3',
        "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" }
    }

    uiChannel = new UIChannel(notification)

});
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({})
    };
})
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


describe("UIChannel Class", () => {

    describe("emailSystem.isUnsubscribed", () => {


        //const { userId, companyId } = notification;
        it("should return undefined if the user has not unsubscribed to the UIChannel", async () => {


            await expect(uiChannel.isUnsubscribed({ userId: "6", companyId: "3" }, 'UIChannel')).resolves.toBeFalsy();
        });
        it("should return truthy if the user has unsubscribed to the  UIChannel", async () => {

            const unsub = await ChannelUnsubscription.create({ userId: "6", companyId: "3", channelName: "UIChannel", unsubscribed: true });
            await expect(uiChannel.isUnsubscribed({ userId: unsub.userId, companyId: unsub.companyId }, unsub.channelName)).resolves.toBeTruthy();
        })

    })
    describe("uiChannel.send", () => {
        it('should  throw an error when with wrong notification', async () => {

            const notification = {

                "companyId": '3',
                "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" }
            }

            const result = await uiChannel.send(notification);
            const expected = { statusCode: 404 };
            expect(result).toMatchObject(expected);
        });
        it('should return an object with  a statusCode of 200 if the notification is logged successfully', async () => {

            const notification = {
                userId: "6",
                "companyId": '3',
                "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" }
            }

            const result = await uiChannel.send(notification);
            const expected = { statusCode: 200 };
            expect(result).toMatchObject(expected);
        });

        it('should return an object with  a statusCode of 400 if user has unsunscribed to the channel', async () => {
            const notification = {
                "userId": '6',
                "companyId": '3',
                "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" }
            }

            const unsub = await ChannelUnsubscription.create({ userId: "6", companyId: "3", channelName: "UIChannel", unsubscribed: true });
            await uiChannel.isUnsubscribed({ userId: "6", companyId: "3" }, 'UIChannel')
            const result = await uiChannel.send(notification);
            const expected = { statusCode: 400 };
            expect(result).toMatchObject(expected);
        });
        it('should return an object with  a statusCode of 404 if user not found', async () => {
            const result = await uiChannel.send({ userId: '30', companyId: "15" });
            const expected = { statusCode: 404 };
            expect(result).toMatchObject(expected);
        })

    })

})