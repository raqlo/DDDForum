import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {ClassBuilder, Classroom} from "../fixtures/classBuilder";
import request from "supertest";
import {app} from "../../src";
import {resetDatabase} from "../fixtures/reset";
import {Assignment, AssignmentBuilder} from "../fixtures/assignmentBuilder";


const feature = loadFeature(
    path.join(__dirname, "../features/createAssignment.feature")
);

defineFeature(feature, (test) => {
    beforeAll(async () => {
        await resetDatabase();
    })

    test('Successfully create a new assignment', ({given, when, then}) => {
        let classroom: Classroom;
        let result: any = {};
        let requestBody: any = {};

        given(/^I have a class room named "(.*)"$/, async (classroomName) => {
            classroom = await new ClassBuilder()
                .withName(classroomName)
                .build();
        });

        when(/^I create a new "(.*)" assignment for the class$/, async (assignmentTitle) => {
            requestBody = {
                title: assignmentTitle,
                classId: classroom.id,
            }
            result = await request(app).post("/assignments").send(requestBody)
        });

        then('The assignment should be created for the class', () => {
            expect(result.status).toBe(201);
            expect(result.body.data.classId).toBe(requestBody.classId);
        });
    });

    test('Fail to create new assignment because of missing fields', ({given, when, then}) => {
        let classroom: Classroom;
        let result: any = {};
        let requestBody: any = {};

        given(/^I have a class room named "(.*)"$/, async (classroomName) => {
            classroom = await new ClassBuilder()
                .withName(classroomName)
                .build();
        });

        when('I create an assignment with no name', async () => {
            requestBody = {
                classId: classroom.id,
            }
            result = await request(app).post("/assignments").send(requestBody);
        });

        then('I wont be able to create an assignment', () => {
            expect(result.status).toBe(400);
        });
    });

    test('Successfully create assignment with same class and name', ({ given, and, when, then }) => {
        let classroom: Classroom;
        let assignment: Assignment;
        let result: any = {};
        let requestBody: any = {};

        given(/^I have a class room named "(.*)"$/, async (classroomName) => {
            classroom = await new ClassBuilder().withName(classroomName).build();
        });

        and(/^An "(.*)"assignment exists for the class$/, async (assignmentTitle) => {
            assignment = await new AssignmentBuilder()
                .withTitle(assignmentTitle)
                .withClassId(classroom.id)
                .build();
        });

        when('I create an assignment with the same name', async () => {
            requestBody = {
                title: assignment.title,
                classId: classroom.id,
            }
            result = await request(app).post("/assignments").send(requestBody);
        });

        then('A new assignment would be created', () => {
            expect(result.status).toBe(201);
            expect(result.body.data.title).toBe(requestBody.title);
            expect(result.body.data.classId).toBe(requestBody.classId);
        });
    });

})