import { apiClient } from './client';
import { AuthResponse, LoginFormData, RegisterFormData, User } from '@/types';

export const authApi = {
  // Register new user
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  // Login user
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/auth/profile');
  },

  // Refresh tokens
  refreshTokens: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  },
};
