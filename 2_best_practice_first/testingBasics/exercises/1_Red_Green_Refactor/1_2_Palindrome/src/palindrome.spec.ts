import {describe, it, expect} from 'bun:test'
import {palindromeChecker} from "./index";

const truePalindromeCases = [
    'mom',
    'Mom',
    '1Never Odd or Even1',
    'Was It A Rat I Saw',
    'Never Odd or Even',
    'xMomx'
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

    it("should return false if input is 'Momx'", () => {
        const res = palindromeChecker('Momx');
    })

    it("should throw an error if input is empty", () => {
        const res = () => palindromeChecker('');
        expect(res).toThrow(Error);
    })

    it('should throw an error if input is not a string', () => {
        // @ts-ignore @ts-expect-error handle input validation
        const res = () => palindromeChecker(2);
        console.log(res)
        expect(res).toThrow(/Invalid input/);
    })
});