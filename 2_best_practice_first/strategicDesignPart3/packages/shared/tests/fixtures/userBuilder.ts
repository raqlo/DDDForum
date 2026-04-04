// import { CreateUserInput } from "@dddforum/shared/src/api/users";
// import { TextUtil } from "@dddforum/shared/src/utils/textUtils";

import {faker} from "@faker-js/faker";

export interface UserInput {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

export class CreateUserInputBuilder {
    private props: Partial<UserInput>;

    constructor() {
        this.props = <Partial<UserInput>>{
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            username: undefined,
        };
    }

    public withAllRandomDetails() {
        this.withFirstName(faker.person.firstName());
        this.withLastName(faker.person.lastName());
        this.withEmail(faker.internet.email());
        this.withUsername(faker.internet.username());
        return this;
    }

    public withFirstName(firstName: string) {
        this.props = {
            ...this.props,
            firstName,
        };
        return this;
    }

    public withLastName(lastName: string) {
        this.props = {
            ...this.props,
            lastName,
        };
        return this;
    }

    public withEmail(email: string) {
        this.props = {
            ...this.props,
            email,
        };
        return this;
    }

    public withUsername(username: string) {
        this.props = {
            ...this.props,
            username,
        };
        return this;
    }

    public build() {
        return this.props;
    }
}