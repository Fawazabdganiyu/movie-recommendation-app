import { ApiResponse, Movie } from "@shared/types";

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

/**
 * Frontend-specific types
 */
export interface RatingRequest {
  movieId: number;
  rating: number;
  review?: string;
}

export interface RatingReview {
  _id: string;
  userId: string;
  movieId: number;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
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

export interface MovieDetailResponse extends ApiResponse<Movie> {
  data: Movie & {
    genres: {
      id: number;
      name: string;
    }[];
    runtime: number;
    tagline: string;
  };
}
