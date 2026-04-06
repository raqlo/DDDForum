import express, {Request, Response} from "express";
import {isMissingKeys} from "../shared/utils";
import {prisma} from "../database";
import {InvalidRequestBodyException, UserNotFoundException} from "../shared/errors/exceptions";
import {ErrorExceptionHandler} from "../shared/errors/errorHandler";

export class MarketingController {
    private router: express.Router;
    constructor( private errorHandler: ErrorExceptionHandler ) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    addUserToMarketingList = async (req: Request, res: Response) => {
        const keyIsMissing = isMissingKeys(req.body,
            ['userId', 'consent']
        );

        if (keyIsMissing) {
            throw new InvalidRequestBodyException()
        }

        const {userId, consent} = req.body;

        // Find the user by email
        const user = await prisma.user.findFirst({where: {id: userId}});

        if (!user) {
            throw new UserNotFoundException()
        }

        // Create marketing record with userId, not email
        const marketing = await prisma.marketing.create({
            data: {
                userId: userId,  // ✅ Use userId instead of email
                consent: consent
            }
        })
        return res.status(201).json({error: undefined, data: marketing, success: true});
    }

    getRouter() {
        return this.router;
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler.handle);
    }

    private setupRoutes() {
        this.router.post("/", this.addUserToMarketingList);
    }
}
