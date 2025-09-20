import { apiClient } from './client';
import { User } from '@/types';

export interface RatingRequest {
  movieId: number;
  rating: number;
}

export interface UserRating {
  _id: string;
  userId: string;
  movieId: number;
  rating: number;
  createdAt: string;
}

export interface UserPreference {
  _id: string;
  userId: string;
  genreIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationResponse {
  recommendations: number[];
  reason: string;
}

export const userApi = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/user/profile');
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiClient.put<User>('/user/profile', data);
  },

  // Rate a movie
  rateMovie: async (data: RatingRequest): Promise<UserRating> => {
    return apiClient.post<UserRating>('/user/rate', data);
  },

  // Get user ratings
  getUserRatings: async (): Promise<UserRating[]> => {
    return apiClient.get<UserRating[]>('/user/ratings');
  },

  // Get user preferences
  getPreferences: async (): Promise<UserPreference> => {
    return apiClient.get<UserPreference>('/user/preferences');
  },

  // Update user preferences
  updatePreferences: async (genreIds: number[]): Promise<UserPreference> => {
    return apiClient.put<UserPreference>('/user/preferences', { genreIds });
  },

  // Get recommendations
  getRecommendations: async (): Promise<RecommendationResponse> => {
    return apiClient.get<RecommendationResponse>('/user/recommendations');
  },

  // Delete account
  deleteAccount: async (): Promise<void> => {
    return apiClient.delete('/user/account');
  },
};
