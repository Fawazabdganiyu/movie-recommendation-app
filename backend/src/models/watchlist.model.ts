import { Schema, model, Types } from 'mongoose';
import { WatchlistDocument } from '../types';

const WatchlistSchema = new Schema<WatchlistDocument>({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  movies: [{ type: Number }], // TMDB movie IDs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const WatchlistModel = model<WatchlistDocument>(
  'Watchlist',
  WatchlistSchema
);
