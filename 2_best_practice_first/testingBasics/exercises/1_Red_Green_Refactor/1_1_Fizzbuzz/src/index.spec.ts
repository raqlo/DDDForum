import { describe, expect, it } from "bun:test";

describe("fizzbuzz", () => {
    it("always returns a string", () => {
        const res = fizzbuzz("a");
        expect(typeof res).toBe("string");
    })
});
