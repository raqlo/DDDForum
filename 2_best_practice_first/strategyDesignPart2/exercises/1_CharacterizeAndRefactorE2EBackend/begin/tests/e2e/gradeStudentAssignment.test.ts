import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {ClassEnrollmentBuilder} from "../fixtures/classEnrollmentBuilder";
import {ClassBuilder} from "../fixtures/classBuilder";
import {StudentBuilder} from "../fixtures/studentBuilder";
import {AssignmentBuilder} from "../fixtures/assignmentBuilder";
import {StudentAssignmentBuilder} from "../fixtures/studentAssignmentBuilder";
import request from "supertest";
import {AssignmentSubmissionBuilder} from "../fixtures/assignmentSubmissionBuilder";
import {app} from "../../src";
import {resetDatabase} from "../fixtures/reset";

const feature = loadFeature(
    path.join(__dirname, "../features/gradeStudentAssignment.feature")
);

defineFeature(feature, test => {
    beforeEach(async () => {
        await resetDatabase();
    })
    test('Successfully Grading Assignment', ({given, and, when, then}) => {
        let enrollment: any = {};
        let studentAssignment: any = {};
        let requestBody: any = {};
        let response: any = {};

        given('That I have a student assigned to a class', async () => {
            enrollment = await new ClassEnrollmentBuilder()
                .withClass(new ClassBuilder().withName('Math 101'))
                .withStudent(new StudentBuilder().withName('John Snow').withEmail('jsnowi@email.com'))
                .build();
        });

        and('That they submitted an assignment for grading', async () => {
            const assignment = new AssignmentBuilder().withClassId(enrollment.classId).withTitle('Math Assignment')
            studentAssignment = await new StudentAssignmentBuilder().withAssignment(assignment).withStudentId(enrollment.studentId).build()
            await new AssignmentSubmissionBuilder().withStudentAssignmentId(studentAssignment.id).build()
        });

        when(/^I grade the assignment with a "(.*)" grade$/, async (grade) => {
            requestBody = {
                studentId: enrollment.studentId,
                assignmentId: studentAssignment.assignmentId,
                grade: grade,
            }

            console.log(requestBody)
            response = await request(app).post('/student-assignments/grade').send(requestBody)
            console.log(response.body)
        });

        then('The assignment gets associated with the grade', () => {
            expect(response.status).toBe(201);
        });
    });

})