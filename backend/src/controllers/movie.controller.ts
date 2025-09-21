import { Request, Response, NextFunction } from 'express';
import {
  MovieSearchInput,
  MovieFilterInput,
  MovieRecommendationsInput,
} from '../types';
import { success } from '../utils/response.util';
import { getUserService } from '../container';
import { Types } from 'mongoose';
import { ExternalServiceError } from '../errors/api.error';
import { TMDBService } from '../services/tmdb.service';

export class MovieController {
  private static instance: MovieController;
  private constructor(private movieService: TMDBService) {
    this.movieService = movieService;
  }
  static getInstance(movieService: TMDBService): MovieController {
    if (!MovieController.instance)
      MovieController.instance = new MovieController(movieService);
    return MovieController.instance;
  }

  searchMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Zod validation middleware ensures query and page are valid and typed
      const { query, page } = req.query as unknown as MovieSearchInput;

      const movies = await this.movieService.searchMovies(query, page);

      return success(res, 'Movies fetched successfully', movies);
    } catch (error) {
      console.error('Error in searchMovies controller');
      next(error);
    }
  };

  filterMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        genre,
        minRating,
        maxRating,
        releaseDateGte,
        releaseDateLte,
        sortBy,
        page,
      } = req.query as unknown as MovieFilterInput;

      const movies = await this.movieService.filterMovies({
        genre,
        minRating,
        maxRating,
        releaseDateGte,
        releaseDateLte,
        sortBy,
        page,
      });

      return success(res, 'Movies filtered successfully', movies);
    } catch (error) {
      console.error('Error in filterMovies controller');
      next(error);
    }
  };

  getMovieDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as unknown as { id: number };

      const movie = await this.movieService.getMovieDetails(id);

      if (!movie) {
        throw new ExternalServiceError('Movie not found');
      }

      return success(res, 'Movie details fetched successfully', movie);
    } catch (error) {
      console.error('Error in getMovieDetails controller');
      next(error);
    }
  };

  getRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { genreIds, minRating, page } =
        req.query as unknown as MovieRecommendationsInput;
      const userId = req.user?._id;

      let userGenreIds = genreIds;
      let userMinRating = minRating || 6.0;

      // If user is authenticated, get their preferences
      if (userId) {
        try {
          const user = await getUserService().getById(
            new Types.ObjectId(userId)
          );
          if (user?.preferences) {
            // Use user's preferred genre IDs if not provided in query
            if (!genreIds && user.preferences.genreIds?.length > 0) {
              userGenreIds = user.preferences.genreIds;
            }
            // Use user's minimum rating preference if not provided
            if (!minRating && user.preferences.minRating) {
              userMinRating = user.preferences.minRating;
            }
          }
        } catch (error) {
          console.warn('Could not fetch user preferences for recommendations');
          // Continue with default values if user fetch fails
        }
      }

      const recommendations = await this.movieService.discoverMovies({
        genreIds: userGenreIds,
        minRating: userMinRating,
        page,
      });

      // Add recommendation metadata
      const response = {
        ...recommendations,
        recommendationMeta: {
          userId: userId?.toString(),
          basedOnPreferences: !!userId,
          genreIds: userGenreIds,
          minRating: userMinRating,
        },
      };

      return success(res, 'Recommendations fetched successfully', response);
    } catch (error) {
      console.error('Error in getRecommendations controller:', error);
      next(error);
    }
  };

  getGenres = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const genres = await this.movieService.getGenres();

      return success(res, 'Genres fetched successfully', genres);
    } catch (error) {
      console.error('Error in getGenres controller:', error);
      next(error);
    }
  };
}
