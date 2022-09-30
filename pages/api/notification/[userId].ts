// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'
import DbConnection from "../../../notificationService/Db/DB";
import { UserNotification } from "../../../notificationService/models/userNotification.model"
type Data = {
    name: string
}
const persons = [{ id: 1, name: "John Doe" }]
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | string | Data[] | any>
) {

    switch (req.method) {

        case 'GET':
            const connected = await DbConnection();
            if (!connected) return res.status(500).json({ message: "Not connected to any database", statusCode: 500 })

            try {
                const userNotifications = await UserNotification.find({ userId: req.query.userId });
                return res.status(200).json(userNotifications)
            } catch (error) {
                return res.status(500).json({ message: "server error!", statusCode: 5000 })
            }

        default:
            break;
    }

}
