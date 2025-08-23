import App from './app';
import { config } from './config';
import { getDbConnection } from './container';
import {
  displayServerInfo,
  displayStartupBanner,
  gracefulShutdown,
  setupPerformanceMonitoring,
  setupProcessErrorHandlers,
  validateEnvironment,
} from './utils/server/display.server';

// Main server startup function
const startServer = async () => {
  try {
    // Display startup banner
    displayStartupBanner();

    // Setup error handlers first
    setupProcessErrorHandlers();

    // Initialize the application
    console.log('🔄 Initializing application...');
    const app = new App(getDbConnection());

    // Setup performance monitoring
    setupPerformanceMonitoring();

    // Start the server
    const server = app.getApp().listen(config.server.port, () => {
      displayServerInfo();

      // Additional production checks
      if (config.server.nodeEnv === 'production') {
        console.log('🔒 Production mode: Enhanced security enabled');
        console.log('📈 Performance monitoring: Active');
      }
    });

    // Set server timeout for long-running requests
    server.timeout = 30000; // 30 seconds

    // Keep alive timeout
    server.keepAliveTimeout = 65000; // 65 seconds

    // Headers timeout
    server.headersTimeout = 66000; // 66 seconds

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown(app, server, 'SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown(app, server, 'SIGINT'));

    // Export server for testing
    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    // Validate environment first
    validateEnvironment();

    // Start the server
    await startServer();
  } catch (error) {
    console.error('❌ Application startup failed:', error);
    process.exit(1);
  }
};

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { startServer };
export default main;
