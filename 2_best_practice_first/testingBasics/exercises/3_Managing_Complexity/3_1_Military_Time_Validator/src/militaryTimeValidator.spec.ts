import {describe, it, expect } from "bun:test"
import {militaryTimeValidator} from "./militaryTimeValidator";

describe('Military Time Validator', () => {
    it("should know that 01:12 - 14:32 is a valid time range", () => {
        const range = "01:12 - 14:32";
        const res = militaryTimeValidator(range);
        expect(res).toBeTrue();
    })
});