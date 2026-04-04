import {defineFeature, loadFeature} from 'jest-cucumber';
import path from 'path';
import {CreateUserInputBuilder, UserBuilder, UserInput} from "../fixtures/userBuilder";
import request from 'supertest';
import {app} from "@dddforum/backend/src";
import {DatabaseFixture} from "../fixtures/databaseFixture";


const feature = loadFeature(path.join(__dirname, '../features/registration.feature'));


defineFeature(feature, (test) => {
    const databaseFixture = new DatabaseFixture();

    beforeEach(async () => {
        await databaseFixture.resetDatabase()
    })


    test('Successful registration with marketing emails accepted', ({given, when, then, and}) => {
        let addEmailToListResponse: any = {}
        let createUserResponse: any = {}
        let createUserInput: any
        let createMarketingInput: { userId: string, consent: boolean }

        given('I am a new user', async () => {
            createUserInput = new CreateUserInputBuilder()
                .withAllRandomDetails()
                .build();
        });

        when('I register with valid account details accepting marketing emails', async () => {
            createUserResponse = await request(app)
                .post("/users/new")
                .send(createUserInput);
            const {data} = createUserResponse.body!
            addEmailToListResponse = await request(app)
                .post("/marketing/new")
                .send({userId: data.id, consent: true});
        });

        then('I should be granted access to my account', () => {
            const {data} = createUserResponse.body!
            expect(createUserResponse.status).toBe(201);
            expect(data.id).toBeDefined();
            expect(data.email).toEqual(createUserInput.email);
            expect(data.firstName).toEqual(createUserInput.firstName);
            expect(data.lastName).toEqual(createUserInput.lastName);
            expect(data.username).toEqual(createUserInput.username);
        });

        and('I should expect to receive marketing emails', () => {
            const {data} = addEmailToListResponse.body!

            expect(addEmailToListResponse.status).toBe(201);
            expect(data.consent).toBe(true);
        });
    });


    test('Successful registration without marketing emails accepted', ({given, when, then, and}) => {
        let addEmailToListResponse: any = {}
        let createUserResponse: any = {}
        let createUserInput: Partial<UserInput>

        given('I am a new user', () => {
            createUserInput = new CreateUserInputBuilder()
                .withAllRandomDetails()
                .build();
        });

        when('I register with valid account details declining marketing emails', async () => {
            createUserResponse = await request(app)
                .post("/users/new")
                .send(createUserInput);

            const {data} = createUserResponse.body!
            addEmailToListResponse = await request(app)
                .post("/marketing/new")
                .send({userId: data.id, consent: false});
        });
        then('I should be granted access to my account', () => {
            const {data} = createUserResponse.body!
            expect(createUserResponse.status).toBe(201);
            expect(data.id).toBeDefined();
            expect(data.email).toEqual(createUserInput.email);
            expect(data.firstName).toEqual(createUserInput.firstName);
            expect(data.lastName).toEqual(createUserInput.lastName);
            expect(data.username).toEqual(createUserInput.username);
        });
        and('I should not expect to receive marketing emails', () => {
            const {data} = addEmailToListResponse.body!

            expect(addEmailToListResponse.status).toBe(201);
            expect(data.consent).toBe(false);
        });
    });


    test('Invalid or missing registration details', ({given, when, then, and}) => {
        let createUserResponse: any = {}
        let createUserInput: any = {}
        given('I am a new user', () => {
            createUserInput = new CreateUserInputBuilder()
                .withFirstName('John')
                .withEmail('123@email.com')
                .build();
        });

        when('I register with invalid account details', async () => {
            createUserResponse = await request(app)
                .post("/users/new")
                .send(createUserInput);
        });

        then('I should see an error notifying me that my input is invalid', () => {
            expect(createUserResponse.status).toBe(400);
            expect(createUserResponse.body.error).toBe('ValidationError');
        });

        and('I should not have been sent access to account details', () => {
            expect(createUserResponse.body.data).toBeUndefined()
            expect(createUserResponse.body.success).toBe(false)
        });
    });


    test('Account already created with email', ({given, when, then, and}) => {
        let createUserResponses: any[] = []
        let createUserInputs: any[] = []

        given('a set of users already created accounts', async (table) => {
            for (const row of table) {
                const user = await new UserBuilder()
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
                request(app).post("/users/new").send(input)
            );
            createUserResponses = await Promise.all(promises);
        });

        then('they should see an error notifying them that the account already exists', () => {
            createUserResponses.forEach((response) => {
                expect(response.status).toBe(409);
                expect(response.body.error).toBeDefined();
                expect(response.body.success).toBeFalsy();
            })
        });

        and('they should not have been sent access to account details', () => {
            createUserResponses.forEach((response) => {
                expect(response.body.success).toBe(false);
                expect(response.body.data).toBeUndefined();
                expect(response.body.error).toBeDefined();
            });
        });
    });

    test('Username already taken', ({given, when, then, and}) => {
        given('a set of users have already created their accounts with valid details', (table) => {
            let createUserResponses: any[] = []
            let createUserInputs: any[] = []
        });

        when('new users attempt to register with already taken usernames', (table) => {

        });

        then('they see an error notifying them that the username has already been taken', () => {

        });

        and('they should not have been sent access to account details', () => {

        });
    });

})