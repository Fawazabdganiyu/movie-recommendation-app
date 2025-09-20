import axios from 'axios';
import { config } from '../config';

const TMDB_API_KEY = config.tmdb.apiKey;
const TMDB_BASE_URL = config.tmdb.baseUrl;

if (!TMDB_API_KEY) {
  console.error('TMDB_API_KEY is not defined in environment variables.');
}

export class TMDBService {
  public static instance: TMDBService;
  private apiKey: string;
  private baseUrl: string;

  private constructor() {
    this.apiKey = TMDB_API_KEY;
    this.baseUrl = TMDB_BASE_URL;
  }

  public static getInstance(): TMDBService {
    if (!TMDBService.instance) TMDBService.instance = new TMDBService();
    return TMDBService.instance;
  }

  /**
   * Searches for movies based on a query string.
   * @param query The search query (e.g., movie title).
   * @param page The page number for results (default to 1).
   * @returns A promise that resolves to the movie search results.
   */
  public async searchMovies(query: string, page: number = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query: query,
          page: page,
          include_adult: false,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error searching movies from TMDB');
      throw error;
    }
  }

  /**
   * Fetches movie details by ID.
   * @param movieId The ID of the movie.
   * @returns A promise that resolves to the movie details.
   */
  public async getMovieDetails(movieId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId} from TMDB`);
      throw error; // Re-throw to be handled by the error middleware
    }
  }

  /**
   * Filters and discovers movies based on various criteria.
   * @param params Filter parameters including genre, rating, release date, etc.
   * @returns A promise that resolves to filtered movie results.
   */
  public async filterMovies(params: {
    genre?: number;
    minRating?: number;
    maxRating?: number;
    releaseDateGte?: string;
    releaseDateLte?: string;
    sortBy?: string;
    page?: number;
  }) {
    try {
      const {
        genre,
        minRating,
        maxRating,
        releaseDateGte,
        releaseDateLte,
        sortBy = 'popularity.desc',
        page = 1,
      } = params;

      const queryParams: any = {
        api_key: this.apiKey,
        page,
        sort_by: sortBy,
        include_adult: false,
      };

      if (genre) queryParams.with_genres = genre;
      if (minRating) queryParams['vote_average.gte'] = minRating;
      if (maxRating) queryParams['vote_average.lte'] = maxRating;
      if (releaseDateGte) queryParams['release_date.gte'] = releaseDateGte;
      if (releaseDateLte) queryParams['release_date.lte'] = releaseDateLte;

      const response = await axios.get(`${this.baseUrl}/discover/movie`, {
        params: queryParams,
      });

      return response.data;
    } catch (error) {
      console.error('Error filtering movies from TMDB');
      throw error;
    }
  }

  /**
   * Discovers movies for recommendations based on user preferences.
   * @param params Parameters for discovering movies including genres, keywords, etc.
   * @returns A promise that resolves to discovered movies.
   */
  public async discoverMovies(params: {
    genreIds?: number[];
    minRating?: number;
    sortBy?: string;
    page?: number;
    excludeGenres?: number[];
  }) {
    try {
      const {
        genreIds,
        minRating = 6.0,
        sortBy = 'vote_average.desc',
        page = 1,
        excludeGenres,
      } = params;

      const queryParams: any = {
        api_key: this.apiKey,
        page,
        sort_by: sortBy,
        include_adult: false,
        'vote_count.gte': 100, // Ensure movies have enough votes
        'vote_average.gte': minRating,
      };

      if (genreIds && genreIds.length > 0) {
        queryParams.with_genres = genreIds.join(',');
      }

      if (excludeGenres && excludeGenres.length > 0) {
        queryParams.without_genres = excludeGenres.join(',');
      }

      const response = await axios.get(`${this.baseUrl}/discover/movie`, {
        params: queryParams,
      });

      return response.data;
    } catch (error) {
      console.error('Error discovering movies from TMDB');
      throw error; // Re-throw to be handled by the error middleware
    }
  }

  /**
   * Fetches available genres from TMDB.
   * @returns A promise that resolves to the list of genres.
   */
  public async getGenres() {
    try {
      const response = await axios.get(`${this.baseUrl}/genre/movie/list`, {
        params: {
          api_key: this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching genres from TMDB');
      throw error;
    }
  }
}
