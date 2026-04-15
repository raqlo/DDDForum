import { UsersController } from "./usersController";
import { Database } from "../../shared/database";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { WebServer } from "../../shared/http/webServer";
import { UsersService } from "./usersService";
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
  private usersRepository: InMemoryUserRepositorySpy;
  private shouldBuildFakeRepository: boolean;

  private constructor(
    private dbConnection: Database,
    private emailAPI: TransactionalEmailAPI,
  ) {
    this.usersService = this.createUsersService();
    this.usersController = this.createUsersController();
    this.usersRepository = this.createUsersRepository();
    this.shouldBuildFakeRepository = false

  }

  static build(dbConnection: Database, emailAPI: TransactionalEmailAPI) {
    return new UsersModule(dbConnection, emailAPI);
  }

  private createUsersService() {
    return new UsersService(this.usersRepository, this.emailAPI);
  }

  private createUsersController() {
    return new UsersController(this.usersService, userErrorHandler);
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
