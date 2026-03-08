import {describe, it, expect} from 'bun:test';
import {statsCalculator} from "./src/statsCalculator";


describe('Stats Calculator', () => {
    describe('for sequence [2, 4, 21, -8, 53, 40]', () => {
        const sequence = [2, 4, 21, -8, 53, 40];
        it('should know the minimum value is -8', () => {
            const res = statsCalculator(sequence)
            expect(res.minimum).toBe(-8);
        });
        it('should know the maximum value is 53', () => {
            const res = statsCalculator(sequence)
            expect(res.maximum).toBe(53);
        });
    })
    describe('for sequence [100, 2, -3, -16, 1, 60, 81, 2, -3]', () => {
        const sequence = [100, 2, -3, -16, 1, 60, 81, 2, -3];
        it('should know the minimum value is -16', () => {
            const res = statsCalculator(sequence)
            expect(res.minimum).toBe(-16);
        });
        it('should know the maximum value is 100', () => {
            const res = statsCalculator(sequence)
            expect(res.maximum).toBe(100);
        });
    })
    describe('for sequence [5, 5, 5]', () => {
        const sequence = [5, 5, 5];
        it('should know the maximum value is 5', () => {
            const res = statsCalculator(sequence)
            expect(res.maximum).toBe(5);
        });
    })

});