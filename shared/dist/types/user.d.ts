import { Types } from "mongoose";
/**
 * User Preference Settings
 */
export interface UserPreferences {
    favoriteGenres: number[];
    favoriteActors?: number[];
    favoriteDirectors?: number[];
    minRating?: number;
    languages?: string[];
}
/**
 * Complete User Interface (Backend)
 * Includes all fields including sensitive ones like password
 */
export interface User {
    _id: Types.ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar?: string;
    favoriteGenres: number[];
    favoriteActors?: number[];
    favoriteDirectors?: number[];
    minRating?: number;
    languages?: string[];
    favorites: number[];
    watchlist: number[];
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
    favoriteGenres: number[];
    favoriteActors?: number[];
    favoriteDirectors?: number[];
    minRating?: number;
    languages?: string[];
    favorites: number[];
    watchlist: number[];
    isEmailVerified: boolean;
    isActive: boolean;
    createdAt: string;
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
//# sourceMappingURL=user.d.ts.map