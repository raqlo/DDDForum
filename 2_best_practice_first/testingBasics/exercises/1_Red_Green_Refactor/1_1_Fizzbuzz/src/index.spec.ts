import { describe, expect, it } from "bun:test";
import {fizzbuzz} from "./fizzbuzz";

describe("fizzbuzz", () => {
    it("should always return a string", () => {
        const res = fizzbuzz(2);
        expect(typeof res).toBe("string");
    });
    it("should output 'fizz' if the input number is 3", () => {
        const res = fizzbuzz(3)
        expect(res).toBe("fizz");
    })
    it("should output 'buzz' if the input number is 5", () => {
        const res = fizzbuzz(5)
        expect(res).toBe("buzz");
    })
    it('should output "FizzBuzz" if the input number is 15', () => {
        const res = fizzbuzz(15)
        expect(res).toBe("FizzBuzz");
    });
    it("should output 'fizz' if the input number is 9", () => {
        const res = fizzbuzz(9)
        expect(res).toBe("fizz");
    })
    it("should return '43' if the input number is 43", () => {
        const res = fizzbuzz(43)
        expect(res).toBe("43");
    })
    it("should return 'Fizz' if the input number is 42", () => {
        const res = fizzbuzz(42)
        expect(res).toBe("fizz");
    })
    it("should return 'FizzBuzz' if the input number is 45", () => {
        const res = fizzbuzz(45)
        expect(res).toBe("FizzBuzz");
    })
    it('should show an error message if input is 102', () => {
        const res = fizzbuzz(102)
        expect(res).toContain("error")
    });
    it("should throw an error if input is -12", () => {
        const res = fizzbuzz(-12)
        expect(res).toContain("error")
    })
    it("should throw an error if input is '15'", () => {
        const res = fizzbuzz("15")
        expect(res).toContain("error")
    })
});
