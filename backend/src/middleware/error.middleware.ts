import { NextFunction, Request, Response } from 'express';

// Handle 404 Not Found for invalid routes
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

// Global error handler
export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error: ', error);

  // Handle JSON parsing errors
  if (
    error instanceof SyntaxError &&
    (error as any).status === 400 &&
    'body' in error
  ) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON format in request body',
    });
  }

  res.status(error.status || 500).json({
    error: error.error || 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
  });
};
