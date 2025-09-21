import { Model, Types } from 'mongoose';
import { WatchlistDocument } from '../types';

export class WatchlistRepository {
  private static instance: WatchlistRepository;

  private constructor(private watchlistModel: Model<WatchlistDocument>) {
    this.watchlistModel = watchlistModel;
  }

  static getInstance(
    watchlistModel: Model<WatchlistDocument>
  ): WatchlistRepository {
    if (!WatchlistRepository.instance) {
      WatchlistRepository.instance = new WatchlistRepository(watchlistModel);
    }
    return WatchlistRepository.instance;
  }

  async createWatchlist(userId: Types.ObjectId, name: string) {
    return this.watchlistModel.create({ userId, name, movies: [] });
  }

  async getUserWatchlists(userId: Types.ObjectId) {
    return this.watchlistModel.find({ userId });
  }

  async getWatchlistById(watchlistId: Types.ObjectId) {
    return this.watchlistModel.findById(watchlistId);
  }

  async updateWatchlist(watchlistId: Types.ObjectId, name: string) {
    return this.watchlistModel.findByIdAndUpdate(
      watchlistId,
      { name, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteWatchlist(watchlistId: Types.ObjectId) {
    return this.watchlistModel.findByIdAndDelete(watchlistId);
  }

  async addMovieToWatchlist(watchlistId: Types.ObjectId, movieId: number) {
    return this.watchlistModel.findByIdAndUpdate(
      watchlistId,
      { $addToSet: { movies: movieId }, updatedAt: new Date() },
      { new: true }
    );
  }

  async removeMovieFromWatchlist(watchlistId: Types.ObjectId, movieId: number) {
    return this.watchlistModel.findByIdAndUpdate(
      watchlistId,
      { $pull: { movies: movieId }, updatedAt: new Date() },
      { new: true }
    );
  }
}
