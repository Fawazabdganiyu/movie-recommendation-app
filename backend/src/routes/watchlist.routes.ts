import { Router } from 'express';
import {
  validateParams,
  validateBody,
} from '../middleware/zod-validation.middleware';
import {
  watchlistIdParamSchema,
  createWatchlistSchema,
  updateWatchlistSchema,
  movieIdParamSchema,
} from '../validation';
import { WatchlistController } from '../controllers/watchlist.controller';
import { getWatchlistService } from '../container';
import { requireAuth } from '../middleware';

const router = Router();
const controller = WatchlistController.getInstance(getWatchlistService());

router.post(
  '/watchlists',
  requireAuth,
  validateBody(createWatchlistSchema),
  controller.createWatchlist
);
router.get('/watchlists', requireAuth, controller.getUserWatchlists);
router.get(
  '/watchlists/:watchlistId',
  requireAuth,
  validateParams(watchlistIdParamSchema),
  controller.getWatchlistById
);
router.put(
  '/watchlists/:watchlistId',
  requireAuth,
  validateParams(watchlistIdParamSchema),
  validateBody(updateWatchlistSchema),
  controller.updateWatchlist
);
router.delete(
  '/watchlists/:watchlistId',
  requireAuth,
  validateParams(watchlistIdParamSchema),
  controller.deleteWatchlist
);
router.post(
  '/watchlists/:watchlistId/movies/:movieId',
  requireAuth,
  validateParams(watchlistIdParamSchema.extend(movieIdParamSchema.shape)),
  controller.addMovieToWatchlist
);
router.delete(
  '/watchlists/:watchlistId/movies/:movieId',
  requireAuth,
  validateParams(watchlistIdParamSchema.extend(movieIdParamSchema.shape)),
  controller.removeMovieFromWatchlist
);

export default router;
