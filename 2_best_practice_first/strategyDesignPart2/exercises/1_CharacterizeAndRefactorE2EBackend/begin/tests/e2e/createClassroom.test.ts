import request from "supertest";
import { app } from "../../src";

import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";

const feature = loadFeature(
    path.join(__dirname, "../features/createClassRoom.feature")
);
import { resetDatabase } from "../fixtures/reset";
import {ClassBuilder, Classroom} from "../fixtures/classBuilder";

defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase();
    })

    test('Successfully create a class room', ({given, when, then}) => {
        let requestBody: any = {};
        let response: any = {};

        given(/^I want to create a class room named "(.*)"$/, (name) => {
            requestBody = {
                name,
            };
        })

        when('I send a request to create a class room', async () => {
            response = await request(app).post("/classes").send(requestBody);
        });

        then('the class room should be created successfully', () => {
            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe(requestBody.name);
        });
    })

    test('Fail to create a class room because of missing name', ({ given, when, then }) => {
        let requestBody: any = {};
        let response: any = {};

        given('I want to create a class room with no name', () => {
            requestBody = {
            };
        });

        when('I send a request to create a class room', async () => {
            response = await request(app).post("/classes").send(requestBody);
        });

        then('the class room should not be created', () => {
            expect(response.status).toBe(400);
        });
    });

    test('Fail to create a class room because already exists', ({ given, when, then }) => {
        let requestBody: any = {}
        let response: any = {}
        let classroom: Classroom

        given(/^I have a class room named "(.*)"$/, async (className) => {
            classroom = await new ClassBuilder().withName(className).build();
        });

        when(/^I try to create a new class room named "(.*)"$/, async (arg0) => {
            requestBody = {
                name: arg0,
            };
            response = await request(app).post("/classes").send(requestBody);
        });

        then('it should not let me create a duplicate', () => {
            expect(response.status).toBe(409);
        });
    });


})
