// import { CreateUserInput } from "@dddforum/shared/src/api/users";
// import { TextUtil } from "@dddforum/shared/src/utils/textUtils";

import {faker, th} from "@faker-js/faker";
import {PrismaClient} from "@prisma/client";
import {prisma} from "../../../backend/src/database";

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

interface Created {
}

export class UserBuilder {
    private connection: PrismaClient;
    private props: Partial<UserInput>;

    constructor() {
        this.connection = prisma
        this.props = {}
    }

    public withAllRandomDetails() {
        this.props = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            username: faker.internet.username(),
        }
        return this;
    }
    public withFirstName(firstName: string) {
        this.props = {
            ...this.props,
            firstName,
        }
        return this;
    }
    public withLastName(lastName: string) {
        this.props = {
            ...this.props,
            lastName,
        }
        return this;
    }
    public withEmail(email: string) {
        this.props = {
            ...this.props,
            email,
        }
        return this;
    }
    public withUsername(username: string) {
        this.props = {
            ...this.props,
            username,
        }
        return this;
    }

    public build() {
        if(!this.props.firstName) throw new Error('First name is required')
        if(!this.props.lastName) throw new Error('Last name is required')
        if(!this.props.email) throw new Error('Email is required')
        if(!this.props.username) throw new Error('Username is required')
        return (
            this.connection.user.create({
                data: {
                    email: this.props.email,
                    firstName: this.props.firstName,
                    lastName: this.props.lastName,
                    username: this.props.username,
                    password: this.props.email,
                }
            })
        )
    }
}