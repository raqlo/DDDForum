type PasswordValidatorResponse = {
    isValid: boolean;
    errors: PasswordErrorType[];
}

type PasswordErrorType = 'invalidLength' | 'missingUppercase' | 'missingNumber'

export function passwordValidator(password: string): PasswordValidatorResponse {
    const isLengthValid = password.length >= 5 && password.length <= 15;
    const errors = [] as PasswordErrorType[];
    if(!isLengthValid) {
        errors.push('invalidLength')
    }
    return {isValid: errors.length === 0, errors}
}