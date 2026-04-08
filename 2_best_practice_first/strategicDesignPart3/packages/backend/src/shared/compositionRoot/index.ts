import express from 'express';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../database';

import { ErrorExceptionHandler } from '../errors/errorHandler';
import { Database } from '../database';
import { WebServer } from '../server';
import { Config } from '../config';
import { ContactListAPI } from '../../services/contactListApi';
import { TransactionalEmailApi } from '../../services/transactionalEmailApi';
import { UserService } from '../../services/userService';
import { MarketingService } from '../../services/marketingService';
import { PostService } from '../../services/postService';
import { UserController } from '../../controllers/userController';
import { MarketingController } from '../../controllers/marketingController';
import { PostController } from '../../controllers/postController';

export class CompositionRoot {
    private static instance: CompositionRoot | null = null;

    private prismaClient: PrismaClient;
    private errorHandler: ErrorExceptionHandler;
    private config: Config;
    private database: Database;
    private webServer: WebServer;

    private contactListAPI: ContactListAPI;
    private transactionalEmailApi: TransactionalEmailApi;
    private userService: UserService;
    private marketingService: MarketingService;
    private postService: PostService;

    public static getInstance(port: number = 3000): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot(port);
        }
        return CompositionRoot.instance;
    }


    private constructor(private port: number) {
        // Infra (no dependencies)
        this.config = new Config('start');
        this.prismaClient = prisma;
        this.errorHandler = new ErrorExceptionHandler();

        // Database facade (depends on Prisma)
        this.database = new Database(this.prismaClient);

        // External Services (no dependencies)
        this.contactListAPI = new ContactListAPI();
        this.transactionalEmailApi = new TransactionalEmailApi();

        // Business Services (depend on database facade + external services)
        this.userService = new UserService(this.database.users, this.transactionalEmailApi);
        this.marketingService = new MarketingService(this.contactListAPI, this.database.marketing);
        this.postService = new PostService(this.database.posts);

        // WebServer (created but not started)
        this.webServer = this.createWebServer();
    }


    private getUserService(): UserService {
        return this.userService;
    }

    private getMarketingService(): MarketingService {
        return this.marketingService;
    }

    private getPostService(): PostService {
        return this.postService;
    }

    private getErrorHandler(): ErrorExceptionHandler {
        return this.errorHandler;
    }

    /**
     * Create controllers - these are leaf nodes in the dependency graph
     * Controllers depend on services but nothing depends on controllers
     * That's why they're created in a method, not in the constructor
     */
    private createControllers() {
        const userService = this.getUserService();
        const marketingService = this.getMarketingService();
        const postService = this.getPostService();
        const errorHandler = this.getErrorHandler();

        const userController = new UserController(errorHandler, userService);
        const marketingController = new MarketingController(errorHandler, marketingService);
        const postController = new PostController(errorHandler, postService);

        return {
            userController,
            marketingController,
            postController,
        };
    }

    /**
     * Creates the Express app and wires up routes to controllers
     */
    private createExpressApp(): express.Application {
        const cors = require('cors');
        const app = express();

        // Middleware
        app.use(express.json());
        app.use(cors());

        // Get all controllers
        const controllers = this.createControllers();

        // Mount routes
        app.use('/users', controllers.userController.getRouter());
        app.use('/marketing', controllers.marketingController.getRouter());
        app.use('/posts', controllers.postController.getRouter());

        return app;
    }


    private createWebServer(): WebServer {
        const app = this.createExpressApp();
        return new WebServer(
            { port: this.port, env: this.config.env },
            app
        );
    }


    public getWebServer(): WebServer {
        return this.webServer;
    }

    /**
     * Get the Express app (useful for testing without starting server)
     */
    public getApp(): express.Application {
        return this.webServer.getApp();
    }

    /**
     * Get database connection (useful for testing/cleanup)
     */
    public getDatabase(): Database {
        return this.database;
    }

    /**
     * Get Prisma client (useful for migrations/cleanup)
     */
    public getPrismaClient(): PrismaClient {
        return this.prismaClient;
    }
}
