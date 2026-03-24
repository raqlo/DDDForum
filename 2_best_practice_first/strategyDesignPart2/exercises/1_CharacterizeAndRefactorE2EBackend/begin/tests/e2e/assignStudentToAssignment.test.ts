import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {resetDatabase} from "../fixtures/reset";
import {ClassEnrollmentBuilder} from "../fixtures/classEnrollmentBuilder";
import {ClassBuilder} from "../fixtures/classBuilder";
import {StudentBuilder} from "../fixtures/studentBuilder";
import {AssignmentBuilder} from "../fixtures/assignmentBuilder";
import {app} from "../../src";
import request from "supertest";

const feature = loadFeature(
    path.join(__dirname, "../features/assignStudentToAssignment.feature")
);

defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase();
    })

    test('Successfully assign student to assignment', ({given, and, when, then}) => {
        let enrollment: any = {};
        let assignment: any = {};
        let response: any = {};

        given('That I have a student assigned to a class', async () => {
            const classroom = new ClassBuilder().withName('Math 301')
            const student = new StudentBuilder().withName('John Snow').withEmail('jsnow@email.com')
            enrollment = await new ClassEnrollmentBuilder().withClass(classroom).withStudent(student).build()
        });

        and('an assignment exists for the class', async () => {
            assignment = await new AssignmentBuilder().withClassId(enrollment.classId).withTitle('Math Assignment').build();
        });

        when('I want to assign the student to the assignment', async () => {
            const requestBody = {
                studentId: enrollment.studentId,
                assignmentId: assignment.id,
            }
            response = await request(app).post("/student-assignments").send(requestBody);
        });

        then('The assignment gets associated to the student', () => {
            expect(response.status).toBe(201);
            expect(response.body.data.studentId).toBe(enrollment.studentId);
            expect(response.body.data.assignmentId).toBe(assignment.id);
        });
    });

    test('When student is not enrolled in class', ({given, and, when, then}) => {
        let assignment: any = {};
        let student: any = {};
        let requestBody: any = {};
        let response: any = {};

        given('I have an assignment that exists for a class', async () => {
            const classroom = await new ClassBuilder().withName('Spanish 101').build();
            assignment = await new AssignmentBuilder().withTitle('Spanish Assignment').withClassId(classroom.id).build()
        });

        and('I have a student not enrolled in the class', async () => {
            student = await new StudentBuilder().withEmail('jsnow@email.com').withName('John Snow').build();
        });

        when('I try to assign the student to the assignment', async () => {
            requestBody = {
                studentId: student.id,
                assignmentId: assignment.id,
            }
            response = await request(app).post('/student-assignments').send(requestBody)
        });

        then('It will prevent from adding the assignment to the student', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('StudentNotEnrolled')
        });
    });


})