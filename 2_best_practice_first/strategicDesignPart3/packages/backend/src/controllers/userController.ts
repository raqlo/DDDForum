// Create a new user
import {Request, Response} from "express";
import {prisma} from "../database";
import {generateRandomPassword, isMissingKeys, parseUserForResponse} from "../shared/utils";
import {Errors} from "../shared/errors";


export class UserController {
    createUserAccount = async (req: Request, res: Response) => {
        try {
            const keyIsMissing = isMissingKeys(req.body,
                ['email', 'firstName', 'lastName', 'username']
            );

            if (keyIsMissing) {
                return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false})
            }

            const userData = req.body;

            const existingUserByEmail = await prisma.user.findFirst({where: {email: req.body.email}});
            if (existingUserByEmail) {
                return res.status(409).json({error: Errors.EmailAlreadyInUse, data: undefined, success: false})
            }

            const existingUserByUsername = await prisma.user.findFirst({where: {username: req.body.username as string}});
            if (existingUserByUsername) {
                return res.status(409).json({error: Errors.UsernameAlreadyTaken, data: undefined, success: false})
            }

            const {user, member} = await prisma.$transaction(async (tx) => {
                const user = await prisma.user.create({data: {...userData, password: generateRandomPassword(10)}});
                const member = await prisma.member.create({data: {userId: user.id}})
                return {user, member}
            })

            return res.status(201).json({error: undefined, data: parseUserForResponse(user), success: true});
        } catch (error) {
            console.log(error)
            // Return a failure error response
            return res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
    getUsers = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            if (email === undefined) {
                return res.status(400).json({error: Errors.ValidationError, data: undefined, success: false})
            }

            const user = await prisma.user.findUnique({where: {email}});
            if (!user) {
                return res.status(404).json({error: Errors.UserNotFound, data: undefined, success: false})
            }

            return res.status(200).json({error: undefined, data: parseUserForResponse(user), succes: true});
        } catch (error) {
            return res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    };
}