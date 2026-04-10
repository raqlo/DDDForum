import { describe, expect, it } from "bun:test";
import {fizzbuzz} from "./fizzbuzz";

const fizzTestCases = [
    3, 9, 6
];
const buzzTestCases = [
    5, 10, 20
]
const fizzBuzzTestCases = [
    15, 30, 45
]

describe("fizzbuzz", () => {
    it("should always return a string", () => {
        const res = fizzbuzz(2);
        expect(typeof res).toBe("string");
    });

    describe("should return 'fizz' if the input number is divisible by 3", () => {
        it.each(fizzTestCases)("should output 'fizz' if the input number is %p", (num) => {
            const res = fizzbuzz(num);
            expect(res).toBe('fizz');
        });
    })

    describe("should return 'buzz' if the input number is divisible by 5", () => {
        it.each(buzzTestCases)("should output 'buzz' if the input number is %p", (num) => {
            const res = fizzbuzz(num);
            expect(res).toBe('buzz');
        });
    })

    describe("should return 'FizzBuzz' if the input number is divisible by 15", () => {
        it.each(fizzBuzzTestCases)("should output 'FizzBuzz' if the input number is %p", (num) => {
            const res = fizzbuzz(num);
            expect(res).toBe('FizzBuzz');
        });
    })

    it("should return '43' if the input number is 43", () => {
        const res = fizzbuzz(43)
        expect(res).toBe("43");
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
