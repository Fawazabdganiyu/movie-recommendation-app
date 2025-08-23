import { DatabaseConnection } from '../../config';

export const initializeDatabase = async (
  dbConnection: DatabaseConnection
): Promise<void> => {
  try {
    await dbConnection.connect();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};
