import {PrismaClient} from "@prisma/client";
import {prisma} from "../../../backend/src/database"

export class DatabaseFixture {
    private connection: PrismaClient;

    constructor() {
        this.connection = prisma
    }

    async resetDatabase() {
        const deleteAllComments = this.connection.comment.deleteMany();
        const deleteAllVotes = this.connection.vote.deleteMany();
        const deleteAllPosts = this.connection.post.deleteMany();
        const deleteAllMarketing = this.connection.marketing.deleteMany();
        const deleteMembers = this.connection.member.deleteMany();
        const deleteAllUsers = this.connection.user.deleteMany();

        try {
            await this.connection.$transaction([
                deleteAllComments,
                deleteAllVotes,
                deleteAllPosts,
                deleteAllMarketing,
                deleteMembers,
                deleteAllUsers
            ]);
        } catch (error) {
            console.error(error);
        }
    }
}