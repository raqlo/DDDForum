import { UsersController } from "./usersController";
import type { Database } from "../../shared/database";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { WebServer } from "../../shared/http";
import {IUsersService, UsersService} from "./usersService";
import { userErrorHandler } from "./usersErrors";
import {ProductionUserRepository} from "./adapters/productionUserRepository";
import {UsersRepository} from "./ports/usersRepo";
import {Config} from "../../shared/config";
import {InMemoryUserRepositorySpy} from "./adapters/inMemoryUserRepositorySpy";

export class UsersModule {
  private usersService: UsersService;
  private usersController: UsersController;
  private usersRepository: UsersRepository;

  private constructor(
    private dbConnection: Database,
    private emailAPI: TransactionalEmailAPI,
    private config: Config
  ) {
    this.usersRepository = this.createUsersRepository();
    this.usersService = this.createUsersService(this.usersRepository);
    this.usersController = this.createUsersController(this.usersService);
  }

  static build(dbConnection: Database, emailAPI: TransactionalEmailAPI, config: Config) {
    return new UsersModule(dbConnection, emailAPI, config);
  }

  private createUsersService(repository: UsersRepository) {
    return new UsersService(repository, this.emailAPI);
  }

  private createUsersController(userService: IUsersService) {
    return new UsersController(userService, userErrorHandler);
  }

  public getController() {
    return this.usersController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/users", this.usersController.getRouter());
  }

  private createUsersRepository() {
    if (this.usersRepository) return this.usersRepository;
    if (this.shouldBuildFakeRepository) {
      return new InMemoryUserRepositorySpy();
    }

    return new ProductionUserRepository(this.dbConnection.getConnection());
  }

  getUsersService() {
    return this.usersService;
  }

  getUsersRepository() {
    return this.usersRepository;
  }

  protected getEnvironment() {
    return this.config.getEnvironment();
  }

  protected getScript() {
    return this.config.getScript();
  }

  get shouldBuildFakeRepository() {
    return (
      this.getScript() === "test:unit" ||
      this.getEnvironment() === "development"
    );
  }
}
