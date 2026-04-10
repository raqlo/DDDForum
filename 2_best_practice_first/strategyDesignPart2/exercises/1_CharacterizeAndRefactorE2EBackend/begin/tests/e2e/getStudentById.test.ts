import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {StudentBuilder} from "../fixtures";
import request from "supertest";
import {app} from "../../src";
import {resetDatabase} from "../fixtures/reset";
import {Student} from "../fixtures/types";

const feature = loadFeature(
    path.join(__dirname, "../features/getStudentById.feature")
);

defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase()
    })

    test('Get Student By Id', ({ given, when, then }) => {
        let student: Student
        let response: any = {}

        given('There is an existing student', async () => {
            student = await new StudentBuilder().withName('John Doe').withEmail('jdoe@emila.com').build()
        });

        when('I try to fetch an student by their id', async () => {
            response = await request(app).get(`/students/${student.id}`)

        });

        then('The student should be retrived', () => {
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(student.id);
            expect(response.body.data.name).toBe(student.name);
            expect(response.body.data.email).toBe(student.email);
        });
    });

})