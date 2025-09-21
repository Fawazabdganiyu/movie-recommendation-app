import { Router } from 'express';
import { getGenres } from '../controllers/movie.controller';

const router = Router();

// GET /api/genres - Get all available movie genres
router.get('/', getGenres);

export default router;
