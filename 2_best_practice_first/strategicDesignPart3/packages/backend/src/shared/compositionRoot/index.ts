import express from 'express';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../database';

import { Database } from '../database';
import { WebServer } from '../server';
import { Config } from '../config';
import {PostsModule} from "../../modules/posts/postsModule";
import {UsersModule} from "../../modules/users/usersModule";
import {NotificationsModule} from "../../modules/notifications/notificationsModule";
import {MarketingModule} from "../../modules/marketing/marketingModule";

export class CompositionRoot {
    private static instance: CompositionRoot | null = null;

    private prismaClient: PrismaClient;
    private config: Config;
    private database: Database;
    private webServer: WebServer;

    private notificationsModule: NotificationsModule;
    private postsModule: PostsModule;
    private marketingModule: MarketingModule;
    private usersModule: UsersModule;

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
        // this.errorHandler = new ErrorExceptionHandler();

        // Database facade (depends on Prisma)
        this.database = new Database(this.prismaClient);

        // Modules (depends on database)
        this.notificationsModule = this.createNotificationsModule();
        this.postsModule = this.createPostsModule();
        this.marketingModule = this.createMarketingModule();
        this.usersModule = this.createUsersModule();

        // WebServer (created but not started)
        this.webServer = this.createWebServer();
        this.mountRoutes();
    }

    createNotificationsModule () {
        return NotificationsModule.build();
    }

    /**
     * Creates the Express app
     */
    private createExpressApp(): express.Application {
        const cors = require('cors');
        const app = express();

        // Middleware
        app.use(express.json());
        app.use(cors());

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

    private mountRoutes() {
        this.postsModule.mountRouter(this.webServer);
        this.marketingModule.mountRouter(this.webServer);
        this.usersModule.mountRouter(this.webServer);
    }

    private createPostsModule() {
        return PostsModule.build(this.database);
    }

    private createUsersModule() {
        return UsersModule.build(this.database, this.notificationsModule.getTransactionalEmailAPI());
    }

    private createMarketingModule() {
        return MarketingModule.build(this.database);
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
