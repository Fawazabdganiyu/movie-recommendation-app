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
  '/',
  requireAuth,
  validateBody(createWatchlistSchema),
  controller.createWatchlist
);
router.get('/', requireAuth, controller.getUserWatchlists);
router.get(
  '/:watchlistId',
  requireAuth,
  validateParams(watchlistIdParamSchema),
  controller.getWatchlistById
);
router.put(
  '/:watchlistId',
  requireAuth,
  validateParams(watchlistIdParamSchema),
  validateBody(updateWatchlistSchema),
  controller.updateWatchlist
);
router.delete(
  '/:watchlistId',
  requireAuth,
  validateParams(watchlistIdParamSchema),
  controller.deleteWatchlist
);
router.post(
  '/:watchlistId/movies/:movieId',
  requireAuth,
  validateParams(watchlistIdParamSchema.extend(movieIdParamSchema.shape)),
  controller.addMovieToWatchlist
);
router.delete(
  '/:watchlistId/movies/:movieId',
  requireAuth,
  validateParams(watchlistIdParamSchema.extend(movieIdParamSchema.shape)),
  controller.removeMovieFromWatchlist
);

export default router;
