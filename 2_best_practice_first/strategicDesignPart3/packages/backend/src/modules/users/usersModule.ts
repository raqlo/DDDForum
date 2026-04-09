import {Database} from "../../shared/database";
import {UserService} from "./userService";
import {ErrorExceptionHandler} from "../../shared/errors/errorHandler";
import {UserController} from "./userController";
import {TransactionalEmailApi} from "../notifications/transactionalEmailApi";

export class UsersModule {
    private usersService: UserService;
    private errorHandler: ErrorExceptionHandler;
    private usersController: UserController;

    private constructor(private dbConnection: Database, private emailAPI: TransactionalEmailApi)
    {
        this.usersService = this.createUserService()
        this.errorHandler = this.createErrorHandler()

        this.usersController = this.createUsersController()
    }

    static build(dbConnection: Database, emailAPI: TransactionalEmailApi) {
        return new UsersModule(dbConnection, emailAPI)
    }

    private createUserService() {
        return new UserService(this.dbConnection.users, this.emailAPI);
    }

    private createErrorHandler() {
        return new ErrorExceptionHandler();
    }

    private createUsersController() {
        return new UserController(this.errorHandler, this.usersService)
    }

    public getUsersController = () => this.usersController;
}