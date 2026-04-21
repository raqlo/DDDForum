// Get posts
import express, {Request, Response} from "express";
import {ErrorExceptionHandler} from "../../shared/errors/errorHandler";
import {ClientError} from "../../shared/errors/exceptions";
import {PostService} from "./postService";

export class PostController {
    private router: express.Router;

    constructor(private errorHandler: ErrorExceptionHandler, private postService: PostService) {
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
                throw new ClientError()
            }

            let postsWithVotes = await this.postService.getPostsWithVotes();

            return res.json({error: undefined, data: {posts: postsWithVotes}, success: true});
        } catch (error) {
            next(error);
        }
    };

    private setupRoutes() {
        this.router.get("/", this.getPosts);
    }

    private setupErrorHandler = () => {
        this.router.use(this.errorHandler.handle);
    };
}