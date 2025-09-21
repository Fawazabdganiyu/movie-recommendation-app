import { Request, Response, NextFunction } from 'express';
import { success } from '../utils/response.util';
import { NotFoundError } from '../errors/api.error';
import { WatchlistService } from '../services/watchlist.service';
import { Types } from 'mongoose';

export class WatchlistController {
  private static instance: WatchlistController;
  private constructor(private watchlistService: WatchlistService) {
    this.watchlistService = watchlistService;
  }

  static getInstance(watchlistService: WatchlistService): WatchlistController {
    if (!WatchlistController.instance) {
      WatchlistController.instance = new WatchlistController(watchlistService);
    }
    return WatchlistController.instance;
  }

  createWatchlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { name } = req.body;
      const watchlist = await this.watchlistService.createWatchlist(
        new Types.ObjectId(userId),
        name
      );
      return success(res, 'Watchlist created', watchlist);
    } catch (error) {
      next(error);
    }
  };

  getUserWatchlists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;

      const watchlists = await this.watchlistService.getUserWatchlists(
        new Types.ObjectId(userId)
      );

      return success(res, 'User watchlists fetched', watchlists);
    } catch (error) {
      next(error);
    }
  };

  getWatchlistById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { watchlistId } = req.params;

      const watchlist = await this.watchlistService.getWatchlistById(
        new Types.ObjectId(watchlistId)
      );

      return success(res, 'Watchlist details fetched', watchlist);
    } catch (error) {
      next(error);
    }
  };

  updateWatchlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { watchlistId } = req.params;
      const { name } = req.body;

      const watchlist = await this.watchlistService.updateWatchlist(
        new Types.ObjectId(watchlistId),
        name
      );

      return success(res, 'Watchlist updated', watchlist);
    } catch (error) {
      next(error);
    }
  };

  deleteWatchlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { watchlistId } = req.params;

      const watchlist = await this.watchlistService.deleteWatchlist(
        new Types.ObjectId(watchlistId)
      );

      return success(res, 'Watchlist deleted', watchlist);
    } catch (error) {
      next(error);
    }
  };

  addMovieToWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { watchlistId, movieId } = req.params;
      const watchlist = await this.watchlistService.addMovieToWatchlist(
        new Types.ObjectId(watchlistId),
        Number(movieId)
      );

      return success(res, 'Movie added to watchlist', watchlist);
    } catch (error) {
      next(error);
    }
  };

  removeMovieFromWatchlist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { watchlistId, movieId } = req.params;
      const watchlist = await this.watchlistService.removeMovieFromWatchlist(
        new Types.ObjectId(watchlistId),
        Number(movieId)
      );
      if (!watchlist) throw new NotFoundError('Watchlist not found');
      return success(res, 'Movie removed from watchlist', watchlist);
    } catch (error) {
      next(error);
    }
  };
}
