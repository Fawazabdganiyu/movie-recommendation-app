import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { userRepository } from '../repositories';
import { AuthMiddlewareOptions, IUser } from '../interfaces';
import { DecodedToken, tokenService } from '../services';
import { AuthenticationError, AuthorizationError } from '../errors';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: DecodedToken;
    }
  }
}

/**
 * Main authentication middleware
 */
export const authenticate = (options: AuthMiddlewareOptions = {}) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { required = true, skipUserFetch = false } = options;

      // Extract token from header
      const authHeader = req.headers.authorization;
      const token = tokenService.extractTokenFromHeader(authHeader);

      // Handle missing token
      if (!token) {
        if (required) {
          throw new AuthenticationError('Access token required');
        }
        return next(); // Optional auth, continue without user
      }

      // Verify token
      let decoded: DecodedToken;
      try {
        decoded = tokenService.verifyAccessToken(token);
      } catch (error) {
        if (required) {
          throw new AuthenticationError('Invalid or expired token');
        }
        return next(); // Optional auth, continue without user
      }

      // Attach decoded token to request
      req.token = decoded;

      // Fetch user if needed
      if (!skipUserFetch) {
        const user = await userRepository.findById(
          new Types.ObjectId(decoded.userId)
        );

        if (!user) {
          throw new AuthenticationError('User not found');
        }

        if (!user.isActive) {
          throw new AuthenticationError('Account is deactivated');
        }

        // Attach user to request
        req.user = user;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Require authentication (shorthand)
 */
export const requireAuth = authenticate({ required: true });

/**
 * Optional authentication (shorthand)
 */
export const optionalAuth = authenticate({ required: false });

/**
 * Require authentication without fetching user data
 */
export const requireAuthLite = authenticate({
  required: true,
  skipUserFetch: true,
});

/**
 * Authorization middleware for role-based access
 */
export const authorize = (allowedRoles: string[] = []) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      // For now, we don't have roles in user model
      // This is prepared for future role implementation
      if (allowedRoles.length > 0) {
        // TODO: Implement role checking when roles are added to user model
        // const userRoles = req.user.roles || [];
        // const hasPermission = allowedRoles.some(role => userRoles.includes(role));
        // if (!hasPermission) {
        //   throw new AuthorizationError('Insufficient permissions');
        // }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user owns the resource
 */
export const requireOwnership = (userIdField = 'userId') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      const resourceUserId = req.params[userIdField] || req.body[userIdField];
      const currentUserId = req.user._id.toString();

      if (resourceUserId !== currentUserId) {
        throw new AuthorizationError(
          'Access denied: Resource ownership required'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to validate refresh token
 */
export const validateRefreshToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AuthenticationError('Refresh token required');
    }

    // Verify refresh token
    const decoded = tokenService.verifyRefreshToken(refreshToken);

    // Fetch user to ensure they still exist and are active
    const user = await userRepository.findById(
      new Types.ObjectId(decoded.userId)
    );

    if (!user || !user.isActive) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Attach user and decoded token to request
    req.user = user;
    req.token = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to extract user ID from token without full authentication
 */
export const extractUserId = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = tokenService.extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = tokenService.verifyAccessToken(token);
        req.token = decoded;
      } catch {
        // Ignore token errors, just continue without user context
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Rate limiting by user
 */
export const rateLimitByUser = (
  maxRequests = 100,
  windowMs = 15 * 60 * 1000
) => {
  const userRequestCounts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  return (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user?._id.toString() || req.ip) as string;
    const now = Date.now();

    // Clean up expired entries
    for (const [key, value] of userRequestCounts) {
      if (now > value.resetTime) {
        userRequestCounts.delete(key);
      }
    }

    // Get or create user record
    let userRecord = userRequestCounts.get(userId);
    if (!userRecord || now > userRecord.resetTime) {
      userRecord = { count: 0, resetTime: now + windowMs };
      userRequestCounts.set(userId, userRecord);
    }

    // Check rate limit
    if (userRecord.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests',
        retryAfter: Math.ceil((userRecord.resetTime - now) / 1000),
      });
    }

    // Increment count
    userRecord.count++;

    next();
  };
};
