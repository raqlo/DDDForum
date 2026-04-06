export class InvalidRequestBodyException extends Error {
    constructor() {
        super("Body is missing required keys: ");
    }
}

export class UserNotFoundException extends Error {
    constructor() {
        super("User not found");
    }
}

export class ClientError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ValidationError extends Error {
    constructor() {
        super("Invalid request body");
    }
}

export class EmailAlreadyInUse extends Error {
    constructor() {
        super("Email already in use");
    }
}

export class UsernameAlreadyTaken extends Error {
    constructor() {
        super("Username already taken");
    }
}