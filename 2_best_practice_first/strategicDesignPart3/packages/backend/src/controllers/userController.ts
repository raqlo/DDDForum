// Create a new user
import express, {NextFunction, Request, Response} from "express";
import {prisma} from "../database";
import {generateRandomPassword, parseUserForResponse} from "../shared/utils";
import {ErrorExceptionHandler} from "../shared/errors/errorHandler";
import {
    EmailAlreadyInUse,
    UsernameAlreadyTaken,
    UserNotFoundException,
    ValidationError
} from "../shared/errors/exceptions";
import {CreateUserDto} from "../dtos/createUser.dto";
import { UserService} from "../services/userService";


export class UserController {
    private router: express.Router;

    constructor(private errorHandler: ErrorExceptionHandler, private userService: UserService) {
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
            const userData = CreateUserDto.fromRequest(req.body);
            const existingUserByEmail = await this.userService.getUserByEmail(userData.email);
            if (existingUserByEmail) {
                throw new EmailAlreadyInUse()
            }
            const existingUserByUsername = await this.userService.getUserByUsername(userData.username);
            if (existingUserByUsername) {
                throw new UsernameAlreadyTaken()
            }


            const {user, member} = await prisma.$transaction(async (tx) => {
                const user = await prisma.user.create({
                    data: {
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        username: userData.username,
                        password: generateRandomPassword(10)
                    }
                });
                const member = await this.userService.getMember(user.id);
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

            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new UserNotFoundException()
            }

            return res.status(200).json({error: undefined, data: parseUserForResponse(user), succes: true});
        } catch (error) {
            next(error);
        }
    };
}