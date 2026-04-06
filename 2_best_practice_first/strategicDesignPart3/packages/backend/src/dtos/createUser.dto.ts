import {isMissingKeys} from "../shared/utils";
import {InvalidRequestBodyException} from "../shared/errors/exceptions";

export type User = {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
}

export class CreateUserDto {
    constructor(
        public email: User["email"],
        public username: User["username"],
        public firstName: User["firstName"],
        public lastName: User["lastName"]
    ) {
    }


    static fromRequest(body: unknown) {
        const requiredKeys = ["email", "username", "firstName", "lastName"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException();
        }

        const {
            email, username, firstName, lastName
        } = body as User;
        return new CreateUserDto(email, username, firstName, lastName);
    }
}