// Re-export shared types for frontend use
export type {
  // Core types from shared
  ApiResponse,
  AuthTokens,
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  Movie,
  Genre,
  MovieListResponse,
  UserPreferences,
  UserRatingReview,
  PublicUser as User, // Use PublicUser as User in frontend
  UserUpdateData,
  PasswordChangeRequest,
  UserStats,
} from "@shared/types";

// Frontend-specific validation schemas
import { z } from "zod";

/**
 * Frontend Form Validation Schemas
 * Extended from shared schemas with frontend-specific validation
 */
export const loginFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Frontend-specific types
 */
export interface RatingRequest {
  movieId: number;
  rating: number;
  review?: string;
}

export interface MovieSearchParams {
  query?: string;
  genre?: number;
  page?: number;
  sortBy?: "popularity" | "release_date" | "vote_average";
  sortOrder?: "asc" | "desc";
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

// Form data types
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
