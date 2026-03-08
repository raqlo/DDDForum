import {describe, it, expect} from 'bun:test';
import {statsCalculator} from "./src/statsCalculator";



describe('Stats Calculator', () => {
    const sequence =  [2, 4, 21, -8, 53, 40];
    it('should know the minium value is -8', () => {
        const res = statsCalculator(sequence)
        expect(res.minimum).toBe(-8);
    });

});