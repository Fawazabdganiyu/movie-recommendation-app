import { Types } from "mongoose";

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

/**
 * Public User Interface (Frontend)
 * Excludes sensitive fields like password, tokens
 */
export interface PublicUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  favoriteGenres: number[]; // TMDB genre IDs
  favoriteActors?: number[]; // TMDB actor IDs
  favoriteDirectors?: number[]; // TMDB director IDs
  minRating?: number; // Minimum rating filter (0-10)
  languages?: string[]; // ISO language codes
  favorites: number[];
  watchlist: number[];
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string; // Dates as strings for JSON serialization
  updatedAt: string;
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

/**
 * Password Change Request
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * User Statistics (for dashboard/analytics)
 */
export interface UserStats {
  totalRatings: number;
  averageRating: number;
  favoriteGenres: string[];
  watchlistCount: number;
  recentActivity: {
    lastRating?: Date;
    lastLogin?: Date;
    lastMovieAdded?: Date;
  };
}
