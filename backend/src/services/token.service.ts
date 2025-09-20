import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { AuthTokens, User } from '@shared/types';
import { TokenType } from '../enums/token.enum';
import { DecodedToken, TokenPayload } from '../types/auth';
import { AuthorizationError } from '../errors/api.error';

export class TokenService {
  private static instance: TokenService;
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  private constructor() {
    this.accessTokenSecret = config.jwt.secret;
    this.refreshTokenSecret = config.jwt.refreshSecret;
    this.accessTokenExpiry = config.jwt.expiresIn;
    this.refreshTokenExpiry = config.jwt.refreshExpiresIn;
  }

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Generate access token for user
   */
  generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      type: TokenType.ACCESS,
    };

    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'movie-recommendation-app',
      audience: 'movie-app-users',
    } as SignOptions);
  }

  /**
   * Generate refresh token for user
   */
  generateRefreshToken(user: User): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      type: TokenType.REFRESH,
    };

    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'movie-recommendation-app',
      audience: 'movie-app-users',
    } as SignOptions);
  }

  /**
   * Generate both access and refresh tokens
   */
  generateTokenPair(user: User): AuthTokens {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): DecodedToken {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'movie-recommendation-app',
        audience: 'movie-app-users',
      }) as DecodedToken;

      if (decoded.type !== 'access') {
        throw new AuthorizationError('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthorizationError('Access token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthorizationError('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): DecodedToken {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'movie-recommendation-app',
        audience: 'movie-app-users',
      }) as DecodedToken;

      if (decoded.type !== 'refresh') {
        throw new AuthorizationError('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthorizationError('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthorizationError('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;
    return expiry < new Date();
  }
}
