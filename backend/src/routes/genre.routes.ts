import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import { getRatingReviewService, getTmdbService } from '../container';

const router = Router();
const movieController = MovieController.getInstance(
  getTmdbService(),
  getRatingReviewService()
);

// GET /api/genres - Get all available movie genres
router.get('/', movieController.getGenres);

export default router;
