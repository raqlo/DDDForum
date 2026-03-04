import {prisma} from "../../prisma/prisma-client";

export const PostModel = {
    async getPostList(sort?: string) {
        let orderBy: any = { dateCreated: 'desc' };

        if (sort === 'recent') {
            orderBy = { dateCreated: 'desc' };
        } else if (sort === 'oldest') {
            orderBy = { dateCreated: 'asc' };
        }

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
            orderBy
        })
    }
}

