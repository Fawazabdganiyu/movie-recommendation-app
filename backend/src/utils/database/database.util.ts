import { ModelResponse, PaginatedResponse } from '../../types';

// Common database utilities
export class DatabaseUtils {
  static createPaginationOptions(
    page = 1,
    limit = 20,
    maxLimit = 100
  ): { skip: number; limit: number; page: number } {
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(maxLimit, Math.max(1, Math.floor(limit)));
    const skip = (validPage - 1) * validLimit;

    return {
      skip,
      limit: validLimit,
      page: validPage,
    };
  }

  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    const pages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    };
  }

  static handleDatabaseError(error: any): ModelResponse<null> {
    console.error('Database error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return {
        success: false,
        error: 'Validation Error',
        message: messages.join(', '),
      };
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return {
        success: false,
        error: 'Duplicate Error',
        message: `${field} already exists`,
      };
    }

    if (error.name === 'CastError') {
      return {
        success: false,
        error: 'Cast Error',
        message: 'Invalid ID format',
      };
    }

    return {
      success: false,
      error: 'Database Error',
      message: error.message || 'An unexpected database error occurred',
    };
  }
}
