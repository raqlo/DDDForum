import {describe, it, expect} from "bun:test"
import {type PasswordErrorType, passwordValidator,} from "./passwordValidator";

const invalidPasswords: [PasswordErrorType, string][]= [
    ['invalidLength', 'P4ss'],
    ['invalidLength', 'This1sAVeryLongPassword'],
    ['missingNumber', 'Password'],
    ['missingUppercase', 'password'],
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
    it('should count 3 errors if password "paas" is used', () => {
        const res = passwordValidator("paas");
        expect(res.isValid).toBeFalse();
        expect(res.errors).toHaveLength(3)
    });
    it('should count 2 errors if password "password123456789" is used', () => {
        const res = passwordValidator("password123456789");
        expect(res.isValid).toBeFalse();
        expect(res.errors).toHaveLength(2)
    });
    it('should count 2 error if password "PASSWORD" is used', () => {
        const res = passwordValidator("PASS");
        expect(res.isValid).toBeFalse();
        expect(res.errors).toHaveLength(2)
    });
});