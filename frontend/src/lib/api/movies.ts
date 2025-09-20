import { apiClient } from './client';
import { Movie, Genre } from '@/types';

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const movieApi = {
  // Get popular movies
  getPopularMovies: async (page = 1): Promise<MovieListResponse> => {
    return apiClient.get<MovieListResponse>(`/movies/popular?page=${page}`);
  },

  // Search movies
  searchMovies: async (query: string, page = 1): Promise<MovieListResponse> => {
    return apiClient.get<MovieListResponse>(
      `/movies/search?query=${encodeURIComponent(query)}&page=${page}`
    );
  },

  // Get movie details
  getMovieDetails: async (id: number): Promise<Movie> => {
    return apiClient.get<Movie>(`/movies/${id}`);
  },

  // Get movie genres
  getGenres: async (): Promise<Genre[]> => {
    return apiClient.get<Genre[]>('/movies/genres');
  },

  // Get movies by genre
  getMoviesByGenre: async (
    genreId: number,
    page = 1
  ): Promise<MovieListResponse> => {
    return apiClient.get<MovieListResponse>(
      `/movies/genre/${genreId}?page=${page}`
    );
  },

  // Get trending movies
  getTrendingMovies: async (
    timeWindow: 'day' | 'week' = 'week'
  ): Promise<MovieListResponse> => {
    return apiClient.get<MovieListResponse>(`/movies/trending/${timeWindow}`);
  },
};
