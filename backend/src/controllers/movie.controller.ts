import { Request, Response, NextFunction } from 'express';
import {
  MovieSearchInput,
  MovieFilterInput,
  MovieRecommendationsInput,
  RatingReview,
} from '../types';
import { success } from '../utils/response.util';
import { getUserService } from '../container';
import { Types } from 'mongoose';
import { ExternalServiceError } from '../errors/api.error';
import { TMDBService } from '../services/tmdb.service';
import { RatingReviewService } from '../services/rating-review.service';

export class MovieController {
  private static instance: MovieController;
  private movieService: TMDBService;
  private ratingReviewService: RatingReviewService;

  private constructor(
    movieService: TMDBService,
    ratingReviewService: RatingReviewService
  ) {
    this.movieService = movieService;
    this.ratingReviewService = ratingReviewService;
  }
  static getInstance(
    movieService: TMDBService,
    ratingService: RatingReviewService
  ): MovieController {
    if (!MovieController.instance)
      MovieController.instance = new MovieController(
        movieService,
        ratingService
      );
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
      let userLanguages: string[] = ['en']; // Default to English
      let userFavoriteActors: number[] = [];
      let userFavoriteDirectors: number[] = [];

      // If user is authenticated, get their preferences
      if (userId) {
        try {
          const user = await getUserService().getById(
            new Types.ObjectId(userId)
          );
          if (user) {
            // Use user's preferred genre IDs if not provided in query
            if (!genreIds && user.favoriteGenres?.length > 0) {
              userGenreIds = user.favoriteGenres;
            }
            // Use user's minimum rating preference if not provided
            if (!minRating && user.minRating) {
              userMinRating = user.minRating;
            }
            // Get user's language preferences
            if (user.languages && user.languages.length > 0) {
              userLanguages = user.languages;
            }
            // Get user's favorite actors and directors for enhanced recommendations
            if (user.favoriteActors && user.favoriteActors.length > 0) {
              userFavoriteActors = user.favoriteActors;
            }
            if (user.favoriteDirectors && user.favoriteDirectors.length > 0) {
              userFavoriteDirectors = user.favoriteDirectors;
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
        languages: userLanguages,
        favoriteActors: userFavoriteActors,
        favoriteDirectors: userFavoriteDirectors,
      });

      // Add recommendation metadata
      const response = {
        ...recommendations,
        recommendationMeta: {
          userId: userId?.toString(),
          basedOnPreferences: !!userId,
          genreIds: userGenreIds,
          minRating: userMinRating,
          languages: userLanguages,
          favoriteActors: userFavoriteActors,
          favoriteDirectors: userFavoriteDirectors,
          enhancedRecommendations:
            userFavoriteActors.length > 0 || userFavoriteDirectors.length > 0,
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

  getPopularMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page } = req.query as { page?: string };
      const pageNumber = page ? parseInt(page, 10) : 1;

      const popularMovies =
        await this.movieService.getPopularMovies(pageNumber);

      return success(res, 'Popular movies fetched successfully', popularMovies);
    } catch (error) {
      console.error('Error in getPopularMovies controller:', error);
      next(error);
    }
  };

  submitRatingReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { movieId } = req.params;
      const { rating, review } = req.body;
      const userId = req.user?._id as Types.ObjectId;

      const data = {
        movieId: Number(movieId),
        userId,
      } as RatingReview;
      if (rating) data['rating'] = rating;
      if (review) data['review'] = review;

      const bothPresent = rating && review;
      const target = bothPresent
        ? 'Rating and Review'
        : rating
          ? 'Rating'
          : 'Review';

      const newRating = await this.ratingReviewService.createRatingReview(data);

      return success(res, `${target} submitted successfully`, newRating);
    } catch (error: any) {
      next(error);
    }
  };

  updateRatingReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { movieId } = req.params;
      const { rating, review } = req.body;
      const userId = req.user?._id;

      const data = {
        movieId: Number(movieId),
        userId,
      } as RatingReview;
      if (rating) data['rating'] = rating;
      if (review) data['review'] = review;

      const bothPresent = rating && review;
      const target = bothPresent
        ? 'Rating and Review'
        : rating
          ? 'Rating'
          : 'Review';

      const updatedReview =
        await this.ratingReviewService.updateRatingReview(data);

      return success(res, `${target} updated successfully`, updatedReview);
    } catch (error: any) {
      next(error);
    }
  };

  getMovieRatingsReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { movieId } = req.params as unknown as { movieId: number };
      const reviews =
        await this.ratingReviewService.getMovieRatingsReviews(movieId);

      return success(res, 'Reviews fetched successfully', reviews);
    } catch (error: any) {
      next(error);
    }
  };
}
