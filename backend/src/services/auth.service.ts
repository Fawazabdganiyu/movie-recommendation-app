import { Types } from 'mongoose';
import { IUser } from '../interfaces';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { PasswordUtils } from '../utils/password/password.util';
import {
  AuthenticationError,
  DuplicateRequestError,
  NotFoundError,
  ValidationError,
} from '../errors/api.error';
import { TokenPair } from '../interfaces/services/token.service.interface';

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

  async register(userData: IUser): Promise<void> {
    const { email, password } = userData;
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Validate password
    const validation = PasswordUtils.validateStrength(password);
    if (!validation.isValid) {
      throw new ValidationError('Weak password', validation.errors);
    }

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
  ): Promise<{ user: IUser; tokens: TokenPair }> {
    const user = await this.userService.getByCredentials(email, password);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userService.update(user._id, {
      lastLogin: user.lastLogin,
    });

    const tokens = this.tokenService.generateTokenPair(user);
    return { user, tokens };
  }

  async getRefreshToken(user: IUser): Promise<string> {
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
