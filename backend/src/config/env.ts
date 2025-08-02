import dotenv from 'dotenv';
import { AppConfig } from '../interfaces';

// Load environment variables
dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'TMDB_API_KEY'];

// Validate required environment variables
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export const config: AppConfig = {
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000'],
  },

  database: {
    uri: process.env.MONGODB_URI!,
    options: {
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10),
      serverSelectionTimeoutMS: parseInt(
        process.env.DB_SERVER_SELECTION_TIMEOUT || '5000',
        10
      ),
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT || '45000', 10),
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  tmdb: {
    apiKey: process.env.TMDB_API_KEY!,
    baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    imageBaseUrl:
      process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  },
};

export const isDevelopment = config.server.nodeEnv === 'development';
export const isProduction = config.server.nodeEnv === 'production';
export const isTest = config.server.nodeEnv === 'test';
