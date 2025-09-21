import { z } from 'zod';

/**
 * Common validation schemas for route parameters
 */

// MongoDB ObjectId validation
export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});

// Numeric ID validation (for external APIs like TMDB)
export const numericIdParamSchema = z.object({
  id: z.coerce.number().min(1, 'ID must be a positive number'),
});

// User ID param validation
export const userIdParamSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});
