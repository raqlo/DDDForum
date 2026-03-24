import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {resetDatabase} from "../fixtures/reset";
import {ClassBuilder} from "../fixtures/classBuilder";
import {StudentBuilder} from "../fixtures/studentBuilder";
import request from "supertest";
import {app} from "../../src";

const feature = loadFeature(
    path.join(__dirname, "../features/enrollStudentToClass.feature")
);

defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase()
    })

    test('Enroll student to a class', ({ given, and, when, then }) => {
        let student: any = {};
        let classroom: any = {};
        let requestBody: any = {};
        let response: any = {};

        given('That I have an existing student', async () => {
            student = await new StudentBuilder().withName('John Doe').withEmail('jdoe@email.com').build()
        });

        and('I have an existing class', async () => {
            classroom = await new ClassBuilder().withName('Math 101').build();
        });

        when('I try to assign the student to the class', async () => {
            requestBody = {
                studentId: student.id,
                classId: classroom.id
            }
            response = await request(app).post("/class-enrollments").send(requestBody);
        });

        then('The student is added to the classroom roster', () => {
            expect(response.status).toBe(201);
            expect(response.body.data.studentId).toBe(requestBody.studentId);
            expect(response.body.data.classId).toBe(requestBody.classId);
        });
    });
})