import express from 'express';
import { Server } from 'http';
import { Environment } from '../config';

export interface WebServerConfig {
    port: number;
    env: Environment;
}

export class WebServer {
    private server: Server | null = null;
    private readonly port: number;
    private readonly env: Environment;
    private readonly app: express.Application;

    constructor(config: WebServerConfig, app: express.Application) {
        this.port = config.port;
        this.env = config.env;
        this.app = app;
    }

    /**
     * Start the HTTP server
     * Returns a promise that resolves when server is listening
     */
    public async start(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.port, () => {
                    console.log(`Server running on port ${this.port} in ${this.env} mode`);
                    resolve();
                });

                this.server.on('error', (error: NodeJS.ErrnoException) => {
                    if (error.code === 'EADDRINUSE') {
                        console.error(`Port ${this.port} is already in use`);
                    } else {
                        console.error('Server error:', error);
                    }
                    reject(error);
                });

                this.registerShutdownHandlers();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Stop the HTTP server gracefully
     * - Stops accepting new connections
     * - Waits for existing connections to complete
     * - Closes server
     */
    public async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.server) {
                console.log('Server is not running');
                resolve();
                return;
            }

            console.log('Shutting down server gracefully...');

            this.server.close((error) => {
                if (error) {
                    console.error('Error during server shutdown:', error);
                    reject(error);
                } else {
                    console.log('Server shut down successfully');
                    this.server = null;
                    resolve();
                }
            });

            // Force close after timeout (10 seconds)
            setTimeout(() => {
                if (this.server) {
                    console.warn('Forcing server shutdown after timeout');
                    this.server = null;
                    resolve();
                }
            }, 10000);
        });
    }

    /**
     * Register handlers for graceful shutdown on SIGTERM and SIGINT
     * This ensures proper cleanup when process is terminated
     */
    private registerShutdownHandlers(): void {
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n Received ${signal}, starting graceful shutdown...`);
            try {
                await this.stop();
                process.exit(0);
            } catch (error) {
                console.error('Error during graceful shutdown:', error);
                process.exit(1);
            }
        };

        // Handle SIGTERM (docker, kubernetes, etc.)
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

        // Handle SIGINT (Ctrl+C)
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }

    /**
     * Check if server is currently running
     */
    public isRunning(): boolean {
        return this.server !== null && this.server.listening;
    }

    /**
     * Get the current port
     */
    public getPort(): number {
        return this.port;
    }

    /**
     * Get the Express app instance (useful for testing)
     */
    public getApp(): express.Application {
        return this.app;
    }
}
