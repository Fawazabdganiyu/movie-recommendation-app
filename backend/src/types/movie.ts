import { Document, ObjectId } from 'mongoose';
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
  userId: ObjectId;
  name: string;
  movies: number[]; // Array of TMDB movie IDs
  createdAt: Date;
  updatedAt: Date;
}
