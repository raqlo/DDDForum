import {describe, it, expect} from "bun:test"
import {passwordValidator} from "./passwordValidator";

describe('passwordValidator', () => {
    it('should mark password "Passw0rd" as valid', () => {
        const password = "Passw0rd";
        const res = passwordValidator(password);
        expect(res.isValid).toBeTrue();
        expect(res.errors).toHaveLength(0)
    });
    it('should mark password "P4ss" as invalid', () => {
        const password = "P4ss";
        const res = passwordValidator(password);
        expect(res.isValid).toBeFalse();
        expect(res.errors).toContain('invalidLength')
    });
    it('should mark password "P4ssw0rd" as invalid', () => {
        const password = "This1sAVeryLongPassword";
        const res = passwordValidator(password);
    })
});