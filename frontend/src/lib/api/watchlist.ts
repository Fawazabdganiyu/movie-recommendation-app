import { apiClient } from "./client";

/**
 * Represents a user's watchlist.
 */
export interface Watchlist {
  _id: string;
  userId: string;
  name: string;
  movies: number[]; // Array of TMDB movie IDs
  createdAt: string;
  updatedAt: string;
}

/**
 * The request payload for creating a new watchlist.
 */
export interface CreateWatchlistRequest {
  name: string;
}

/**
 * The request payload for updating a watchlist's details.
 */
export interface UpdateWatchlistRequest {
  name: string;
}

/**
 * A generic success response from the API.
 */
export interface GenericSuccessResponse {
  message: string;
  [key: string]: unknown;
}

/**
 * API service for managing user watchlists.
 */
export const watchlistApi = {
  /**
   * Creates a new watchlist for the authenticated user.
   * @param data - The details for the new watchlist.
   * @returns The newly created watchlist object.
   */
  createWatchlist: async (data: CreateWatchlistRequest): Promise<Watchlist> => {
    return apiClient.post<Watchlist>("/users/watchlists", data);
  },

  /**
   * Retrieves all watchlists for the authenticated user.
   * @returns An array of the user's watchlists.
   */
  getUserWatchlists: async (): Promise<Watchlist[]> => {
    return apiClient.get<Watchlist[]>("/users/watchlists");
  },

  /**
   * Retrieves a single watchlist by its ID.
   * @param watchlistId - The ID of the watchlist to retrieve.
   * @returns The requested watchlist object.
   */
  getWatchlistById: async (watchlistId: string): Promise<Watchlist> => {
    return apiClient.get<Watchlist>(`/users/watchlists/${watchlistId}`);
  },

  /**
   * Updates an existing watchlist.
   * @param watchlistId - The ID of the watchlist to update.
   * @param data - The updated details for the watchlist.
   * @returns The updated watchlist object.
   */
  updateWatchlist: async (
    watchlistId: string,
    data: UpdateWatchlistRequest,
  ): Promise<Watchlist> => {
    return apiClient.put<Watchlist>(`/users/watchlists/${watchlistId}`, data);
  },

  /**
   * Deletes a specific watchlist.
   * @param watchlistId - The ID of the watchlist to delete.
   * @returns A success message.
   */
  deleteWatchlist: async (
    watchlistId: string,
  ): Promise<GenericSuccessResponse> => {
    return apiClient.delete<GenericSuccessResponse>(
      `/users/watchlists/${watchlistId}`,
    );
  },

  /**
   * Adds a movie to a specific watchlist.
   * @param watchlistId - The ID of the watchlist.
   * @param movieId - The TMDB ID of the movie to add.
   * @returns A success message.
   */
  addMovieToWatchlist: async (
    watchlistId: string,
    movieId: number,
  ): Promise<GenericSuccessResponse> => {
    return apiClient.post<GenericSuccessResponse>(
      `/users/watchlists/${watchlistId}/movies/${movieId}`,
    );
  },

  /**
   * Removes a movie from a specific watchlist.
   * @param watchlistId - The ID of the watchlist.
   * @param movieId - The TMDB ID of the movie to remove.
   * @returns A success message.
   */
  removeMovieFromWatchlist: async (
    watchlistId: string,
    movieId: number,
  ): Promise<GenericSuccessResponse> => {
    return apiClient.delete<GenericSuccessResponse>(
      `/users/watchlists/${watchlistId}/movies/${movieId}`,
    );
  },
};
