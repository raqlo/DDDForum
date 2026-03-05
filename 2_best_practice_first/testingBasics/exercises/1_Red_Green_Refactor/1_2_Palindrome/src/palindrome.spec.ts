import {describe, it, expect} from 'bun:test'
import {palindromeChecker} from "./index";

const truePalindromeCases = [
    'mom',
    'Mom',
    '1Never Odd or Even1'
]

describe('PalindromeChecker', () => {
    it.each(truePalindromeCases)("should return true if input is %p", (input) => {
        const res = palindromeChecker(input);
        expect(res).toBeTrue();
    })

    it("should return false if input is 'Never Odd or Even1'", () => {
        const res = palindromeChecker('Never Odd or Even1');
        expect(res).toBeFalse()
    })

});