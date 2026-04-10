import {defineFeature, loadFeature} from 'jest-cucumber';
import path from 'path';
import {CreateUserInputBuilder, UserBuilder} from "../../../shared/tests/fixtures/userBuilder";
import {DatabaseFixture} from "../../../shared/tests/fixtures/databaseFixture";
import {createAPIClient} from "@dddforum/shared/src/api";
import {WebServer} from "../../src/shared/server";
import {CompositionRoot} from "../../src/shared/compositionRoot";
import {CreateUserResponse} from "@dddforum/shared/src/api/users";
import {AddEmailToListResponse, MarketingResponse} from "@dddforum/shared/src/api/marketing";


const feature = loadFeature(path.join(__dirname, '../../../shared/tests/features/registration.feature'));


defineFeature(feature, (test) => {
    const databaseFixture = new DatabaseFixture();
    const apiClient = createAPIClient('http://localhost:3000');
    let server: WebServer;

    beforeAll(async () => {
        const compositionRoot = CompositionRoot.getInstance(3000);
        server = compositionRoot.getWebServer();
        await server.start();
    });

    afterAll(async () => {
        await server.stop();
    });

    beforeEach(async () => {
        await databaseFixture.resetDatabase()
    })


    test('Successful registration with marketing emails accepted', ({given, when, then, and}) => {
        let addEmailToListResponse: AddEmailToListResponse
        let createUserResponse: CreateUserResponse
        let createUserInput: any
        let createMarketingInput: { userId: string, consent: boolean }

        given('I am a new user', async () => {
            createUserInput = new CreateUserInputBuilder()
                .withAllRandomDetails()
                .build();
        });

        when('I register with valid account details accepting marketing emails', async () => {
            createUserResponse = await apiClient.users.register(createUserInput)
            addEmailToListResponse = await apiClient.marketing.addEmailToList(createUserResponse.data.id, true)
        });

        then('I should be granted access to my account', () => {

            expect(createUserResponse.success).toBeTruthy();
            expect(createUserResponse.data.id).toBeDefined();
            expect(createUserResponse.data.email).toEqual(createUserInput.email);
            expect(createUserResponse.data.firstName).toEqual(createUserInput.firstName);
            expect(createUserResponse.data.lastName).toEqual(createUserInput.lastName);
            expect(createUserResponse.data.username).toEqual(createUserInput.username);
        });

        and('I should expect to receive marketing emails', () => {
            expect(addEmailToListResponse.success).toBeTruthy()
            expect(addEmailToListResponse.data.consent).toBe(true);
        });
    });


    test('Successful registration without marketing emails accepted', ({given, when, then, and}) => {
        let addEmailToListResponse: AddEmailToListResponse
        let createUserResponse: CreateUserResponse
        let createUserInput: any

        given('I am a new user', async () => {
            createUserInput = new CreateUserInputBuilder()
                .withAllRandomDetails()
                .build();
        });

        when('I register with valid account details declining marketing emails', async () => {
            createUserResponse = await apiClient.users.register(createUserInput)
            addEmailToListResponse = await apiClient.marketing.addEmailToList(createUserResponse.data.id, false)
        });

        then('I should be granted access to my account', () => {
            expect(createUserResponse.success).toBeTruthy();
            expect(createUserResponse.data.id).toBeDefined();
            expect(createUserResponse.data.email).toEqual(createUserInput.email);
            expect(createUserResponse.data.firstName).toEqual(createUserInput.firstName);
            expect(createUserResponse.data.lastName).toEqual(createUserInput.lastName);
            expect(createUserResponse.data.username).toEqual(createUserInput.username);
        });
        and('I should not expect to receive marketing emails', () => {
            expect(addEmailToListResponse.success).toBeTruthy();
            expect(addEmailToListResponse.data.consent).toBe(false);
        });
    });


    test('Invalid or missing registration details', ({given, when, then, and}) => {
        let createUserResponse: CreateUserResponse
        let createUserInput: any = {}
        given('I am a new user', () => {
            createUserInput = new CreateUserInputBuilder()
                .withFirstName('John')
                .withEmail('123@email.com')
                .build();
        });

        when('I register with invalid account details', async () => {
            createUserResponse = await apiClient.users.register(createUserInput);
        });

        then('I should see an error notifying me that my input is invalid', () => {
            expect(createUserResponse.success).toBe(false);
            expect(createUserResponse.error).toBe('ValidationError');
        });

        and('I should not have been sent access to account details', () => {
            expect(createUserResponse.data).toBeUndefined()
            expect(createUserResponse.success).toBe(false)
        });
    });


    test('Account already created with email', ({given, when, then, and}) => {
        let createUserResponses: CreateUserResponse[] = []
        let createUserInputs: any[] = []

        given('a set of users already created accounts', async (table) => {
            for (const row of table) {
                const {user} = await new UserBuilder()
                    .withFirstName(row.firstName)
                    .withLastName(row.lastName)
                    .withEmail(row.email)
                    .withUsername(row.firstName + row.lastName)
                    .build();

                createUserInputs.push(user);
            }
            console.log(createUserInputs);
        });

        when('new users attempt to register with those emails', async () => {
            const promises = createUserInputs.map(input =>
                apiClient.users.register(input)
            );
            createUserResponses = await Promise.all(promises);
        });

        then('they should see an error notifying them that the account already exists', () => {
            createUserResponses.forEach((response) => {
                expect(response.success).toBeFalsy();
                expect(response.error).toBeDefined();
                expect(response.error).toBe('EmailAlreadyInUse');
            })
        });

        and('they should not have been sent access to account details', () => {
            createUserResponses.forEach((response) => {
                expect(response.success).toBe(false);
                expect(response.data).toBeUndefined();
                expect(response.error).toBeDefined();
            });
        });
    });

    test('Username already taken', ({given, when, then, and}) => {
        let registrationResponses: CreateUserResponse[] = []
        let newUserInputs: any[] = []

        given('a set of users have already created their accounts with valid details', async (table) => {
            for (const row of table) {
                await new UserBuilder()
                    .withFirstName(row.firstName)
                    .withLastName(row.lastName)
                    .withEmail(row.email)
                    .withUsername(row.username)
                    .build();
            }
        });

        when('new users attempt to register with already taken usernames', async (table) => {
            for (const row of table) {
                const newUser = {
                    firstName: row.firstName,
                    lastName: row.lastName,
                    email: row.email,
                    username: row.username,
                    password: row.email
                };
                newUserInputs.push(newUser);
            }

            const promises = newUserInputs.map(input =>
                apiClient.users.register(input)
            );
            registrationResponses = await Promise.all(promises);
        });

        then('they see an error notifying them that the username has already been taken', () => {
            registrationResponses.forEach((response) => {
                expect(response.success).toBeFalsy();
                expect(response.error).toBeDefined();
                expect(response.error).toBe('UserNameAlreadyTaken');
            })
        });

        and('they should not have been sent access to account details', () => {
            registrationResponses.forEach((response) => {
                expect(response.success).toBe(false);
                expect(response.data).toBeUndefined();
                expect(response.error).toBeDefined();
            });
        });
    });

})