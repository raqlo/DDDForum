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