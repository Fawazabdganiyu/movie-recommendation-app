import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import { getTmdbService } from '../container';

const router = Router();
const movieController = MovieController.getInstance(getTmdbService());

// GET /api/genres - Get all available movie genres
router.get('/', movieController.getGenres);

export default router;
