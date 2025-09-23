import { Model } from 'mongoose';

/**
 * Complete User Interface (Backend)
 * Includes all fields including sensitive ones like password
 */
export interface User {
  _id: Types.ObjectId;
  email: string;
  password: string; // Only present in backend operations
  firstName: string;
  lastName: string;
  fullName: string; // Virtual property
  avatar?: string;
  favoriteGenres: number[]; // TMDB genre IDs
  favoriteActors?: number[]; // TMDB actor IDs
  favoriteDirectors?: number[]; // TMDB director IDs
  minRating?: number; // Minimum rating filter (0-10)
  languages?: string[]; // ISO language codes
  favorites: number[]; // Movie IDs
  watchlist: number[]; // Movie IDs
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// Document interface (instance methods)
export interface UserDocument extends User, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  getPublicProfile(): Partial<User>;
  getPreferences(): {
    _id: string;
    userId: string;
    favoriteGenres: number[];
    favoriteActors?: number[];
    favoriteDirectors?: number[];
    minRating?: number;
    languages?: string[];
    createdAt: string;
    updatedAt: string;
  };
}

// Model interface (static methods)
export interface IUserModel extends Model<UserDocument> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}

import { Types } from 'mongoose';

/**
 * User Preference Settings
 */
export interface UserPreferences {
  favoriteGenres: number[]; // TMDB genre IDs
  favoriteActors?: number[]; // TMDB actor IDs
  favoriteDirectors?: number[]; // TMDB director IDs
  minRating?: number; // Minimum rating filter (0-10)
  languages?: string[]; // ISO language codes
}

/**
 * User Profile Update Data
 */
export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  favoriteGenres?: number[];
  favoriteActors?: number[];
  favoriteDirectors?: number[];
  minRating?: number;
  languages?: string[];
}
