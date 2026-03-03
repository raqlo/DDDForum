import { describe, expect, it } from "bun:test";
import {fizzbuzz} from "./fizzbuzz";

describe("fizzbuzz", () => {
    it("always returns a string", () => {
        const res = fizzbuzz(2);
        expect(typeof res).toBe("string");
    });
    it("outputs 'fizz' if the input number is 3", () => {
        const res = fizzbuzz(3)
        expect(res).toBe("fizz");
    })
    it("outputs 'buzz' if the input number is 5", () => {
        const res = fizzbuzz(5)
        expect(res).toBe("buzz");
    })
});
