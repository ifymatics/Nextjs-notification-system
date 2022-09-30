import { ChannelFactory } from "./ChannelFactory";
import { NotificationData } from "./../interfaces/notification.interface";

describe("ChannelFactory class", () => {
    const channelFactory = new ChannelFactory()
    describe("ChannelFactory.delegateChannel", () => {
        it("should have non-zero argument", async () => {
            const data = { userId: "1", companyId: "1", notification: { content: "" } }

            const onDelegateSystemMock = jest.fn((data) =>
                Promise.resolve()
            );
            await channelFactory.delegateChannel(data)
            await onDelegateSystemMock({ ...data });
            expect(onDelegateSystemMock).toBeCalled();
        });
        it('should return an object containing statusCode 500 when called with empty object or no parameter ', async () => {
            const data = { userId: "1", companyId: "1", notification: { content: "" } }
            const expected = { statusCode: 500 }
            const result = await channelFactory.delegateChannel(data);
            expect(result).toMatchObject(expected)
        })
    })
    describe("getChannelType", () => {
        it("should return list of channels when notification passed through it contains a subject", async () => {
            const data: NotificationData = { userId: "1", companyId: "1", notification: { subject: "happy birthday", content: "" } };
            const result: string[] = await channelFactory.getChannelType(data);
            expect(result.length).toBeGreaterThan(0)
        });
        it("should return empty list  when notification passed through it does NOT contain a  subject", async () => {
            const data: NotificationData = { userId: "1", companyId: "1", notification: { content: "" } };
            const result: string[] = await channelFactory.getChannelType(data);
            expect(result.length).toBeLessThanOrEqual(0)
        })
    })

})