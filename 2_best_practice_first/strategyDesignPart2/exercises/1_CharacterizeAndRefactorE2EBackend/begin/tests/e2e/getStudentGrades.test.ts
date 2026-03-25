import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {resetDatabase} from "../fixtures/reset";
import {ClassEnrollmentBuilder} from "../fixtures/classEnrollmentBuilder";
import {ClassBuilder} from "../fixtures/classBuilder";
import {StudentBuilder} from "../fixtures/studentBuilder";
import {AssignmentBuilder} from "../fixtures/assignmentBuilder";
import {StudentAssignment, StudentAssignmentBuilder} from "../fixtures/studentAssignmentBuilder";
import {ClassEnrollment} from "@prisma/client";
import {AssignmentSubmissionBuilder} from "../fixtures/assignmentSubmissionBuilder";
import {GradedAssignmentBuilder} from "../fixtures/gradedAssignmentBuilder";
import request from "supertest";
import {app} from "../../src";

const feature = loadFeature(
    path.join(__dirname, "../features/getStudentGrades.feature")
);

defineFeature(feature, test => {
    beforeEach(async () => {
        await resetDatabase()
    })

    let classEnrollment: ClassEnrollment;
    let studentAssignment: StudentAssignment;
    let response: any = {};

    test('Get Student Grades', ({given, and, when, then}) => {
        given('That I have a student assigned to a class', async () => {
            classEnrollment = await new ClassEnrollmentBuilder()
                .withClass(new ClassBuilder().withName('Math 101'))
                .withStudent(new StudentBuilder().withName('John Snow').withEmail('jsnow@email.com'))
                .build();
        });

        and('And all of their assignments are graded', async () => {
            const assignment = new AssignmentBuilder().withClassId(classEnrollment.classId).withTitle('Math Assignment')
            studentAssignment = await new StudentAssignmentBuilder().withAssignment(assignment).withStudentId(classEnrollment.studentId).build()
            const assignmentSubmission = await new AssignmentSubmissionBuilder().withStudentAssignmentId(studentAssignment.id).build()
            await new GradedAssignmentBuilder().withAssignmentSubmissionId(assignmentSubmission.id).withGrade('F').build()
        });

        when('I look for a list of the grades', async () => {
            response = await request(app).get(
                `/student/${classEnrollment.studentId}/grades`
            )
        });

        then('I can see the list', () => {
            console.log(response.body)
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    assignmentSubmissionId: expect.any(String),
                    grade: expect.any(String),
                    assignmentSubmission: expect.any(Object)
                })
            ]))
        });
    });

})