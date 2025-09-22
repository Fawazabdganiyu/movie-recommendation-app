import { z } from 'zod';

// Movie ID param validation
export const movieIdParamSchema = z.object({
  movieId: z.coerce.number().min(1, 'Invalid movie ID'),
});

export const movieSearchSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty.'),
  page: z
    .preprocess(
      (val) => parseInt(z.string().parse(val), 10),
      z
        .number()
        .int()
        .positive('Page number must be a positive integer.')
        .default(1)
    )
    .optional(),
});

export const movieFilterSchema = z.object({
  genre: z
    .string()
    .transform((val) => val.split(',').map(Number))
    .pipe(z.array(z.number().int().positive()))
    .optional(),
  minRating: z
    .preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z
        .number()
        .min(0, 'Minimum rating must be at least 0')
        .max(10, 'Minimum rating cannot exceed 10')
    )
    .optional(),
  maxRating: z
    .preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z
        .number()
        .min(0, 'Maximum rating must be at least 0')
        .max(10, 'Maximum rating cannot exceed 10')
    )
    .optional(),
  releaseDateGte: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Release date must be in YYYY-MM-DD format')
    .optional(),
  releaseDateLte: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Release date must be in YYYY-MM-DD format')
    .optional(),
  sortBy: z
    .enum([
      'popularity.desc',
      'popularity.asc',
      'vote_average.desc',
      'vote_average.asc',
      'release_date.desc',
      'release_date.asc',
      'title.asc',
      'title.desc',
    ])
    .default('popularity.desc')
    .optional(),
  page: z
    .preprocess(
      (val) => parseInt(z.string().parse(val), 10),
      z
        .number()
        .int()
        .positive('Page number must be a positive integer.')
        .default(1)
    )
    .optional(),
});

export const movieRecommendationsSchema = z.object({
  genreIds: z
    .string()
    .transform((val) => val.split(',').map(Number))
    .pipe(z.array(z.number().int().positive()))
    .optional(),
  minRating: z
    .preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z
        .number()
        .min(0, 'Minimum rating must be at least 0')
        .max(10, 'Minimum rating cannot exceed 10')
        .default(6.0)
    )
    .optional(),
  page: z
    .preprocess(
      (val) => parseInt(z.string().parse(val), 10),
      z
        .number()
        .int()
        .positive('Page number must be a positive integer.')
        .default(1)
    )
    .optional(),
});
