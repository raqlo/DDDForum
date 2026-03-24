import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {ClassBuilder} from "../fixtures/classBuilder";
import request from "supertest";
import {app} from "../../src";
import {resetDatabase} from "../fixtures/reset";


const feature = loadFeature(
    path.join(__dirname, "../features/createAssignment.feature")
);

defineFeature(feature, (test) => {
    beforeAll(async () => {
        await resetDatabase();
    })
    test('Successfully create a new assignment', ({given, when, then}) => {
        let classroom: any = {};
        let result: any = {};
        let requestBody: any = {};

        given(/^I have a class room named "(.*)"$/, async (classroomName) => {
            classroom = await new ClassBuilder()
                .withName(classroomName)
                .build();
        });

        when(/^I create a new "(.*)" assignment for the class$/, async (assignmentTitle) => {
            requestBody = {
                title: assignmentTitle,
                classId: classroom.id,
            }
            result = await request(app).post("/assignments").send(requestBody)
        });

        then('The assignment should be created for the class', () => {
            expect(result.status).toBe(201);
            expect(result.body.data.classId).toBe(requestBody.classId);
        });
    });
})