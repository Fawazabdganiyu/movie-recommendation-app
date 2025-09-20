import { Router } from 'express';
import {
  searchMovies,
  filterMovies,
  getMovieDetails,
  getRecommendations,
} from '../controllers/movie.controller';
import {
  validateQuery,
  validateParams,
  numericIdParamSchema,
} from '../middleware/zod-validation.middleware';
import {
  movieSearchSchema,
  movieFilterSchema,
  movieRecommendationsSchema,
} from '../validation/movie.validation';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// GET /api/movies/search - Search for movies by query
router.get('/search', validateQuery(movieSearchSchema), searchMovies);

// GET /api/movies/filter - Filter movies by criteria
router.get('/filter', validateQuery(movieFilterSchema), filterMovies);

// GET /api/movies/recommendations - Get personalized recommendations
router.get(
  '/recommendations',
  optionalAuth,
  validateQuery(movieRecommendationsSchema),
  getRecommendations
);

// GET /api/movies/:id - Get movie details by ID
router.get('/:id', validateParams(numericIdParamSchema), getMovieDetails);

export default router;
