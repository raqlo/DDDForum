import { Database } from "../../shared/database";
import { WebServer } from "../../shared/http/webServer";
import { PostsController } from "./postsController";
import { postsErrorHandler } from "./postsErrors";
import { PostsService } from "./postsService";
import {PostsRepository} from "./ports/postsRepository";

export class PostsModule {
  // private postsRepository: PostsRepository;
  private postsService: PostsService;
  private postsController: PostsController;

  private constructor(private dbConnection: Database) {
    this.postsService = this.createPostsService();
    this.postsController = this.createPostsController();

  }

  static build(dbConnection: Database) {
    return new PostsModule(dbConnection);
  }

  private createPostsService() {
    return new PostsService(this.dbConnection);
  }

  private createPostsController() {
    return new PostsController(this.postsService, postsErrorHandler);
  }

  public getPostsController() {
    return this.postsController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/posts", this.postsController.getRouter());
  }

  public getPostsService() {
    return this.postsService;
  }

  getPostsRepository() {
    return this.dbConnection.posts;
  }
}
