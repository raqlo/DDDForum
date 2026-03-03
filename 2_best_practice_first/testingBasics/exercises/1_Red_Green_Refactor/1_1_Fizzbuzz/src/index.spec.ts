import { describe, expect, it } from "bun:test";
import {fizzbuzz} from "./fizzbuzz";

describe("fizzbuzz", () => {
    it("always returns a string", () => {
        const res = fizzbuzz("string");
        expect(typeof res).toBe("string");
    })
});
