import {prisma} from "../../prisma/prisma-client";
import type {User} from "../../generated/prisma/client";


export const UserModel = {
    async createUser(data: Omit<User, 'id'>) {
        return prisma.user.create({ data })
    },

    async updateUser(userId: User['id'], data: Partial<Omit<User, 'id'>>) {
        return prisma.user.update({ where: { id: userId }, data })
    },

    async getUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } })
    },

    async getUserById(id: number) {
        return prisma.user.findUnique({ where: { id } })
    },

    async getUserByUsername(username: string) {
        return prisma.user.findUnique({ where: { username } })
    }
}