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
import {app} from "../../src";
import request from "supertest";
import {Assignment, ClassEnrollment, Student, StudentAssignment} from "../fixtures/types";

const feature = loadFeature(
    path.join(__dirname, "../features/assignStudentToAssignment.feature")
);

defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase();
    })

    test('Successfully assign student to assignment', ({given, and, when, then}) => {
        let enrollment: ClassEnrollment;
        let assignment: Assignment;
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

    test('Fail creation when when student is not enrolled in class', ({given, and, when, then}) => {
        let assignment: Assignment;
        let student: Student;
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

    test('Fail creation when student already has an assignment', ({given, when, then}) => {
        let assignment: AssignmentBuilder;
        let studentAssignment: StudentAssignment;
        let requestBody: any = {};
        let response: any = {};

        given('That the student is already assigned to the assignment', async () => {
            const student = new StudentBuilder().withName('John Doe').withEmail('jdoe123@email.com')
            const classroom = new ClassBuilder().withName('Math 301')
            const enrollment = await new ClassEnrollmentBuilder().withClass(classroom).withStudent(student).build();
            assignment = new AssignmentBuilder().withClassId(enrollment.classId).withTitle('Math Assignment')
            studentAssignment = await new StudentAssignmentBuilder().withAssignment(assignment).withStudentId(enrollment.studentId).build()
        });

        when('I try to assign the student to the assignment', async () => {
            requestBody = {
                studentId: studentAssignment.studentId,
                assignmentId: studentAssignment.assignmentId,
            }
            response = await request(app).post('/student-assignments').send(requestBody)
        });

        then('It will notify me that I cannot duplicate an assignment', () => {
            expect(response.status).toBe(409);
        });
    });

})