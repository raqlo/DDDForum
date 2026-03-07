type PasswordValidatorResponse = {
    isValid: boolean;
    errors: PasswordErrorType[];
}

type PasswordErrorType = 'invalidLength' | 'missingUppercase' | 'missingNumber'

export function passwordValidator(password: string): PasswordValidatorResponse {
    return {isValid: true, errors: []}
}