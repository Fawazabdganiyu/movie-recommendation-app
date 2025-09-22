import { apiClient } from "./client";
import { User } from "@/types";

// API-specific user preferences response (matches backend docs)
export interface ApiUserPreferences {
  _id: string;
  userId: string;
  favoriteGenres: number[];
  favoriteActors?: number[];
  favoriteDirectors?: number[];
  minRating?: number;
  languages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPreferencesRequest {
  favoriteGenres?: number[];
  favoriteActors?: number[];
  favoriteDirectors?: number[];
  minRating?: number;
  languages?: string[];
}

export interface UserRating {
  _id: string;
  userId: string;
  movieId: number;
  rating: number;
  createdAt: string;
}

export const userApi = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>("/users/profile");
  },

  // Update user profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string | null;
  }): Promise<User> => {
    return apiClient.patch<User>("/users/profile", data);
  },

  // Get user's favorite movies
  getFavoriteMovies: async (): Promise<number[]> => {
    return apiClient.get<number[]>("/users/favorites");
  },

  // Add a movie to favorites
  addFavoriteMovie: async (movieId: number): Promise<void> => {
    return apiClient.post<void>(`/users/favorites/${movieId}`);
  },

  // Remove a movie from favorites
  removeFavoriteMovie: async (movieId: number): Promise<void> => {
    return apiClient.delete<void>(`/users/favorites/${movieId}`);
  },

  // Get user preferences
  getPreferences: async (): Promise<ApiUserPreferences> => {
    return apiClient.get<ApiUserPreferences>("/users/preferences");
  },

  // Update user preferences - now supports genres, minRating, and languages
  updatePreferences: async (
    data: UpdateUserPreferencesRequest,
  ): Promise<ApiUserPreferences> => {
    return apiClient.put<ApiUserPreferences>("/users/preferences", data);
  },

  // Convenience method to update just genre preferences
  updateGenrePreferences: async (
    genreIds: number[],
  ): Promise<ApiUserPreferences> => {
    return userApi.updatePreferences({ favoriteGenres: genreIds });
  },

  // Delete user account
  deleteAccount: async (): Promise<void> => {
    return apiClient.delete<void>("/users/account");
  },
};
