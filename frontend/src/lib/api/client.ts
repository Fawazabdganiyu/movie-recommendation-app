import axios, { AxiosResponse } from 'axios';
import { AuthTokens, ApiResponse } from '@/types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authTokens: AuthTokens | null = null;

// Save tokens both in memory and localStorage
export const setAuthTokens = (tokens: AuthTokens | null): void => {
  // Save in memory for immediate use
  authTokens = tokens;

  if (tokens) {
    // Save to localStorage so tokens persist when user refreshes page
    localStorage.setItem('authTokens', JSON.stringify(tokens));

    // Automatically add the token to all future requests
    api.defaults.headers.common['Authorization'] =
      `Bearer ${tokens.accessToken}`;
  } else {
    // Clear everything when logging out
    localStorage.removeItem('authTokens');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Clear tokens (used during logout)
export const clearAuthTokens = (): void => {
  setAuthTokens(null);
};

// Get tokens from memory or localStorage
export const getAuthTokens = (): AuthTokens | null => {
  // First check if we have tokens in memory
  if (authTokens) return authTokens;

  // If not in memory, check localStorage (happens on page refresh)
  if (typeof window !== 'undefined') {
    // Make sure we're in browser, not server
    const stored = localStorage.getItem('authTokens');
    if (stored) {
      try {
        // Parse the JSON string back into an object
        authTokens = JSON.parse(stored);
        if (authTokens) {
          // Re-add the Authorization header
          api.defaults.headers.common['Authorization'] =
            `Bearer ${authTokens.accessToken}`;
        }
        return authTokens;
      } catch {
        // If JSON is corrupted, clean up
        localStorage.removeItem('authTokens');
      }
    }
  }
  return null;
};

// Try to restore tokens when the app loads
if (typeof window !== 'undefined') {
  getAuthTokens();
}

// Request interceptor to add auth token to headers
api.interceptors.response.use(
  // If response is successful, just return it
  (response) => response,

  // If response has an error, check if it's a 401 and try to refresh
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we're trying to refresh

      const tokens = getAuthTokens();
      if (tokens?.refreshToken) {
        try {
          console.log('Access token expired, refreshing...');

          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: tokens.refreshToken,
          });

          // Get new tokens from response
          const newTokens = response.data.data.tokens;
          setAuthTokens(newTokens);

          console.log('Token refreshed successfully');

          // Retry the original request with new token
          originalRequest.headers['Authorization'] =
            `Bearer ${newTokens.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.log('Token refresh failed, logging out user');
          // Refresh failed, user needs to login again
          setAuthTokens(null);

          // Redirect to login page (only in browser)
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      } else {
        console.log('No refresh token available, redirecting to login');
        // No refresh token, redirect to login
        setAuthTokens(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    // If it's not a 401 or refresh failed, reject the promise
    return Promise.reject(error);
  }
);

// Handle API responses
export const handleApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>
): T => {
  if (response.data.success && response.data.data !== undefined) {
    return response.data.data;
  }
  // If there's an error, throw it so components can catch it
  throw new Error(
    response.data.error || response.data.message || 'Unknown error'
  );
};

// Simple wrapper methods for making API calls
export const apiClient = {
  // GET request
  get: <T>(url: string) => api.get<ApiResponse<T>>(url).then(handleApiResponse),

  // POST request
  post: <T>(url: string, data?: unknown) =>
    api.post<ApiResponse<T>>(url, data).then(handleApiResponse),

  // PUT request
  put: <T>(url: string, data?: unknown) =>
    api.put<ApiResponse<T>>(url, data).then(handleApiResponse),

  // PATCH request
  patch: <T>(url: string, data?: unknown) =>
    api.patch<ApiResponse<T>>(url, data).then(handleApiResponse),

  // DELETE request
  delete: <T>(url: string) =>
    api.delete<ApiResponse<T>>(url).then(handleApiResponse),
};
