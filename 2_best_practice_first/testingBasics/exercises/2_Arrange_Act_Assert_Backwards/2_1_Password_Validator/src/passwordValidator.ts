type PasswordValidatorResponse = {
    isValid: boolean;
    errors: PasswordErrorType[];
}

type PasswordErrorType = 'invalidLength' | 'missingUppercase' | 'missingNumber'