import express, {NextFunction, Request, Response} from "express";
import {prisma} from "../../database";
import {UserNotFoundException} from "../../shared/errors/exceptions";
import {ErrorExceptionHandler} from "../../shared/errors/errorHandler";
import {MarketingService} from "./marketingService";
import {CreateMarketingRecordDto} from "./createMarketingRecord.dto";

export class MarketingController {
    private router: express.Router;

    constructor(private errorHandler: ErrorExceptionHandler, private marketingService: MarketingService) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    addUserToMarketingList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = CreateMarketingRecordDto.fromRequest(req.body);

            const {userId, consent} = dto;

            // Find the user by id
            const user = await prisma.user.findFirst({where: {id: userId}});

            if (!user) {
                throw new UserNotFoundException()
            }

            // Create marketing record and sync with external email service
            const marketing = await this.marketingService.createMarketingRecord({
                userId,
                consent,
                email: user.email
            })
            return res.status(201).json({error: undefined, data: marketing, success: true});
        } catch (error) {
            next(error);
        }
    }

    getRouter() {
        return this.router;
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler.handle);
    }

    private setupRoutes() {
        this.router.post("/new", this.addUserToMarketingList);
    }
}
