import {PrismaClient} from "@prisma/client";

export class PostRepository {
    private connection: PrismaClient;

    constructor(db: PrismaClient) {
        this.connection = db
    }

    findMany = async () => this.connection.post.findMany({
        include: {
            votes: true, // Include associated votes for each post
            memberPostedBy: {
                include: {
                    user: true
                }
            },
            comments: true
        },
        orderBy: {
            dateCreated: 'desc', // Sorts by dateCreated in descending order
        },
    });
}