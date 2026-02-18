import type { Context } from 'hono'
import type { User } from '../../generated/prisma/client'
import { UserModel } from '../models/userModel'

const ok = (c: Context, data: Partial<User>, status: 200 | 201 = 200) =>
    c.json({ error: undefined, data, success: true }, status)

const fail = (c: Context, error: string, status: 400 | 404 | 409 | 500) =>
    c.json({ error, data: undefined, success: false }, status)

const omitPassword = ({ password: _, ...user }: User) => user

export const UserController = {
    async createUser(c: Context) {
        try {
            const { email, username, name, lastName, password } = await c.req.json() as Pick<User, 'email' | 'username' | 'name' | 'lastName' | 'password'>

            if (!email || !username || !name || !lastName || !password)
                return fail(c, 'ValidationError', 400)

            if (await UserModel.getUserByUsername(username))
                return fail(c, 'UsernameAlreadyTaken', 409)

            if (await UserModel.getUserByEmail(email))
                return fail(c, 'EmailAlreadyInUse', 409)

            const user = await UserModel.createUser({ email, username, name, lastName, password })
            return ok(c, omitPassword(user), 201)

        } catch {
            return fail(c, 'ServerError', 500)
        }
    },

    async editUser(c: Context) {
        try {
            const userId = Number(c.req.param('userId'))
            const { email, username, name, lastName } = await c.req.json() as Pick<User, 'email' | 'username' | 'name' | 'lastName'>

            if (!email || !username || !name || !lastName)
                return fail(c, 'ValidationError', 400)

            if (!await UserModel.getUserById(userId))
                return fail(c, 'UserNotFound', 404)

            const takenUsername = await UserModel.getUserByUsername(username)
            if (takenUsername && takenUsername.id !== userId)
                return fail(c, 'UsernameAlreadyTaken', 409)

            const takenEmail = await UserModel.getUserByEmail(email)
            if (takenEmail && takenEmail.id !== userId)
                return fail(c, 'EmailAlreadyInUse', 409)

            const user = await UserModel.updateUser(userId, { email, username, name, lastName })
            return ok(c, omitPassword(user))

        } catch {
            return fail(c, 'ServerError', 500)
        }
    },

    async getUser(c: Context) {
        try {
            const email: string = c.req.query('email') ?? ''

            if (!email)
                return fail(c, 'ValidationError', 400)

            const user = await UserModel.getUserByEmail(email)
            return user ? ok(c, omitPassword(user)) : fail(c, 'UserNotFound', 404)

        } catch {
            return fail(c, 'ServerError', 500)
        }
    }
}