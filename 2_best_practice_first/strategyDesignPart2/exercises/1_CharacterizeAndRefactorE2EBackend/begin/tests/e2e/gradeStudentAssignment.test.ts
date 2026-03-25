import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {ClassEnrollment, ClassEnrollmentBuilder} from "../fixtures/classEnrollmentBuilder";
import {ClassBuilder} from "../fixtures/classBuilder";
import {StudentBuilder} from "../fixtures/studentBuilder";
import {AssignmentBuilder} from "../fixtures/assignmentBuilder";
import {StudentAssignment, StudentAssignmentBuilder} from "../fixtures/studentAssignmentBuilder";
import request from "supertest";
import {AssignmentSubmissionBuilder} from "../fixtures/assignmentSubmissionBuilder";
import {app} from "../../src";
import {resetDatabase} from "../fixtures/reset";
import {GradedAssignmentBuilder} from "../fixtures/gradedAssignmentBuilder";

const feature = loadFeature(
    path.join(__dirname, "../features/gradeStudentAssignment.feature")
);


defineFeature(feature, test => {
    beforeEach(async () => {
        await resetDatabase();
    })
    test('Successfully Grading Assignment', ({given, and, when, then}) => {
        let enrollment: ClassEnrollment;
        let studentAssignment: StudentAssignment;
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

            response = await request(app).post('/student-assignments/grade').send(requestBody);
        });

        then('The assignment gets associated with the grade', () => {
            expect(response.status).toBe(201);
        });
    });

    test('Fail to grade if student assignment does not exist', ({given, and, when, then}) => {
        let enrollment: ClassEnrollment;
        let assignmentId: string;
        let requestBody: any = {};
        let response: any = {};

        given('That I have a student assigned to a class', async () => {
            enrollment = await new ClassEnrollmentBuilder()
                .withClass(new ClassBuilder().withName('Math 101'))
                .withStudent(new StudentBuilder().withName('John Snow').withEmail('jsnowi@email.com'))
                .build();
        });

        and('The assignment does not exist', () => {
            assignmentId = '1234567890';
        });

        when('I grade the assignment', async () => {
            requestBody = {
                studentId: enrollment.studentId,
                assignmentId: assignmentId,
                grade: 'A',
            }
            response = await request(app).post('/student-assignments/grade').send(requestBody);

        });

        then('The assignment does not get created', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('AssignmentNotFound')
        });
    });
    test('Fail to grade if student assignment didn\'t submit the assignment', ({given, and, when, then}) => {
        let enrollment: ClassEnrollment;
        let studentAssignment: StudentAssignment;
        let requestBody: any = {};
        let response: any = {};

        given('That I have a student assigned to a class', async () => {
            enrollment = await new ClassEnrollmentBuilder()
                .withClass(new ClassBuilder().withName('Math 101'))
                .withStudent(new StudentBuilder().withName('John Snow').withEmail('jsnowi@email.com'))
                .build();
        });

        and('the assignment has not been submitted', async () => {
            const assignment = new AssignmentBuilder().withClassId(enrollment.classId).withTitle('Math Assignment')
            studentAssignment = await new StudentAssignmentBuilder().withAssignment(assignment).withStudentId(enrollment.studentId).build()
        });

        when('I grade the assignment', async () => {
            requestBody = {
                studentId: enrollment.studentId,
                assignmentId: studentAssignment.assignmentId,
                grade: 'A',
            }

            response = await request(app).post('/student-assignments/grade').send(requestBody);
        });

        then('The assignment does not get created', () => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('NotSubmittedError')
        });
    });

    test('Fail to grade if assignment is already graded', ({given, and, when, then}) => {
        let enrollment: ClassEnrollment;
        let studentAssignment: StudentAssignment;
        let requestBody: any = {};
        let response: any = {};

        given('That I have a student assigned to a class', async () => {
            enrollment = await new ClassEnrollmentBuilder()
                .withClass(new ClassBuilder().withName('Math 101'))
                .withStudent(new StudentBuilder().withName('John Snow').withEmail('jsnowi@email.com'))
                .build();
        });

        and('the assignment has already been graded', async () => {
            const assignment = new AssignmentBuilder().withClassId(enrollment.classId).withTitle('Math Assignment')
            studentAssignment = await new StudentAssignmentBuilder().withAssignment(assignment).withStudentId(enrollment.studentId).build()
            const assignmentSubmission = await new AssignmentSubmissionBuilder().withStudentAssignmentId(studentAssignment.id).build()
            await new GradedAssignmentBuilder().withAssignmentSubmissionId(assignmentSubmission.id).withGrade('F').build()
        });

        when('I grade the assignment', async () => {
            requestBody = {
                studentId: enrollment.studentId,
                assignmentId: studentAssignment.assignmentId,
                grade: 'A',
            }

            response = await request(app).post('/student-assignments/grade').send(requestBody);
        });

        then('The assignment does not get created', () => {
            expect(response.status).toBe(409);
            expect(response.body.error).toBe('AlreadyGradedAssignment')
        });
    });

})