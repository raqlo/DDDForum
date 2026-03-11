import {describe, it, expect} from "bun:test"
import {booleanCalculator} from "./booleanCalculator";

const trueCases = [
    'TRUE',
    'NOT FALSE',
    'TRUE OR FALSE',
    "TRUE OR TRUE",
    "TRUE AND TRUE"
]

const falseCases = [
    'FALSE',
    'NOT TRUE',
    "FALSE OR FALSE",
    'TRUE AND FALSE',
    'FALSE AND FALSE',
]

describe('booleanCalculator', () => {
    it.each(trueCases)("should return true if input is %p", (input) => {
        const res = booleanCalculator(input);
        expect(res).toBeTrue();
    })

    it.each(falseCases)("should return false if input is %p", (input) => {
        const res = booleanCalculator(input);
        expect(res).toBeFalse();
    })
})