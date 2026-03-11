import {describe, it, expect} from "bun:test"
import {booleanCalculator} from "./booleanCalculator";

describe('booleanCalculator', () => {
    it('should result true if input is TRUE', () => {
        const input = 'TRUE';
        const res = booleanCalculator(input);
        expect(res).toBeTrue();
    });
    it('should return false if input is FALSE', () => {
        const input = 'FALSE';
        const res = booleanCalculator(input);
        expect(res).toBeFalse();
    });
    it("should return true if input is 'NOT FALSE'", () => {
        const input = 'NOT FALSE';
        const res = booleanCalculator(input);
        expect(res).toBeTrue();
    })
})