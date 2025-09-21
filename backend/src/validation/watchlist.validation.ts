import { z } from 'zod';

export const watchlistIdParamSchema = z.object({
  watchlistId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid watchlist ID format'),
});

export const createWatchlistSchema = z.object({
  name: z
    .string()
    .min(2, 'Watchlist name must be at least 2 characters')
    .max(100, 'Watchlist name must be 100 characters or less'),
});

export const updateWatchlistSchema = z.object({
  name: z
    .string()
    .min(2, 'Watchlist name must be at least 2 characters')
    .max(100, 'Watchlist name must be 100 characters or less'),
});
