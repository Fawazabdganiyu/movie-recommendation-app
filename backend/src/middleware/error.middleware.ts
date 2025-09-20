import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

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
  let errorMessage = error.message;
  let err = `${error.error}${error.errors?.length ? ' - ' + error.errors.join(', ') : ''}`;

  // Log the error details
  console.error('Request Error', {
    error: {
      message: error.response?.data || error.message,
      stack: axios.isAxiosError(error) ? '' : error.stack, // Avoid logging stack for Axios errors
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
    errorMessage = error.message || 'Invalid JSON format in request body';
  }

  if (error instanceof ZodError) {
    // Format Zod validation errors into user-friendly messages
    const errors = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      value: 'input' in issue ? issue.input : undefined,
    }));

    errorMessage = errors
      .map((err) => `${err.field}: ${err.message}`)
      .join(', ');

    errorMessage = `Validation failed: ${errorMessage}`;
  }

  if (axios.isAxiosError(error)) {
    err = 'ExternalServiceError';
    errorMessage = `${error.response?.statusText || error.message}`;
  }

  res.status(error.status || 500).json({
    success: false,
    error: err || 'Internal Server Error',
    message: errorMessage || 'An unexpected error occurred',
  });
};
