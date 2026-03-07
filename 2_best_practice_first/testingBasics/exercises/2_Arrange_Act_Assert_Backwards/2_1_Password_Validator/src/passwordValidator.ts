 type PasswordValidatorResponse = {
    isValid: boolean;
    errors: PasswordErrorType[];
}

export type PasswordErrorType = 'invalidLength' | 'missingUppercase' | 'missingNumber'

export function passwordValidator(password: string): PasswordValidatorResponse {
    const isLengthValid = password.length >= 5 && password.length <= 15;
    const containsNumber = /\d/.test(password);
    const containsUppercase = /[A-Z]/.test(password);

    const errors = [] as PasswordErrorType[];
    if(!isLengthValid) {
        errors.push('invalidLength')
    }
    if(!containsNumber) {
        errors.push('missingNumber')
    }
    if (!containsUppercase) {
        errors.push('missingUppercase')
    }

    return {isValid: errors.length === 0, errors}
}