import request from "supertest";
import {app} from "../../src";

import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";

const feature = loadFeature(
    path.join(__dirname, "../features/createStudent.feature")
);
import {resetDatabase} from "../fixtures/reset";

defineFeature(feature, (test) => {
    beforeAll(async () => {
        await resetDatabase();
    })
    test('Successfully create a student', ({given, when, then}) => {
        let requestBody: any = {};
        let response: any = {};

        given(/^I want to create a student named (.*) and with email (.*)$/, (name, email) => {
            requestBody = {
                name: name,
                email: email,
            }
        });

        when('I send a request to create a student', async () => {
            response = await request(app).post("/students").send(requestBody);
        });

        then('the student should be created successfully', () => {
            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe(requestBody.name);
        });
    });

    test('Fail to create a student because of missing email', ({given, when, then}) => {
        given(/^I want to create a student named (.*) and no email$/, (arg0) => {

        });

        when('I send a request to create a student', () => {

        });

        then('the student should not be created', () => {

        });
    });
    test('Fail to create a student because the email already exists', ({given, when, then}) => {
        given(/^`There is an existing student with email (.*)`$/, (arg0) => {

        });

        when('I send a request to create a student', () => {

        });

        then('the student should not be created', () => {

        });
    });


})