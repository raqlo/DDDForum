import {describe, it, expect} from 'bun:test';
import {statsCalculator, type StatsCalculatorResponse} from "./src/statsCalculator";


describe('Stats Calculator', () => {
    describe('for sequence [2, 4, 21, -8, 53, 40]', () => {
        const sequence = [2, 4, 21, -8, 53, 40];
        const results: [keyof StatsCalculatorResponse, number][] = [
            ['maximum', 53],
            ['minimum', -8]
        ]

        it.each(results)("should know the %s value is %p", (type, expected) => {
            const res = statsCalculator(sequence)
            expect(res[type]).toBe(expected);
        })

    })
    describe('for sequence [100, 2, -3, -16, 1, 60, 81, 2, -3]', () => {
        const sequence = [100, 2, -3, -16, 1, 60, 81, 2, -3];
        const results: [keyof StatsCalculatorResponse, number][] = [
            ['maximum', 100],
            ['minimum', -16]
        ]

        it.each(results)("should know the %s value is %p", (type, expected) => {
            const res = statsCalculator(sequence)
            expect(res[type]).toBe(expected);
        })
    })
    describe('for sequence [5, 5, 5]', () => {
        const sequence = [5, 5, 5];
        const results: [keyof StatsCalculatorResponse, number][] = [
            ['maximum', 5],
            ['minimum', 5]
        ]

        it.each(results)("should know the %s value is %p", (type, expected) => {
            const res = statsCalculator(sequence)
            expect(res[type]).toBe(expected);
        })
    })

});