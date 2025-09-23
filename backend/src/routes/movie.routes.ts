import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import {
  validateQuery,
  validateParams,
  validateBody,
} from '../middleware/zod-validation.middleware';
import {
  movieSearchSchema,
  movieFilterSchema,
  movieRecommendationsSchema,
  movieIdParamSchema,
  numericIdParamSchema,
  createOrUpdateRatingSchema,
} from '../validation';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware';
import { getRatingReviewService, getTmdbService } from '../container';

const router = Router();
const movieController = MovieController.getInstance(
  getTmdbService(),
  getRatingReviewService()
);

// POST /api/v1/movies/:movieId/rate-review - Rate a movie
router.post(
  '/:movieId/rate-review',
  requireAuth,
  validateParams(movieIdParamSchema),
  validateBody(createOrUpdateRatingSchema),
  movieController.submitRatingReview
);

// GET /api/v1/movies/:movieId/ratings-reviews
router.get(
  '/:movieId/ratings-reviews',
  requireAuth,
  validateParams(movieIdParamSchema),
  movieController.getMovieRatingsReviews
);

// GET /api/v1/movies/search - Search for movies by query
router.get(
  '/search',
  validateQuery(movieSearchSchema),
  movieController.searchMovies
);

// GET /api/v1/movies/filter - Filter movies by criteria
router.get(
  '/filter',
  validateQuery(movieFilterSchema),
  movieController.filterMovies
);

// GET /api/v1/movies/popular - Get popular movies
router.get('/popular', optionalAuth, movieController.getPopularMovies);

// GET /api/v1/movies/recommendations - Get personalized recommendations
router.get(
  '/recommendations',
  optionalAuth,
  validateQuery(movieRecommendationsSchema),
  movieController.getRecommendations
);

// GET /api/v1/movies/:id - Get movie details by ID
router.get(
  '/:id',
  validateParams(numericIdParamSchema),
  movieController.getMovieDetails
);

// PATCH /api/v1/movies/:movieId/rate-review
router.patch(
  '/:movieId/rate-review',
  requireAuth,
  validateParams(movieIdParamSchema),
  validateBody(createOrUpdateRatingSchema),
  movieController.submitRatingReview
);

export default router;
