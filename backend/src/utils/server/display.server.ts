import { config } from '../../config';
import { IncomingMessage, Server, ServerResponse } from 'http';
import App from '../../app';

// ASCII Art for startup
export const displayStartupBanner = (): void => {
  console.log(`
🎬 ===================================================== 🎬
    MOVIE RECOMMENDATION API
    Environment: ${config.server.nodeEnv.toUpperCase()}
    Version: 1.0.0
🎬 ===================================================== 🎬
  `);
};

// Display startup information
export const displayServerInfo = (): void => {
  console.log('🚀 Server Information:');
  console.log(`   Environment: ${config.server.nodeEnv}`);
  console.log(`   Port: ${config.server.port}`);
  console.log(`   Node Version: ${process.version}`);
  console.log(`   Address: ${config.server.baseUrl}`);
  console.log(
    `   API Documentation: ${config.server.baseUrl}${config.server.apiPrefix}/docs`
  );
  console.log(`   Platform: ${process.platform}`);
  console.log(
    `   Memory Usage: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`
  );

  console.log('\n✅ Movie Recommendation API is running successfully!');
  console.log('📡 Press Ctrl+C to stop the server\n');
};

// Error handlers for process level errors
export const setupProcessErrorHandlers = (): void => {
  // Handle uncaught exceptions
  process.on('uncaughtException', (err: Error) => {
    console.error('\n🚨 UNCAUGHT EXCEPTION! Shutting down...');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Stack Trace:', err.stack);

    // Log error details in development
    if (config.server.nodeEnv === 'development') {
      console.error('Full Error Object:', err);
    }

    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('\n🚨 UNHANDLED PROMISE REJECTION! Shutting down...');
    console.error('Promise:', promise);
    console.error('Reason:', reason);

    if (reason instanceof Error) {
      console.error('Error Name:', reason.name);
      console.error('Error Message:', reason.message);
      console.error('Stack Trace:', reason.stack);
    }

    process.exit(1);
  });

  // Handle warnings
  process.on('warning', (warning: Error) => {
    if (config.server.nodeEnv === 'development') {
      console.warn('⚠️  Warning:', warning.name);
      console.warn('Message:', warning.message);
      console.warn('Stack:', warning.stack);
    }
  });
};

// Performance monitoring
export const setupPerformanceMonitoring = (): void => {
  if (config.server.nodeEnv === 'development') {
    // Log memory usage every 30 seconds in development
    setInterval(() => {
      const memoryUsage = process.memoryUsage();
      const formatBytes = (bytes: number) => Math.round(bytes / 1024 / 1024);

      console.log(
        `📊 Memory Usage: RSS: ${formatBytes(memoryUsage.rss)}MB, Heap Used: ${formatBytes(memoryUsage.heapUsed)}MB, Heap Total: ${formatBytes(memoryUsage.heapTotal)}MB`
      );
    }, 30000);
  }
};

// Graceful shutdown handlers
export const gracefulShutdown = (
  app: App,
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
  signal: string
) => {
  console.log(`\n👋 ${signal} RECEIVED. Initiating graceful shutdown...`);

  // Stop accepting new connections
  server.close(async (err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }

    console.log('🛑 HTTP server closed');

    try {
      // Close the application (this will handle database cleanup)
      await app.close();
    } catch (shutdownError) {
      console.error('❌ Error during application shutdown:', shutdownError);
      process.exit(1);
    }
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error(
      '⏰ Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 30000);
};

// Environment validation
export const validateEnvironment = (): void => {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'TMDB_API_KEY'];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error(
      '\n📝 Please check your .env file and ensure all required variables are set.'
    );
    process.exit(1);
  }
};
