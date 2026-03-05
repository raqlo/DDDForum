import {describe, it, expect} from 'bun:test'
import {palindromeChecker} from "./index";

describe('PalindromeChecker', () => {
    it("should return true if input is mom", () => {
        const res = palindromeChecker('mom');
        expect(res).toBeTrue()
    })
    it("should return false if input is 'Never Odd or Even1'", () => {
        const res = palindromeChecker('Never Odd or Even1');
        expect(res).toBeFalse()
    })
});