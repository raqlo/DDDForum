import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {resetDatabase} from "../fixtures/reset";
import {ClassBuilder, ClassEnrollmentBuilder, StudentBuilder} from "../fixtures";
import request from "supertest";
import {app} from "../../src";
import {ClassEnrollment, Classroom, Student} from "../fixtures/types";

const feature = loadFeature(
    path.join(__dirname, "../features/enrollStudentToClass.feature")
);

defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase()
    })

    test('Enroll student to a class', ({given, and, when, then}) => {
        let student: Student;
        let classroom: Classroom;
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

    test('Fail to enroll if student is already in the class', ({given, and, when, then}) => {
        let classEnrollment: ClassEnrollment;
        let requestBody: any = {};
        let response: any = {};

        given('That I have a student assigned to a class', async () => {
            classEnrollment = await new ClassEnrollmentBuilder()
                .withClass(new ClassBuilder().withName('Math 101'))
                .withStudent(new StudentBuilder().withName('John Snow').withEmail('jsnow@email.com'))
                .build();
        });

        when('I try to assign the student to the class', async () => {
            requestBody = {
                studentId: classEnrollment.studentId,
                classId: classEnrollment.classId,
            }

            response = await request(app).post("/class-enrollments").send(requestBody);
        });

        then('It won\'t let me duplicate the student assignment', () => {
            expect(response.status).toBe(409);
        });
    });

    test('Fail to enroll if missing class or student', ({given, and, when, then}) => {
        let requestBody: any = {};
        let response: any = {};
        let classroom: Classroom;
        let student: {
            id: string,
        };

        given('That I have a class', async () => {
            classroom = await new ClassBuilder().withName('Math 101').build();
        });

        and('the student doesn\'t exist yet', () => {
            student = {
                id: '12345-6789-09876-54321',
            }
        });

        when('I try to assign it to the class', async () => {
            requestBody = {
                studentId: student.id,
                classId: classroom.id,
            }

            response = await request(app).post('/class-enrollments').send(requestBody)
        });

        then('The assignment doesnt get created', () => {
            expect(response.status).toBe(404);
        });
    });

})