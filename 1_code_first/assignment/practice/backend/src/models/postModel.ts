import {prisma} from "../../prisma/prisma-client";

export const PostModel = {
    async getPostList() {
        return prisma.post.findMany({
            include: {
                votes: true,
                comments: true,
                memberPostedBy: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                dateCreated: 'desc'
            }
        })
    }
}

