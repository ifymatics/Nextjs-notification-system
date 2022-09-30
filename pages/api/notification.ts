import type { NextApiRequest, NextApiResponse } from 'next';
import { channelSystems } from './../../notificationService/notificationSystem';
import { ChannelFactory } from '../../notificationService/notificationSystem/channelFactory/ChannelFactory'
import { ResponseData } from "./../../notificationService/notificationSystem/interfaces/responseData.interface"
import DbConnection from "./../../notificationService/Db/DB";

type Data = {
    name: string
}
const channelFactory = new ChannelFactory();
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | string | Data[] | any>
) {
    const connected = await DbConnection();
    if (!connected) return res.status(500).json({ message: "Not connected to any database", statusCode: 500 })
    switch (req.method) {
        case 'POST':
            const { userId, companyId, notification } = req.body;

            const data: ResponseData = await channelFactory.delegateChannel({ userId, companyId, notification })

            res.status(data.statusCode).json(data)
            break;
        case 'GET':

            return res.status(200).json([])
        default:
            break;
    }

}