// Create a new user
import express, {NextFunction, Request, Response} from "express";
import {prisma} from "../database";
import {generateRandomPassword, isMissingKeys, parseUserForResponse} from "../shared/utils";
import {ErrorExceptionHandler} from "../shared/errors/errorHandler";
import {
    EmailAlreadyInUse,
    UsernameAlreadyTaken,
    UserNotFoundException,
    ValidationError
} from "../shared/errors/exceptions";


export class UserController {
    private router: express.Router;

    constructor(private errorHandler: ErrorExceptionHandler) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    getRouter() {
        return this.router;
    }

    private setupRoutes() {
        this.router.post("/new", this.createUserAccount);
        this.router.get("/", this.getUsers);
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler.handle);
    }

    createUserAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const keyIsMissing = isMissingKeys(req.body,
                ['email', 'firstName', 'lastName', 'username']
            );

            if (keyIsMissing) {
                throw new ValidationError()
            }

            const userData = req.body;

            const existingUserByEmail = await prisma.user.findFirst({where: {email: req.body.email}});
            if (existingUserByEmail) {
                throw new EmailAlreadyInUse()
            }

            const existingUserByUsername = await prisma.user.findFirst({where: {username: req.body.username as string}});
            if (existingUserByUsername) {
                throw new UsernameAlreadyTaken()
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
            next(error);
        }
    };
    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            if (email === undefined) {
                throw new ValidationError()
            }

            const user = await prisma.user.findUnique({where: {email}});
            if (!user) {
                throw new UserNotFoundException()
            }

            return res.status(200).json({error: undefined, data: parseUserForResponse(user), succes: true});
        } catch (error) {
            next(error);
        }
    };
}