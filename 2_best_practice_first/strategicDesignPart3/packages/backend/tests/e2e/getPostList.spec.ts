import {defineFeature, loadFeature} from 'jest-cucumber';
import path from 'path';
import {UserBuilder} from "../../../shared/tests/fixtures/userBuilder";
import {PostBuilder} from "../../../shared/tests/fixtures/postBuilder";
import request from 'supertest';
import {app} from "@dddforum/backend/src";
import {DatabaseFixture} from "../../../shared/tests/fixtures/databaseFixture";
import {prisma} from "@dddforum/backend/src/database";
import {response} from "express";


const feature = loadFeature(path.join(__dirname, '../../../shared/tests/features/getPostList.feature'));


defineFeature(feature, (test) => {
    const databaseFixture = new DatabaseFixture();

    beforeEach(async () => {
        await databaseFixture.resetDatabase()
    })

    test('Successfully obtain post list', ({given, when, then}) => {
        let getPostsResponse: any;
        let createdPosts: any[] = [];

        given('that I have a few post created', async () => {
            // First create a user to get a member
            const {user, member} = await new UserBuilder()
                .withAllRandomDetails()
                .build();
            const post1 = await new PostBuilder().withAllRandomDetails(member.id).build()
            const post2 = await new PostBuilder().withAllRandomDetails(member.id).build()
            const post3 = await new PostBuilder().withAllRandomDetails(member.id).build()
            const post4 = await new PostBuilder().withAllRandomDetails(member.id).build()


            createdPosts = [post1, post2, post3, post4];
        });

        when('I try to get them', async () => {
            getPostsResponse = await request(app)
                .get('/posts')
                .query({sort: 'recent'}).send();
        });

        then('I will get a sorted lists of posts', () => {
            expect(getPostsResponse.status).toBe(200);
            expect(getPostsResponse.body.data.posts.length).toBe(4);
        })
    });

    test('Missing query keys', ({given, when, then}) => {
        let response: any = {}
        when('I try to look for the post list without a sort attribute', async () => {
            response = await request(app).get(`/posts`).send()
        });

        then('I get a validation error', () => {
            expect(response.status).toBe(400);
        });
    });
})