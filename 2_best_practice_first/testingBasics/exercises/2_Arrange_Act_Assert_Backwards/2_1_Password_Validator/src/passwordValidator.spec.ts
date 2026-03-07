import {describe, it, expect} from "bun:test"
import {type PasswordErrorType, passwordValidator,} from "./passwordValidator";

const invalidPasswords: [PasswordErrorType, string][] = [
    ['invalidLength', 'P4ss'],
    ['invalidLength', 'This1sAVeryLongPassword'],
    ['missingNumber', 'Password'],
    ['missingUppercase', 'password'],
]
const errorCountToInvalidPasswords: [number, string][] = [
    [3, 'paas'],
    [2, 'password123456789'],
    [2, 'PASS'],
]

describe('passwordValidator', () => {
    it('should mark password "Passw0rd" as valid', () => {
        const password = "Passw0rd";
        const res = passwordValidator(password);
        expect(res.isValid).toBeTrue();
        expect(res.errors).toHaveLength(0)
    });

    it.each(invalidPasswords)("should mark password %p with %p error type", (error, password) => {
        const res = passwordValidator(password);
        expect(res.isValid).toBeFalse();
        expect(res.errors).toContain(error)
    })

    it.each(errorCountToInvalidPasswords)("should count %p errors if password %p is used", (errorCount, password) => {
        const res = passwordValidator(password);
        expect(res.isValid).toBeFalse();
        expect(res.errors).toHaveLength(errorCount)
    })
});