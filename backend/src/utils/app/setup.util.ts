import express, { Application } from 'express';
import { config, type DatabaseConnection } from '../../config';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import apiRoutes from '../../routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../config/swagger';

const apiPrefix = config.server.apiPrefix;

export const initializeDatabase = async (
  dbConnection: DatabaseConnection
): Promise<void> => {
  await dbConnection.connect();
  console.log('✅ Database connected');
};

export const initializeMiddlewares = (app: Application): void => {
  // Helmet (minimal; CSP optional to avoid dev friction)
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    })
  );
  if (config.server.nodeEnv === 'production') {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', '*.tmdb.org'],
          connectSrc: ["'self'", '*.tmdb.org'],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      })
    );
  }

  // CORS
  const allowList = config.server.corsOrigin;
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (
          allowList.includes(origin) ||
          config.server.nodeEnv === 'development'
        )
          return cb(null, true);
        return cb(new Error('CORS blocked'));
      },
      credentials: true,
      allowedHeaders: [
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      maxAge: 600,
    })
  );

  // Rate limit factory
  const mkLimiter = (
    path: string,
    windowMs: number,
    max: number,
    message: string
  ) =>
    app.use(
      path,
      rateLimit({
        windowMs,
        max:
          config.server.nodeEnv === 'production'
            ? max
            : max * 10 /* generous in dev */,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
          success: false,
          error: message,
        },
      })
    );

  mkLimiter('/api', 15 * 60 * 1000, 100, 'Too many requests. Try later.');
  mkLimiter(
    '/api/auth',
    15 * 60 * 1000,
    10,
    'Too many auth attempts. Try later.'
  );
  mkLimiter(
    '/api/auth/forgot-password',
    60 * 60 * 1000,
    3,
    'Too many reset attempts. Try later.'
  );

  // Compression
  app.use(
    compression({
      threshold: 1024,
    })
  );

  // Logging
  app.use(
    morgan(config.server.nodeEnv === 'development' ? 'dev' : 'combined', {
      skip:
        config.server.nodeEnv === 'production'
          ? (_req, res) => res.statusCode < 400
          : undefined,
    })
  );

  // Body parsing
  app.use(
    express.json({
      limit: '10mb',
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: '10mb',
      parameterLimit: 50,
    })
  );

  if (config.server.nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }

  app.disable('x-powered-by');

  // Basic query normalization
  app.use((req, _res, next) => {
    for (const k of Object.keys(req.query)) {
      if (Array.isArray(req.query[k])) {
        req.query[k] = (req.query[k] as string[])[0];
      }
    }
    next();
  });
};

export const initializeRoutes = (
  app: Application,
  dbConnection: DatabaseConnection
): void => {
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'OK',
      ts: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      db: dbConnection.getConnectionStatus() ? 'connected' : 'disconnected',
    });
  });

  app.get(`${apiPrefix}/status`, (_req, res) => {
    res.json({
      success: true,
      name: 'Movie Recommendation API',
      version: process.env.npm_package_version || '1.0.0',
      endpoints: {
        auth: `${apiPrefix}/auth`,
        users: `${apiPrefix}/users`,
        movies: `${apiPrefix}/movies`,
        health: '/health',
      },
    });
  });

  app.use(apiPrefix, apiRoutes);

  // Swagger docs (serve after routes mount so base path known)
  app.use(
    `${apiPrefix}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Movie Recommendation API Docs',
    })
  );

  app.get('/', (_req, res) => {
    res.json({
      message: 'Welcome to Movie Recommendation API',
      version: process.env.npm_package_version || '1.0.0',
      apiBase: apiPrefix,
      docs: `${apiPrefix}/docs`,
      health: `${apiPrefix}/health`,
    });
  });
};
