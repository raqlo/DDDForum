import {defineFeature, loadFeature} from "jest-cucumber";
import path from "path";
import {StudentBuilder} from "../fixtures/studentBuilder";
import request from "supertest";
import {app} from "../../src";
import {resetDatabase} from "../fixtures/reset";


const feature = loadFeature(
    path.join(__dirname, "../features/getStudentList.feature")
);

defineFeature(feature, test => {
    beforeEach(async () => {
        await resetDatabase()
    })

    test('Get Student List', ({given, when, then}) => {
        let response: any = {};

        given('I have a list of students', async () => {
            await new StudentBuilder().withName('John Dieo').withEmail('jdoe@email.com').build()
            await new StudentBuilder().withName('Maria Dieo').withEmail('mdoe@email.com').build()
        });

        when('I request a list of students', async () => {
            response = await request(app).get('/students');
        });

        then('I get shown a list of the students with ther classes and grades', () => {
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(2);
            expect(response.body.data).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        name: expect.any(String),
                        email: expect.any(String),
                        classes: expect.any(Array),
                        assignments: expect.any(Array),
                        reportCards: expect.any(Array),
                    })
                ])
            );
        });
    });
})