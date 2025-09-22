import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthTokens } from "@/types";
import { authApi } from "@/lib/api/auth";
import { setAuthTokens, clearAuthTokens } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  refreshProfile: () => Promise<void>;
  updateUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.login({ email, password });

          // Store tokens in API client
          setAuthTokens(response.tokens);

          set({
            user: response.user as unknown as User,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
      ) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.register({
            firstName,
            lastName,
            email,
            password,
          });

          // Store tokens in API client
          setAuthTokens(response.tokens);

          set({
            user: response.user as unknown as User,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.error("Logout API call failed:", error);
        } finally {
          // Clear tokens from API client
          clearAuthTokens();

          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      refreshProfile: async () => {
        try {
          const user = await authApi.getProfile();
          set({ user });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // If profile fetch fails, user might be logged out
          if (error.response?.status === 401) {
            get().logout();
          }
          throw error;
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore tokens to API client when store rehydrates
        if (state?.tokens) {
          setAuthTokens(state.tokens);
        }
      },
    },
  ),
);
