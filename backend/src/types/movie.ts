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
