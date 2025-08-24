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
  // Log the error details
  console.error('Request Error', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      status: error.status || error.statusCode,
    },
  });
  // Handle JSON parsing errors
  if (
    error instanceof SyntaxError &&
    (error as any).status === 400 &&
    'body' in error
  ) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid JSON format in request body',
    });
  }

  res.status(error.status || 500).json({
    success: false,
    error:
      `${error.error}${error.errors?.length ? ' - ' + error.errors.join(', ') : ''}` ||
      'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
  });
};
