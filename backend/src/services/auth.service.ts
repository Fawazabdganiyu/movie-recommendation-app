import { Types } from 'mongoose';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import {
  AuthenticationError,
  DuplicateRequestError,
  NotFoundError,
} from '../errors/api.error';
import { AuthTokens, User } from '../types';

export class AuthService {
  private static instance: AuthService;

  private constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  public static getInstance(
    userService: UserService,
    tokenService: TokenService
  ): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(userService, tokenService);
    }
    return AuthService.instance;
  }

  async register(userData: User): Promise<void> {
    const { email } = userData;

    // Check if user exists
    try {
      const existingUser = await this.userService.getByEmail(email);
      if (existingUser) {
        throw new DuplicateRequestError('User already exists');
      }
    } catch (err) {
      if (!(err instanceof NotFoundError)) throw err;
    }

    // Create user (password hashing handled in repository)
    await this.userService.create(userData);
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.userService.getByCredentials(email, password);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userService.update(user._id as Types.ObjectId, {
      lastLogin: user.lastLogin,
    });

    const tokens = this.tokenService.generateTokenPair(user);
    return { user, tokens };
  }

  async getRefreshToken(user: User): Promise<string> {
    // Generate new access token
    const accessToken = this.tokenService.generateAccessToken(user);
    return accessToken;
  }

  async logout(userId: Types.ObjectId): Promise<void> {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
  }
}
