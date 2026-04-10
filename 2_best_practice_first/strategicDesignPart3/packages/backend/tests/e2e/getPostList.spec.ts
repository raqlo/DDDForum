import {defineFeature, loadFeature} from 'jest-cucumber';
import path from 'path';
import {UserBuilder} from "../../../shared/tests/fixtures/userBuilder";
import {PostBuilder} from "../../../shared/tests/fixtures/postBuilder";
import {DatabaseFixture} from "../../../shared/tests/fixtures/databaseFixture";
import {createAPIClient} from "@dddforum/shared/src/api";
import {GetPostsResponse} from "@dddforum/shared/src/api/posts";
import {CompositionRoot} from "@dddforum/backend/src/shared/compositionRoot";
import {WebServer} from "@dddforum/backend/src/shared/server";

const feature = loadFeature(path.join(__dirname, '../../../shared/tests/features/getPostList.feature'));

defineFeature(feature, (test) => {
    const databaseFixture = new DatabaseFixture();
    const apiClient = createAPIClient('http://localhost:3000');
    let server: WebServer;

    beforeAll(async () => {
        const compositionRoot = CompositionRoot.getInstance(3000);
        server = compositionRoot.getWebServer();
        await server.start();
    });

    afterAll(async () => {
        await server.stop();
    });

    beforeEach(async () => {
        await databaseFixture.resetDatabase()
    })

    test('Successfully obtain post list', ({given, when, then}) => {
        let getPostsResponse: GetPostsResponse;
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
            getPostsResponse = await apiClient.posts.getPosts("recent")
        });

        then('I will get a sorted lists of posts', () => {
            expect(getPostsResponse.success).toBeTruthy();
            expect(getPostsResponse.data.posts.length).toBe(4);
        })
    });

    test('Missing query keys', ({given, when, then}) => {
        let response: GetPostsResponse
        when('I try to look for the post list without a sort attribute', async () => {
            // @ts-ignore
            response = await apiClient.posts.getPosts("")
        });

        then('I get a validation error', () => {
            expect(response.success).toBeFalsy();
        });
    });
})