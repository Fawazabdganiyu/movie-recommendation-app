import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';

/**
 * Generic Zod Validation Middleware
 *
 * This middleware validates different parts of the request (body, params, query)
 * using Zod schemas and provides detailed error messages.
 */

interface ValidationConfig {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

/**
 * Creates a validation middleware for the specified request parts
 *
 * @param config - Object containing Zod schemas for body, params, and/or query
 * @returns Express middleware function
 *
 * @example
 * // Validate only request body
 * router.post('/login', validate({ body: loginSchema }), authController.login);
 *
 * // Validate params and query
 * router.get('/users/:id', validate({
 *   params: z.object({ id: mongoIdSchema }),
 *   query: paginationSchema
 * }), userController.getUser);
 */
export const validate = (config: ValidationConfig) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (config.body) {
        const validatedBody = await config.body.parseAsync(req.body);
        Object.assign(req.body, validatedBody);
      }

      // Validate request params
      if (config.params) {
        const validatedParams = await config.params.parseAsync(req.params);
        Object.assign(req.params, validatedParams);
      }

      // Validate request query
      if (config.query) {
        const validatedQuery = await config.query.parseAsync(req.query);
        Object.assign(req.query, validatedQuery);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Shorthand middleware functions for common validation scenarios
 */

/**
 * Validates only the request body
 * @param schema - Zod schema for request body
 */
export const validateBody = (schema: ZodType) => validate({ body: schema });

/**
 * Validates only the request params
 * @param schema - Zod schema for request params
 */
export const validateParams = (schema: ZodType) => validate({ params: schema });

/**
 * Validates only the request query
 * @param schema - Zod schema for request query
 */
export const validateQuery = (schema: ZodType) => validate({ query: schema });

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

// Movie ID param validation
export const movieIdParamSchema = z.object({
  movieId: z.coerce.number().min(1, 'Invalid movie ID'),
});
