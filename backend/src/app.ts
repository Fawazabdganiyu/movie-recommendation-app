import express, { Application } from 'express';
import { DatabaseConnection } from './config';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware';
import {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from './utils/app/setup.util';

export class App {
  private static instance: App | null = null;
  public readonly app: Application;
  private isShuttingDown = false;
  private initialized = false;

  private constructor(private dbConnection: DatabaseConnection) {
    this.app = express();
    this.initializeGracefulShutdown();
  }

  // Explicit async bootstrap (no hidden async in constructor)
  public static async bootstrap(
    dbConnection: DatabaseConnection
  ): Promise<App> {
    if (!App.instance) {
      const inst = new App(dbConnection);
      await inst.init();
      App.instance = inst;
    }
    return App.instance;
  }

  private async init(): Promise<void> {
    if (this.initialized) return;
    await initializeDatabase(this.dbConnection);
    initializeMiddlewares(this.app);
    initializeRoutes(this.app, this.dbConnection);
    this.initializeErrorHandling();
    this.initialized = true;
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeGracefulShutdown(): void {
    const handle = (signal: string) => {
      console.log(`👋 ${signal} received. Starting graceful shutdown...`);
      void this.gracefulShutdown(0);
    };
    process.on('SIGTERM', () => handle('SIGTERM'));
    process.on('SIGINT', () => handle('SIGINT'));
  }

  private async gracefulShutdown(code: number): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;
    try {
      await this.dbConnection.disconnect();
      console.log('✅ Database disconnected');
      process.exit(code);
    } catch (err) {
      console.error('❌ Shutdown error:', err);
      process.exit(1);
    }
  }

  public getApp(): Application {
    if (!this.initialized)
      throw new Error('App not initialized. Call App.bootstrap() first.');
    return this.app;
  }

  public async close(): Promise<void> {
    await this.gracefulShutdown(0);
  }
}
