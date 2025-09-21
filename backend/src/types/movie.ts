import { Document, Types } from 'mongoose';
import { z } from 'zod';
import {
  movieFilterSchema,
  movieRecommendationsSchema,
  movieSearchSchema,
} from '../validation/movie.validation';

export type MovieSearchInput = z.infer<typeof movieSearchSchema>;
export type MovieFilterInput = z.infer<typeof movieFilterSchema>;
export type MovieRecommendationsInput = z.infer<
  typeof movieRecommendationsSchema
>;

export interface WatchlistDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  movies: number[]; // Array of TMDB movie IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingReview {
  movieId: number;
  userId: Types.ObjectId;
  rating?: number;
  review?: string;
}
export interface RatingReviewDocument extends RatingReview, Document {
  createdAt: Date;
  updatedAt: Date;
}
