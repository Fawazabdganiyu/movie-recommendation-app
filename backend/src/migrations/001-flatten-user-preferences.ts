/**
 * Migration: Flatten User Preferences Structure
 *
 * This migration converts the old nested preferences structure to the new flat structure:
 *
 * OLD STRUCTURE:
 * {
 *   preferences: {
 *     genres: ["Action", "Comedy"],
 *     languages: ["en", "es"],
 *     minRating: 7.5
 *   }
 * }
 *
 * NEW STRUCTURE:
 * {
 *   favoriteGenres: [28, 35],  // TMDB genre IDs
 *   favoriteActors: [],
 *   favoriteDirectors: [],
 *   minRating: 7.5,
 *   languages: ["en", "es"]
 * }
 */

import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';

// Genre name to TMDB ID mapping
const GENRE_NAME_TO_ID: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Science Fiction': 878,
  'TV Movie': 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

export class FlattenUserPreferencesMigration {
  static async up(): Promise<void> {
    console.log('🚀 Starting migration: Flatten User Preferences Structure');

    try {
      // Find all users with the old preferences structure
      const usersWithOldPreferences = await UserModel.find({
        preferences: { $exists: true },
      }).lean();

      console.log(
        `📊 Found ${usersWithOldPreferences.length} users with old preferences structure`
      );

      if (usersWithOldPreferences.length === 0) {
        console.log(
          '✅ No users found with old preferences structure. Migration not needed.'
        );
        return;
      }

      let migratedCount = 0;
      let errorCount = 0;

      for (const user of usersWithOldPreferences) {
        try {
          const oldPrefs = (user as any).preferences;

          // Convert genre names to IDs or use existing genreIds
          let favoriteGenres: number[] = [];
          if (oldPrefs?.genreIds && Array.isArray(oldPrefs.genreIds)) {
            // If genreIds already exist, use them directly
            favoriteGenres = oldPrefs.genreIds;
          } else if (oldPrefs?.genres && Array.isArray(oldPrefs.genres)) {
            // Convert genre names to IDs
            favoriteGenres = oldPrefs.genres
              .map((genreName: string) => GENRE_NAME_TO_ID[genreName])
              .filter((id: number) => id !== undefined);
          }

          // Prepare update data
          const updateData: any = {
            favoriteGenres: favoriteGenres,
            favoriteActors: [],
            favoriteDirectors: [],
            minRating: oldPrefs?.minRating || 0,
            languages: oldPrefs?.languages || ['en'],
          };

          // Remove the old preferences field
          const unsetData = {
            preferences: 1,
          };

          // Update the user
          await UserModel.findByIdAndUpdate(user._id, {
            $set: updateData,
            $unset: unsetData,
          });

          migratedCount++;

          if (migratedCount % 100 === 0) {
            console.log(`📈 Migrated ${migratedCount} users...`);
          }
        } catch (error) {
          console.error(`❌ Error migrating user ${user._id}:`, error);
          errorCount++;
        }
      }

      console.log(`✅ Migration completed successfully!`);
      console.log(`📊 Migration summary:`);
      console.log(
        `   - Total users processed: ${usersWithOldPreferences.length}`
      );
      console.log(`   - Successfully migrated: ${migratedCount}`);
      console.log(`   - Errors: ${errorCount}`);

      if (errorCount > 0) {
        console.warn(
          `⚠️  ${errorCount} users failed to migrate. Please check the logs above.`
        );
      }
    } catch (error) {
      console.error('💥 Migration failed with error:', error);
      throw error;
    }
  }

  static async down(): Promise<void> {
    console.log('🔄 Starting rollback: Restore nested preferences structure');

    try {
      // Find all users with the new flat structure
      const usersWithNewStructure = await UserModel.find({
        $or: [
          { favoriteGenres: { $exists: true } },
          { favoriteActors: { $exists: true } },
          { favoriteDirectors: { $exists: true } },
          { minRating: { $exists: true } },
          { languages: { $exists: true } },
        ],
      }).lean();

      console.log(
        `📊 Found ${usersWithNewStructure.length} users with new structure`
      );

      if (usersWithNewStructure.length === 0) {
        console.log(
          '✅ No users found with new structure. Rollback not needed.'
        );
        return;
      }

      // Create reverse mapping from TMDB ID to genre name
      const ID_TO_GENRE_NAME: Record<number, string> = {};
      Object.entries(GENRE_NAME_TO_ID).forEach(([name, id]) => {
        ID_TO_GENRE_NAME[id] = name;
      });

      let rolledBackCount = 0;
      let errorCount = 0;

      for (const user of usersWithNewStructure) {
        try {
          const userData = user as any;

          // Convert genre IDs back to names
          let genreNames: string[] = [];
          if (
            userData.favoriteGenres &&
            Array.isArray(userData.favoriteGenres)
          ) {
            genreNames = userData.favoriteGenres
              .map((id: number) => ID_TO_GENRE_NAME[id])
              .filter((name: string) => name !== undefined);
          }

          // Restore old preferences structure
          const preferences = {
            genres: genreNames,
            genreIds: userData.favoriteGenres || [],
            languages: userData.languages || ['en'],
            minRating: userData.minRating || 0,
          };

          // Remove new fields and restore old structure
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { preferences },
            $unset: {
              favoriteGenres: 1,
              favoriteActors: 1,
              favoriteDirectors: 1,
              minRating: 1,
              languages: 1,
            },
          });

          rolledBackCount++;

          if (rolledBackCount % 100 === 0) {
            console.log(`📈 Rolled back ${rolledBackCount} users...`);
          }
        } catch (error) {
          console.error(`❌ Error rolling back user ${user._id}:`, error);
          errorCount++;
        }
      }

      console.log(`✅ Rollback completed successfully!`);
      console.log(`📊 Rollback summary:`);
      console.log(
        `   - Total users processed: ${usersWithNewStructure.length}`
      );
      console.log(`   - Successfully rolled back: ${rolledBackCount}`);
      console.log(`   - Errors: ${errorCount}`);
    } catch (error) {
      console.error('💥 Rollback failed with error:', error);
      throw error;
    }
  }

  /**
   * Validate the migration by checking data integrity
   */
  static async validate(): Promise<boolean> {
    console.log('🔍 Validating migration...');

    try {
      // Check for any remaining old structure
      const oldStructureCount = await UserModel.countDocuments({
        preferences: { $exists: true },
      });

      // Check for new structure
      const newStructureCount = await UserModel.countDocuments({
        favoriteGenres: { $exists: true },
      });

      const totalUsers = await UserModel.countDocuments({});

      console.log(`📊 Validation results:`);
      console.log(`   - Total users: ${totalUsers}`);
      console.log(`   - Users with old structure: ${oldStructureCount}`);
      console.log(`   - Users with new structure: ${newStructureCount}`);

      if (oldStructureCount > 0) {
        console.warn(
          `⚠️  Warning: ${oldStructureCount} users still have old preferences structure`
        );
        return false;
      }

      if (newStructureCount === 0 && totalUsers > 0) {
        console.warn(
          `⚠️  Warning: No users have new structure but users exist`
        );
        return false;
      }

      console.log('✅ Migration validation passed!');
      return true;
    } catch (error) {
      console.error('💥 Validation failed with error:', error);
      return false;
    }
  }
}

// Export for use as a standalone script
export default FlattenUserPreferencesMigration;

// Allow running this migration directly
if (require.main === module) {
  const runMigration = async () => {
    try {
      // Connect to MongoDB
      await mongoose.connect(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_app'
      );
      console.log('📱 Connected to MongoDB');

      const command = process.argv[2];

      switch (command) {
        case 'up':
          await FlattenUserPreferencesMigration.up();
          break;
        case 'down':
          await FlattenUserPreferencesMigration.down();
          break;
        case 'validate':
          await FlattenUserPreferencesMigration.validate();
          break;
        default:
          console.log('Usage: node migration.js [up|down|validate]');
          process.exit(1);
      }

      await mongoose.disconnect();
      console.log('📱 Disconnected from MongoDB');
      process.exit(0);
    } catch (error) {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    }
  };

  runMigration();
}
