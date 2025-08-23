import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/api.error';

/**
 * Not Found middleware for handling 404 errors
 * This middleware is called when no route matches the request
 */
const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const message = `Route ${req.method} ${req.originalUrl} not found on this server`;

  // Log the not found request
  console.warn('🔍 404 Not Found:', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  const error = new NotFoundError(message);
  next(error);
};

/**
 * Method not allowed handler
 * For when a route exists but the HTTP method is not supported
 */
const methodNotAllowedHandler = (allowedMethods: string[]) => {
  return (req: Request, res: Response): void => {
    res.set('Allow', allowedMethods.join(', '));
    res.status(405).json({
      success: false,
      error: {
        message: `Method ${req.method} not allowed on ${req.originalUrl}`,
        statusCode: 405,
        allowedMethods,
      },
    });
  };
};

export { notFoundHandler, methodNotAllowedHandler };
