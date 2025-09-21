import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import {
  validateQuery,
  validateParams,
} from '../middleware/zod-validation.middleware';
import {
  movieSearchSchema,
  movieFilterSchema,
  movieRecommendationsSchema,
} from '../validation/movie.validation';
import { optionalAuth } from '../middleware/auth.middleware';
import { getTmdbService } from '../container';
import { numericIdParamSchema } from '../validation';

const router = Router();
const movieController = MovieController.getInstance(getTmdbService());

// GET /api/movies/search - Search for movies by query
router.get(
  '/search',
  validateQuery(movieSearchSchema),
  movieController.searchMovies
);

// GET /api/movies/filter - Filter movies by criteria
router.get(
  '/filter',
  validateQuery(movieFilterSchema),
  movieController.filterMovies
);

// GET /api/movies/recommendations - Get personalized recommendations
router.get(
  '/recommendations',
  optionalAuth,
  validateQuery(movieRecommendationsSchema),
  movieController.getRecommendations
);

// GET /api/movies/:id - Get movie details by ID
router.get(
  '/:id',
  validateParams(numericIdParamSchema),
  movieController.getMovieDetails
);

export default router;
