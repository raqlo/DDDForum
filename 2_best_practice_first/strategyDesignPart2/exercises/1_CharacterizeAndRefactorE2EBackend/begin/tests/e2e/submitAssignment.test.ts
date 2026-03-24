import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {ClassBuilder} from "../fixtures/classBuilder";
import {StudentBuilder} from "../fixtures/studentBuilder";
import {ClassEnrollmentBuilder} from "../fixtures/classEnrollmentBuilder";
import {AssignmentBuilder} from "../fixtures/assignmentBuilder";
import {StudentAssignmentBuilder} from "../fixtures/studentAssignmentBuilder";
import request from "supertest";
import {app} from "../../src";
import {resetDatabase} from "../fixtures/reset";

const feature = loadFeature(
    path.join(__dirname, "../features/submitAssignment.feature")
);

defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase()
    })
    test('Submits assignment', ({given, and, when, then}) => {
        let enrollment: any = {};
        let assignment: any = {};
        let response: any = {};
        let requestBody: any = {};
        let studentAssignment: any = {};

        given('That I have a student assigned to a class', async () => {
            const classroom = new ClassBuilder().withName('Math 301')
            const student = new StudentBuilder().withName('John Snow').withEmail('jsnow@email.com')
            enrollment = await new ClassEnrollmentBuilder().withClass(classroom).withStudent(student).build()
        });

        and('That student has assigned an assignment', async () => {
            assignment = new AssignmentBuilder().withClassId(enrollment.classId).withTitle('Math Assignment')
            studentAssignment = await new StudentAssignmentBuilder().withAssignment(assignment).withStudentId(enrollment.studentId).build()
        });

        when('the student submits their assignment', async () => {
            requestBody = {
                assignmentId: studentAssignment.assignmentId,
                studentId: studentAssignment.studentId,
            }
            response = await request(app).post('/student-assignments/submit').send(requestBody)
        });

        then('An assignment submission is created', () => {
            expect(response.status).toBe(201);
        });

    })

    test('Student cannot submit assignment if is not assigned', ({ given, and, when, then }) => {
        let enrollment: any = {};
        let assignment: any = {};
        let response: any = {};
        let requestBody: any = {};
        let student: any = {};

        given('That I have a student assigned to a class', async () => {
            const classroom = new ClassBuilder().withName('Math 301')
            student = new StudentBuilder().withName('John Snow').withEmail('jsnow@email.com')
            enrollment = await new ClassEnrollmentBuilder().withClass(classroom).withStudent(student).build()
        });

        and('That student has not assigned an assignment', async () => {
            assignment = await new AssignmentBuilder().withClassId(enrollment.classId).withTitle('Math Assignment').build();
        });

        when('the student submits their assignment', async () => {
            requestBody = {
                assignmentId: assignment.id,
                studentId: enrollment.studentId,
            }
            response = await request(app).post('/student-assignments/submit').send(requestBody)
        });

        then('An assignment submission is not created', () => {
            expect(response.status).toBe(404);
        });
    });

})