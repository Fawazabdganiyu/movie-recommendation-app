import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/env.js';
import { DatabaseConnection } from './config';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { requestLogger } from './middleware/logger.middleware';

// Import routes
import apiRoutes from './routes';
import { initializeDatabase } from './utils/app/setup.util.js';

export class App {
  public app: Application;
  private isShuttingDown: boolean = false;

  constructor(private dbConnection: DatabaseConnection) {
    this.app = express();
    this.dbConnection = dbConnection;
    this.initializeGracefulShutdown();
    initializeDatabase(this.dbConnection);
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware - helmet for security headers
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:', '*.tmdb.org'],
            connectSrc: ["'self'", '*.tmdb.org'],
          },
        },
        crossOriginEmbedderPolicy: false,
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
      })
    );

    // CORS configuration with environment-specific origins
    const corsOptions = {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        const allowedOrigins = config.server.corsOrigin;

        if (
          allowedOrigins.includes(origin) ||
          config.server.nodeEnv === 'development'
        ) {
          return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      optionsSuccessStatus: 200,
    };

    this.app.use(cors(corsOptions));

    // Rate limiting with different tiers
    const createRateLimit = (
      windowMs: number,
      max: number,
      message: string
    ) => {
      return rateLimit({
        windowMs,
        max: config.server.nodeEnv === 'production' ? max : max * 10, // More lenient in dev
        message: {
          success: false,
          error: message,
          retryAfter: Math.ceil(windowMs / 1000),
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req: Request, res: Response) => {
          res.status(429).json({
            success: false,
            error: message,
            retryAfter: Math.ceil(windowMs / 1000),
          });
        },
      });
    };

    // General API rate limiting
    this.app.use(
      '/api',
      createRateLimit(
        15 * 60 * 1000, // 15 minutes
        100, // 100 requests per window
        'Too many requests from this IP, please try again later.'
      )
    );

    // Stricter rate limiting for authentication endpoints
    this.app.use(
      '/api/auth',
      createRateLimit(
        15 * 60 * 1000, // 15 minutes
        10, // 10 attempts per window
        'Too many authentication attempts, please try again later.'
      )
    );

    // Very strict rate limiting for password reset
    this.app.use(
      '/api/auth/forgot-password',
      createRateLimit(
        60 * 60 * 1000, // 1 hour
        3, // 3 attempts per hour
        'Too many password reset attempts, please try again later.'
      )
    );

    // Compression middleware for response optimization
    this.app.use(
      compression({
        filter: (req, res) => {
          if (req.headers['x-no-compression']) {
            return false;
          }
          return compression.filter(req, res);
        },
        level: 6,
        threshold: 1024, // Only compress responses > 1KB
      })
    );

    // Request logging based on environment
    if (config.server.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(
        morgan('combined', {
          skip: (_req, res) => res.statusCode < 400, // Only log errors in production
        })
      );
    }

    // Custom request logger for analytics
    this.app.use(requestLogger);

    // Body parsing middleware with size limits and validation
    this.app.use(
      express.json({
        limit: '10mb',
        verify: (
          _req: Request,
          _res: Response,
          buf: Buffer,
          _encoding: string
        ) => {
          try {
            JSON.parse(buf.toString());
          } catch (e) {
            const error = new Error('Invalid JSON payload');
            (error as any).statusCode = 400;
            throw error;
          }
        },
      })
    );

    this.app.use(
      express.urlencoded({
        extended: true,
        limit: '10mb',
        parameterLimit: 20, // Limit number of parameters
      })
    );

    // Trust proxy settings for production deployment
    if (config.server.nodeEnv === 'production') {
      this.app.set('trust proxy', 1);
    }

    // Security: Disable x-powered-by header
    this.app.disable('x-powered-by');

    // Prevent parameter pollution
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      // Ensure query parameters are not arrays (prevent parameter pollution)
      for (const key in req.query) {
        if (Array.isArray(req.query[key])) {
          req.query[key] = (req.query[key] as string[])[0];
        }
      }
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check endpoint with detailed information
    this.app.get('/health', (_req: Request, res: Response) => {
      const healthData = {
        status: 'OK',
        message: 'Movie Recommendation API is running',
        timestamp: new Date().toISOString(),
        environment: config.server.nodeEnv,
        version: process.env.npm_package_version || '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        database: this.dbConnection.getConnectionStatus()
          ? 'Connected'
          : 'Disconnected',
      };

      // Remove sensitive info in production
      // if (config.server.nodeEnv === 'production') {
      //   delete healthData['memory'];
      // }

      res.status(200).json(healthData);
    });

    // API status endpoint
    this.app.get('/api/status', (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Movie Recommendation API',
        version: '1.0.0',
        endpoints: {
          authentication: '/api/auth',
          users: '/api/users',
          movies: '/api/movies',
          health: '/health',
        },
      });
    });

    // API routes with versioning support
    this.app.use('/api', apiRoutes);
    // this.app.use('/api/users', userRoutes);
    // this.app.use('/api/movies', movieRoutes);

    // Root route
    this.app.get('/', (_req: Request, res: Response) => {
      res.json({
        message: 'Welcome to Movie Recommendation API',
        version: '1.0.0',
        documentation:
          config.server.nodeEnv === 'development' ? '/api/docs' : null,
        health: '/health',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler for undefined routes
    this.app.use(notFoundHandler);

    // Global error handler (must be last middleware)
    this.app.use(errorHandler);

    // Handle process exceptions
    process.on('uncaughtException', (err: Error) => {
      console.error('🚨 UNCAUGHT EXCEPTION! Shutting down...');
      console.error('Error:', err.name, err.message);
      console.error('Stack:', err.stack);
      this.gracefulShutdown(1);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.error('🚨 UNHANDLED REJECTION! Shutting down...');
      console.error('Error:', err.name, err.message);
      this.gracefulShutdown(1);
    });
  }

  private initializeGracefulShutdown(): void {
    const gracefulShutdown = (signal: string) => {
      console.log(`👋 ${signal} RECEIVED. Shutting down gracefully...`);
      this.gracefulShutdown(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }

  private async gracefulShutdown(exitCode: number): Promise<void> {
    if (this.isShuttingDown) {
      console.log('⏳ Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;

    try {
      // Close database connection
      await this.dbConnection.disconnect();
      console.log('✅ Database disconnected');

      console.log('💀 Process terminated gracefully');
      process.exit(exitCode);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }

  public async close(): Promise<void> {
    await this.gracefulShutdown(0);
  }
}

export default App;
