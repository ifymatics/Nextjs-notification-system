import { NotificationData } from "../interfaces/notification.interface";
import { EmailChannel } from "./EmailChannel";
import { mongoose } from "@typegoose/typegoose";
import { ChannelUnsubscription } from "./../../models/channelUnsubscription.model";
import { MongoMemoryServer } from "mongodb-memory-server";
let mongo: any;
let emailSystem: any;
let notification: NotificationData;
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
    notification = {
        "userId": '6',
        "companyId": '3',
        "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" }
    }
    emailSystem = new EmailChannel(notification);

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


describe("EmailChannel class", () => {


    describe("emailTemplate", () => {
        it("should return a string containing user's name  when it is used for birthday notification", async () => {

            const user = { userId: "3", companyId: '6', userFullName: 'Nabil Oudghiri', companyName: "BrioHR" }


            const result = await emailSystem.emailTemplate(user, notification);
            const expected = 'Nabil Oudghiri';
            expect(result).toContain(expected)
        });
        it("should return a string without user's name  when it is not used for birthday notification", async () => {

            const user = { userId: "3", companyId: '6', userFullName: '', companyName: "BrioHR" }

            const notification = {
                "userId": '1',
                "companyId": '6',
                "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" }
            }
            const result = emailSystem.emailTemplate(user, notification);
            const expected = '';
            expect(result).toContain(expected)
        });
    });
    describe("emailSystem.isUnsubscribed", () => {


        it("should return undefined if the user has not unsubscribed to the EmailChannel", async () => {


            await expect(emailSystem.isUnsubscribed({ userId: "6", companyId: "3" }, 'EmailChannel')).resolves.toBeFalsy();
        });
        it("should return truthy if the user has unsubscribed to the  EmailChannel", async () => {

            const unsub = await ChannelUnsubscription.create({ userId: "6", companyId: "3", channelName: "EmailChannel", unsubscribed: true });
            await expect(emailSystem.isUnsubscribed({ userId: unsub.userId, companyId: unsub.companyId }, unsub.channelName)).resolves.toBeTruthy();
        })

    })
    describe("emailSystem.send", () => {
        it('should return an object with  a statusCode of 200 if the notification is logged successfully', async () => {

            const notification = {
                "userId": '6',
                "companyId": '3',
                "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" }
            }
            const result = await emailSystem.send(notification);
            const expected = { statusCode: 200 };
            expect(result).toMatchObject(expected);
        });
        it('should return an object with  a statusCode of 400 if user has unsunscribed to the channel', async () => {
            const notification = {
                "userId": '6',
                "companyId": '3',
                "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" }
            }

            const unsub = await ChannelUnsubscription.create({ userId: "6", companyId: "3", channelName: "EmailChannel", unsubscribed: true });
            await emailSystem.isUnsubscribed({ userId: "6", companyId: "3" }, 'EmailChannel')
            const result = await emailSystem.send(notification);
            const expected = { statusCode: 400 };
            expect(result).toMatchObject(expected);
        });
        it('should return an object with  a statusCode of 404 if user not found', async () => {
            const result = await emailSystem.send({ userId: '30', companyId: "15" });
            const expected = { statusCode: 404 };
            expect(result).toMatchObject(expected);
        })

    })

})
