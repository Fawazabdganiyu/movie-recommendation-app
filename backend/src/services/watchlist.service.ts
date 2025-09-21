import { Types } from 'mongoose';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { BadRequestError, NotFoundError } from '../errors/api.error';

export class WatchlistService {
  private static instance: WatchlistService;
  private readonly repository: WatchlistRepository;

  private constructor(repository: WatchlistRepository) {
    this.repository = repository;
  }

  public static getInstance(repository: WatchlistRepository): WatchlistService {
    if (!WatchlistService.instance) {
      WatchlistService.instance = new WatchlistService(repository);
    }
    return WatchlistService.instance;
  }

  async createWatchlist(userId: Types.ObjectId, name: string) {
    const watchlist = await this.repository.createWatchlist(userId, name);
    return watchlist;
  }

  async getUserWatchlists(userId: Types.ObjectId) {
    return this.repository.getUserWatchlists(userId);
  }

  async getWatchlistById(watchlistId: Types.ObjectId) {
    const watchlist = await this.repository.getWatchlistById(watchlistId);
    if (!watchlist) throw new NotFoundError('Watchlist not found');

    return watchlist;
  }

  async updateWatchlist(watchlistId: Types.ObjectId, name: string) {
    const updatedWatchlist = await this.repository.updateWatchlist(
      watchlistId,
      name
    );
    if (!updatedWatchlist) throw new NotFoundError('Watchlist not found');

    return updatedWatchlist;
  }

  async deleteWatchlist(watchlistId: Types.ObjectId) {
    const deleted = await this.repository.deleteWatchlist(watchlistId);
    if (!deleted)
      throw new NotFoundError('Watchlist not found or already deleted');

    return deleted;
  }

  async addMovieToWatchlist(watchlistId: Types.ObjectId, movieId: number) {
    const updatedWatchlist = await this.repository.addMovieToWatchlist(
      watchlistId,
      movieId
    );
    if (!updatedWatchlist)
      throw new BadRequestError('Failed to add movie to watchlist');

    return updatedWatchlist;
  }

  async removeMovieFromWatchlist(watchlistId: Types.ObjectId, movieId: number) {
    const updatedWatchlist = await this.repository.removeMovieFromWatchlist(
      watchlistId,
      movieId
    );
    if (!updatedWatchlist)
      throw new BadRequestError('Failed to remove movie from watchlist');

    return updatedWatchlist;
  }
}
