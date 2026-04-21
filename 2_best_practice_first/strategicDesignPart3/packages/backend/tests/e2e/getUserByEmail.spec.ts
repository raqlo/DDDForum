import {defineFeature, loadFeature} from 'jest-cucumber';
import path from 'path';
import {CreateUserInputBuilder, UserBuilder} from "../../../shared/tests/fixtures/userBuilder";
import {DatabaseFixture} from "../../../shared/tests/fixtures/databaseFixture";
import {createAPIClient} from "@dddforum/shared/src/api";
import {GetUserByEmailResponse, User} from "@dddforum/shared/src/api/users";
import {CompositionRoot} from "@dddforum/backend/src/shared/compositionRoot";
import {WebServer} from "@dddforum/backend/src/shared/server";

const feature = loadFeature(path.join(__dirname, '../../../shared/tests/features/getUserByEmail.feature'));

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

    test('Obtain user by email', ({given, when, then}) => {
        let existingUser: User
        let response: GetUserByEmailResponse

        given('That I an existing user', async () => {
            let userInput = new CreateUserInputBuilder().withAllRandomDetails().build()
            const {member, user} = await new UserBuilder()
                .withFirstName(userInput.firstName!)
                .withLastName(userInput.lastName!)
                .withEmail(userInput.email!)
                .withUsername(userInput.username!)
                .build();

            existingUser = user;
        });

        when('I try to look for the email of the user', async () => {
            response = await apiClient.users.getUserByEmail(existingUser.email)
            console.log({response})

        });

        then('I get a succesful response with the details of the user', () => {
            expect(response.success).toBeTruthy()
            expect(response.data.email).toEqual(existingUser.email);
        });
    });

    test('Invalid or missing fields', ({given, when, then}) => {
        let response: GetUserByEmailResponse
        when('I try to look for the user but I forget to add the email', async () => {
            response = await apiClient.users.getUserByEmail("")
        });

        then('I get a validation error', () => {
            expect(response.error).toBe('UserNotFound');
        });
    });

    test('User does not exist on database', ({given, when, then}) => {
        let input: any = {}
        let response: GetUserByEmailResponse

        given('that I have an email of an unregistered user', () => {
            input = {email: 'jdoe23@gmail.com'}
        });

        when('I try to look for a user that doesnt exist', async () => {
            response = await apiClient.users.getUserByEmail(input.email)
        });

        then('the system warns me that the user does not exist', () => {
            expect(response.error).toBe('UserNotFound');
        });
    });


})