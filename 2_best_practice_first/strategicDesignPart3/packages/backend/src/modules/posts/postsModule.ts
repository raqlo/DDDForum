import { Database } from "../../shared/database";
import { WebServer } from "../../shared/server";
import { PostController } from "./postController";
import { PostService } from "./postService";
import {ErrorExceptionHandler} from "../../shared/errors/errorHandler";

export class PostsModule {
    private postsService: PostService;
    private postsController: PostController;
    private errorHandler: ErrorExceptionHandler;


    private constructor(private dbConnection: Database) {
        this.postsService = this.createPostsService();
        this.errorHandler = this.createErrorHandler();

        this.postsController = this.createPostsController();
    }

    static build(dbConnection: Database) {
        return new PostsModule(dbConnection);
    }

    private createPostsService() {
        return new PostService(this.dbConnection.posts);
    }

    private createPostsController() {
        return new PostController(this.errorHandler, this.postsService);
    }

    private createErrorHandler() {
        return this.errorHandler = new ErrorExceptionHandler();
    }

    public getPostsController = () => this.postsController;

    public mountRouter = (webServer: WebServer) => {
        webServer.mountRouter("/posts", this.postsController.getRouter());
    };
}
