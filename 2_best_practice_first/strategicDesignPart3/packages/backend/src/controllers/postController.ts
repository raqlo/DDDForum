// Get posts
import express, {Request, Response} from "express";
import {Errors} from "../shared/errors/constants";
import {prisma} from "../database";
import {ErrorExceptionHandler} from "../shared/errors/errorHandler";
import {ClientError} from "../shared/errors/exceptions";

export class PostController {
    private router: express.Router;
    constructor( private errorHandler: ErrorExceptionHandler ) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    getRouter() {
        return this.router;
    }

    getPosts = async (req: Request, res: Response, next: express.NextFunction) => {
        try {
            const {sort} = req.query;

            if (sort !== 'recent') {
                throw new ClientError('as')
            }

            let postsWithVotes = await prisma.post.findMany({
                include: {
                    votes: true, // Include associated votes for each post
                    memberPostedBy: {
                        include: {
                            user: true
                        }
                    },
                    comments: true
                },
                orderBy: {
                    dateCreated: 'desc', // Sorts by dateCreated in descending order
                },
            });

            return res.json({error: undefined, data: {posts: postsWithVotes}, success: true});
        } catch (error) {
            next(error);
        }
    };

    private setupRoutes() {
        this.router.get("/", this.getPosts);
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler.handle);
    }
}