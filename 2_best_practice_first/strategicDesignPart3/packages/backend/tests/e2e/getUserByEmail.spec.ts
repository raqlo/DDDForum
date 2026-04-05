import {defineFeature, loadFeature} from 'jest-cucumber';
import path from 'path';
import {CreateUserInputBuilder, UserBuilder, UserInput} from "../../../shared/tests/fixtures/userBuilder";
import request from 'supertest';
import {app} from "@dddforum/backend/src";
import {DatabaseFixture} from "../../../shared/tests/fixtures/databaseFixture";
import {email} from "envalid";
import {response} from "express";


const feature = loadFeature(path.join(__dirname, '../../../shared/tests/features/getUserByEmail.feature'));


defineFeature(feature, (test) => {
    const databaseFixture = new DatabaseFixture();

    beforeEach(async () => {
        await databaseFixture.resetDatabase()
    })

    test('Obtain user by email', ({given, when, then}) => {
        let existingUser: any = {}
        let response: any = {}

        given('That I an existing user', async () => {
            let userInput = new CreateUserInputBuilder().withAllRandomDetails().build()
            existingUser = await new UserBuilder()
                .withFirstName(userInput.firstName!)
                .withLastName(userInput.lastName!)
                .withEmail(userInput.email!)
                .withUsername(userInput.username!)
                .build();
        });

        when('I try to look for the email of the user', async () => {
            response = await request(app).get(`/users?email=${existingUser.email}`).send()
        });

        then('I get a succesful response with the details of the user', () => {
            expect(response.status).toBe(200);
            expect(response.body.data.email).toEqual(existingUser.email);
        });
    });

    test('Invalid or missing fields', ({given, when, then}) => {
        let response: any = {}
        when('I try to look for the user but I forget to add the email', async () => {
            response = await request(app).get(`/users`).send()
        });

        then('I get a validation error', () => {
            expect(response.status).toBe(400);
        });
    });

    test('User does not exist on database', ({given, when, then}) => {
        let input: any = {}
        let response: any = {}

        given('that I have an email of an unregistered user', () => {
            input = {email: 'jdoe23@gmail.com'}
        });

        when('I try to look for a user that doesnt exist', async () => {
            response = await request(app).get(`/users?email=${input.email}`).send()
        });

        then('the system warns me that the user does not exist', () => {
            expect(response.status).toBe(404);
        });
    });


})