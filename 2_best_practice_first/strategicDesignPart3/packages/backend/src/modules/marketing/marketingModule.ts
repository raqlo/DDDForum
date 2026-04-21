import {Database} from "../../shared/database";
import {WebServer} from "../../shared/server";
import {MarketingController} from "./marketingController";
import {MarketingService} from "./marketingService";
import {ErrorExceptionHandler} from "../../shared/errors/errorHandler";
import {ContactListAPI} from "./contactListApi";

export class MarketingModule {
    private marketingController: MarketingController;
    private marketingService: MarketingService;
    private errorHandler: ErrorExceptionHandler;
    private contactListAPI: ContactListAPI;

    private constructor(private dbConnection: Database) {
        this.contactListAPI = this.createContactListApi()
        this.marketingService = this.createMarketingService(this.contactListAPI)
        this.errorHandler = this.createErrorHandler()
        this.marketingController = this.createMarketingController()
    }

    private createContactListApi() {
        return new ContactListAPI()
    }

    public getContactListApi() {
        return this.contactListAPI
    }

    static build = (dbConnection: Database) => {
        return new MarketingModule(dbConnection);
    };

    public getMarketingController = () => this.marketingController;

    public mountRouter = (webServer: WebServer) => {
        webServer.mountRouter("/marketing", this.marketingController.getRouter())
    };

    private createErrorHandler() {
        return this.errorHandler = new ErrorExceptionHandler();
    }

    private createMarketingController() {
        return new MarketingController(this.errorHandler, this.marketingService)
    }

    createMarketingService(contactListAPI: ContactListAPI) {
        return new MarketingService(contactListAPI, this.dbConnection.marketing)
    }
}