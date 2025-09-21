import { Schema, model } from 'mongoose';
import { WatchlistDocument } from '../types';

const WatchlistSchema = new Schema<WatchlistDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    movies: [{ type: Number }], // TMDB movie IDs
  },
  { timestamps: true, versionKey: false }
);

export const WatchlistModel = model<WatchlistDocument>(
  'Watchlist',
  WatchlistSchema
);
