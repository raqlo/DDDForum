import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {resetDatabase} from "../fixtures/reset";
import {
    AssignmentBuilder,
    ClassBuilder,
    ClassEnrollmentBuilder,
    StudentAssignmentBuilder,
    StudentBuilder
} from "../fixtures";
import request from "supertest";
import {app} from "../../src";
import {ClassEnrollment, StudentAssignment} from "../fixtures/types";

const feature = loadFeature(
    path.join(__dirname, "../features/getAllAssignmentsPerStudent.feature")
);
defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase()
    })
    let classEnrollment: ClassEnrollment;
    let assignment: AssignmentBuilder;
    let studentAssignment: StudentAssignment
    let response: any = {};

    test('Get assignments', ({given, and, when, then}) => {
        given('That I have a student assigned to classes', async () => {
            classEnrollment = await new ClassEnrollmentBuilder()
                .withClass(new ClassBuilder().withName('Math 101'))
                .withStudent(new StudentBuilder().withName('John Snow').withEmail('jsnow@email.com'))
                .build();
        });

        and('the student has many assignments', async () => {
            assignment = new AssignmentBuilder().withClassId(classEnrollment.classId).withTitle('Math Assignment')
            studentAssignment = await new StudentAssignmentBuilder().withAssignment(assignment).withStudentId(classEnrollment.studentId).build()
        });

        when('I try to fetch their assignments', async () => {
            response = await request(app).get(`/student/${classEnrollment.studentId}/assignments`)
        });

        then('I would get their assignment list', () => {
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    studentId: expect.any(String),
                    assignmentId: expect.any(String),
                    assignment: expect.any(Object)
                })
            ]))

        });
    });

})