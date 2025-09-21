import { Router } from 'express';
import {
  validateParams,
  validateBody,
} from '../middleware/zod-validation.middleware';
import {
  watchlistIdParamSchema,
  createWatchlistSchema,
  updateWatchlistSchema,
  userIdParamSchema,
  movieIdParamSchema,
} from '../validation';
import { WatchlistController } from '../controllers/watchlist.controller';
import { getWatchlistService } from '../container';

const router = Router();
const controller = WatchlistController.getInstance(getWatchlistService());

router.post(
  '/:userId/watchlists',
  validateParams(userIdParamSchema),
  validateBody(createWatchlistSchema),
  controller.createWatchlist
);
router.get('/:userId/watchlists', controller.getUserWatchlists);
router.get(
  '/:userId/watchlists/:watchlistId',
  validateParams(userIdParamSchema.extend(watchlistIdParamSchema.shape)),
  controller.getWatchlistById
);
router.put(
  '/:userId/watchlists/:watchlistId',
  validateParams(userIdParamSchema.extend(watchlistIdParamSchema.shape)),
  validateBody(updateWatchlistSchema),
  controller.updateWatchlist
);
router.delete(
  '/:userId/watchlists/:watchlistId',
  validateParams(userIdParamSchema.extend(watchlistIdParamSchema.shape)),
  controller.deleteWatchlist
);
router.post(
  '/:userId/watchlists/:watchlistId/movies/:movieId',
  validateParams(
    userIdParamSchema
      .extend(watchlistIdParamSchema.shape)
      .extend(movieIdParamSchema.shape)
  ),
  controller.addMovieToWatchlist
);
router.delete(
  '/:userId/watchlists/:watchlistId/movies/:movieId',
  validateParams(
    userIdParamSchema
      .extend(watchlistIdParamSchema.shape)
      .extend(movieIdParamSchema.shape)
  ),
  controller.removeMovieFromWatchlist
);

export default router;
