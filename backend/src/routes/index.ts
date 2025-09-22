import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import movieRoutes from './movie.routes';
import genreRoutes from './genre.routes';
import watchlistRoutes from './watchlist.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/genres', genreRoutes);
router.use('/users/watchlists', watchlistRoutes);
export default router;
