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
});
