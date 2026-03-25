import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {Assignment, AssignmentBuilder} from "../fixtures/assignmentBuilder";
import {ClassBuilder, Classroom} from "../fixtures/classBuilder";
import {resetDatabase} from "../fixtures/reset";
import request from "supertest";
import {app} from "../../src";


const feature = loadFeature(
    path.join(__dirname, "../features/getAssignmentById.feature")
);


defineFeature(feature, (test) => {
    beforeEach(async () => {
        await resetDatabase()
    })
    test('Obtain assignment when looking by id', ({given, when, then}) => {
        let classroom: Classroom;
        let assignment: Assignment;
        let result: any = {};

        given('That I have an assignment from a class', async () => {
            classroom = await new ClassBuilder().withName("Math 203").build();
            assignment = await new AssignmentBuilder()
                .withTitle("Math Assignment")
                .withClassId(classroom.id)
                .build();
        });

        when('I try to look for it', async () => {
            result = await request(app).get(`/assignments/${assignment.id}`)

        });

        then('I will obtain it', () => {
            expect(result.status).toBe(200);
            expect(result.body.data).toEqual(expect.objectContaining({
                id: assignment.id,
                title: expect.any(String),
                classId: expect.any(String),
                class: expect.objectContaining({id: classroom.id, name: classroom.name}),
                studentAssignments: expect.any(Array),
            }))
        });
    });

})