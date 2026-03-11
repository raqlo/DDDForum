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
    it("should return false if input is 'NOT TRUE'", () => {
        const input = 'NOT TRUE';
        const res = booleanCalculator(input);
        expect(res).toBeFalse();
    })
    it("should return true if input is TRUE OR FALSE", () => {
        const input = 'TRUE OR FALSE';
        const res = booleanCalculator(input);
        expect(res).toBeTrue();
    })
    it('should return false if input is TRUE AND FALSE', () => {
        const input = 'TRUE AND FALSE';
        const res = booleanCalculator(input);
        expect(res).toBeFalse();
    });
    it('should return false if input is FALSE AND FALSE', () => {
        const input = 'FALSE AND FALSE';
        const res = booleanCalculator(input);
        expect(res).toBeFalse();
    });
})