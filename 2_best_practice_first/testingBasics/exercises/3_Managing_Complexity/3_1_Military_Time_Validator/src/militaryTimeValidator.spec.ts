import {describe, it, expect } from "bun:test"
import {militaryTimeValidator} from "./militaryTimeValidator";

describe('Military Time Validator', () => {
    it("should know that 01:12 - 14:32 is a valid time range", () => {
        const range = "01:12 - 14:32";
        const res = militaryTimeValidator(range);
        expect(res).toBeTrue();
    })

    it("should know that 25:00 - 12:23 is not a valid time range", () => {
        const range = "25:00 - 12:23";
        const res = militaryTimeValidator(range);
        expect(res).toBeFalse();
    })

    it("should know that 12:23 - 12:23 is not a valid time range", () => {
        const range = "12:23 - 12:23";
        const res = militaryTimeValidator(range);
        expect(res).toBeFalse();
    })
    it("should know that 22:00 - 01:12 is not a valid time range", () => {
        const range = "22:00 - 01:12";
        const res = militaryTimeValidator(range);
        expect(res).toBeFalse();
    })
});