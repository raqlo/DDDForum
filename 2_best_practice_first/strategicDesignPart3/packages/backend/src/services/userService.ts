import {PrismaClient} from "@prisma/client";
import {prisma} from "../database";


export class UserService {
    private connection: PrismaClient;

    constructor(db: PrismaClient) {
        this.connection = db
    }

    getUserByEmail = async (email: string) => await this.connection.user.findFirst({where: {email}});

    getUserByUsername = async (username: string) => await this.connection.user.findFirst({where: {username}});

    getMember = async (userId: number) => await prisma.member.create({data: {userId}});
}

