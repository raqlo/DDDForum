import {prisma} from "../../prisma/prisma-client";

export const PostModel = {
    async getPostList() {
        return prisma.post.findMany()
    }
}