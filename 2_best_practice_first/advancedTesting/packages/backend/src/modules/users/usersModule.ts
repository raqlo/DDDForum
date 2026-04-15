import { UsersController } from "./usersController";
import type { Database } from "../../shared/database";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { WebServer } from "../../shared/http/webServer";
import {IUsersService, UsersService} from "./usersService";
import { userErrorHandler } from "./usersErrors";
import {ProductionUserRepository} from "./adapters/productionUserRepository";
import {UsersRepository} from "./ports/usersRepo";
import { User, ValidatedUser } from "@dddforum/shared/src/api/users";

class InMemoryUserRepositorySpy implements UsersRepository {
    findUserByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    save(user: ValidatedUser): Promise<User> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    delete(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findUserByUsername(username: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    update(id: number, props: Partial<ValidatedUser>): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
}

export class UsersModule {
  private usersService: UsersService;
  private usersController: UsersController;
  private usersRepository: UsersRepository;
  private shouldBuildFakeRepository: boolean;

  private constructor(
    private dbConnection: Database,
    private emailAPI: TransactionalEmailAPI,
  ) {
    this.shouldBuildFakeRepository = false;
    this.usersRepository = this.createUsersRepository();
    this.usersService = this.createUsersService(this.usersRepository);
    this.usersController = this.createUsersController(this.usersService);
  }

  static build(dbConnection: Database, emailAPI: TransactionalEmailAPI) {
    return new UsersModule(dbConnection, emailAPI);
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
}
