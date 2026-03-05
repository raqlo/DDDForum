import type {Context} from "hono";
import type {Post} from "../../generated/prisma/client";
import {PostModel} from "../models/postModel";

const ok = <T> (c: Context, data: T, status: 200 | 201 = 200) =>
    c.json({ error: undefined, data, success: true }, status)

const fail = (c: Context, error: string, status: 400 | 404 | 409 | 500) =>
    c.json({ error, data: undefined, success: false }, status)

export const PostController = {
    async getPosts(c: Context) {
        const postList = await PostModel.getPostList()
        return ok<Post[]>(c, postList)
    }
}

