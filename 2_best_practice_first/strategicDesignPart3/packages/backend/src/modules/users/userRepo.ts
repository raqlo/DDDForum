import {PrismaClient} from "@prisma/client";
import {prisma} from "../../database";
import {generateRandomPassword} from "../../shared/utils";
import {User} from "./createUser.dto";

export interface UserPersistence {
    createUser(userData: User): Promise<any>;

    findByEmail(email: string): Promise<any>;

    findByUsername(username: string): Promise<any>;

    createMember(userId: number): Promise<any>;
}

export class UserRepository implements UserPersistence {
    constructor(private db: PrismaClient) {
    }

    createUser(userData: User) {
        return prisma.$transaction(async (tx) => {
            return prisma.user.create({
                data: {
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    username: userData.username,
                    password: generateRandomPassword(10)
                }
            });
        })
    }

    findByEmail(email: string) {
        return this.db.user.findFirst({where: {email}});
    }

    findByUsername(username: string) {
        return this.db.user.findFirst({where: {username}});
    }

    createMember(userId: number) {
        return prisma.member.create({data: {userId}});
    }
}