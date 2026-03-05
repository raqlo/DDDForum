import {describe, it, expect} from 'bun:test'
import {palindromeChecker} from "./index";

describe('PalindromeChecker', () => {
it("should return true if input is mom", () => {
 const res = palindromeChecker('mom');
 expect(res).toBeTrue()
})
});