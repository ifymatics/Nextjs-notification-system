
import { User } from "../EmailChannel/EmailChannel";
import { data } from "./../../mock-data/company"

export async function findUserOrCompany({ userId, companyId }: { userId: string, companyId: string } = {} as { userId: string, companyId: string }): Promise<User | undefined> {
    if (!userId || !companyId) return undefined as any
    const user = data.find((user: any) => user.userId === userId.toString() && user.companyId === companyId.toString());
    if (user) {

        return user
    }
    return undefined as any
}