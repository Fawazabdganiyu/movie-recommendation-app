import App from './app';
import { config } from './config';
import { getDbConnection } from './container';
import {
  displayServerInfo,
  displayStartupBanner,
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
    const app = await App.bootstrap(getDbConnection());

    // Setup performance monitoring
    setupPerformanceMonitoring();

    // Start the server
    const server = app.getApp().listen(config.server.port, () => {
      displayServerInfo();
    });

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
