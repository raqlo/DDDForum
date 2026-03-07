import {describe, it, expect} from "bun:test"
import {passwordValidator} from "./passwordValidator";

describe('passwordValidator', () => {
    it('should mark password "Passw0rd" as valid', () => {
        const password = "Passw0rd";
        const res = passwordValidator(password);
        expect(res.isValid).toBeTrue();
        expect(res.errors).toHaveLength(0)
    });
});