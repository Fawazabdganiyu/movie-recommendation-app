import { apiClient } from "./client";
import { Movie, Genre } from "@/types";

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface RatingReviewRequest {
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

export const movieApi = {
  // Search movies
  searchMovies: async (query: string, page = 1): Promise<MovieListResponse> => {
    return apiClient.get<MovieListResponse>(
      `/movies/search?query=${encodeURIComponent(query)}&page=${page}`,
    );
  },

  // Filter movies
  filterMovies: async (filters: {
    genre?: string;
    minRating?: number;
    maxRating?: number;
    releaseDateGte?: string;
    releaseDateLte?: string;
    sortBy?: string;
    page?: number;
  }): Promise<MovieListResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    return apiClient.get<MovieListResponse>(
      `/movies/filter?${params.toString()}`,
    );
  },

  // Get personalized recommendations
  getRecommendations: async (options?: {
    genreIds?: string;
    minRating?: number;
    page?: number;
  }): Promise<MovieListResponse> => {
    const params = new URLSearchParams();

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    return apiClient.get<MovieListResponse>(
      `/movies/recommendations${queryString ? `?${queryString}` : ""}`,
    );
  },

  // Get movie details
  getMovieDetails: async (id: number): Promise<Movie> => {
    return apiClient.get<Movie>(`/movies/${id}`);
  },

  // Submit or update rating and review for a movie
  rateMovie: async (
    movieId: number,
    data: RatingReviewRequest,
  ): Promise<RatingReview> => {
    return apiClient.post<RatingReview>(`/movies/${movieId}/rate-review`, data);
  },

  // Update existing rating and review for a movie
  updateMovieRating: async (
    movieId: number,
    data: RatingReviewRequest,
  ): Promise<RatingReview> => {
    return apiClient.patch<RatingReview>(
      `/movies/${movieId}/rate-review`,
      data,
    );
  },

  // Get ratings and reviews for a movie
  getMovieRatingsReviews: async (movieId: number): Promise<RatingReview[]> => {
    return apiClient.get<RatingReview[]>(`/movies/${movieId}/ratings-reviews`);
  },

  // Get movie genres (delegated to genres API for consistency)
  getGenres: async (): Promise<Genre[]> => {
    return apiClient.get<Genre[]>("/genres");
  },

  // Get movies by genre (if supported by backend)
  getMoviesByGenre: async (
    genreId: number,
    page = 1,
  ): Promise<MovieListResponse> => {
    return apiClient.get<MovieListResponse>(
      `/movies/filter?genre=${genreId}&page=${page}`,
    );
  },

  // Get trending movies (if supported by backend)
  getTrendingMovies: async (
    timeWindow: "day" | "week" = "week",
  ): Promise<MovieListResponse> => {
    return apiClient.get<MovieListResponse>(`/movies/trending/${timeWindow}`);
  },
};
