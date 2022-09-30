
import { User } from "../EmailChannel/EmailChannel";
import { data } from "../../mock-data/company";
import { findUserOrCompany } from "./findUserOrCompany"

describe("findUserOrCompany", () => {
    it("should return a single user object when called with an list that contains that  user object", async () => {

        // const func = jest.fn();
        const expected = {
            userId: "1",
            companyId: "2",
            companyName: "BrioHR",
            userFullName: "Nabil Oudghiri",
        }
        const userData = { userId: "1", companyId: '2' };
        const result = await findUserOrCompany(userData);

        expect(result).toEqual(expected)
    })
    it("should return undefined  when called with a wrong userId", async () => {
        const userData = { userId: "2", companyId: '2' };
        const result = await findUserOrCompany(userData);
        const expected = undefined;
        expect(result).toEqual(expected)
    })
    it("should return undefined  when called with a wrong companyId", async () => {
        const expected = undefined;
        const userData = { userId: "2", companyId: '3' }
        const result = await findUserOrCompany(userData);

        expect(result).toEqual(expected)
    })
    it("should return undefined  when called with no argument", async () => {

        const result = await findUserOrCompany();
        const expected = undefined;
        expect(result).toEqual(expected)
    })
})