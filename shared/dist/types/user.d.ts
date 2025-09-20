import { Types } from 'mongoose';
import { z } from 'zod';
/**
 * User Preference Settings
 */
export interface UserPreferences {
    genres: string[];
    genreIds: number[];
    languages: string[];
    minRating: number;
    explicitContent: boolean;
}
/**
 * User Rating for a Movie
 */
export interface UserRating {
    _id?: string;
    movieId: number;
    rating: number;
    review?: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}
/**
 * Complete User Interface (Backend)
 * Includes all fields including sensitive ones like password
 */
export interface User {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
    avatar?: string;
    preferences: UserPreferences;
    favorites: number[];
    watchlist: number[];
    ratings: UserRating[];
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
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
    avatar?: string;
    preferences: UserPreferences;
    favorites: number[];
    watchlist: number[];
    ratings: UserRating[];
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
    username?: string;
    avatar?: string;
    preferences?: Partial<UserPreferences>;
}
/**
 * Password Change Request
 */
export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
}
/**
 * User Validation Schemas
 */
export declare const userUpdateSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const passwordChangeSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
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