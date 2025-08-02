import { Types } from 'mongoose';
import { IUser } from '../interfaces';
import { TokenPair, tokenService, userService, UserService } from '.';
import { PasswordUtils } from '../utils';
import {
  AuthenticationError,
  DuplicateRequestError,
  ValidationError,
} from '../errors';

export class AuthService {
  private static instance: AuthService;

  private constructor(private userService: UserService) {}

  public static getInstance(userService: UserService): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(userService);
    }
    return AuthService.instance;
  }

  async register(userData: IUser): Promise<{ user: IUser; tokens: TokenPair }> {
    // Validate password
    const validation = PasswordUtils.validateStrength(userData.password);
    if (!validation.isValid) {
      throw new ValidationError('Weak password', validation.errors);
    }

    // Check if user exists
    const existingUser = await this.userService.getByEmail(userData.email);
    if (existingUser) {
      throw new DuplicateRequestError('User already exists');
    }

    // Create user (password hashing handled in repository)
    const user = await this.userService.create(userData);
    const tokens = tokenService.generateTokenPair(user);

    return { user, tokens };
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

    const tokens = tokenService.generateTokenPair(user);
    return { user, tokens };
  }

  async getRefreshToken(
    user: IUser
  ): Promise<{ user: IUser; tokens: TokenPair }> {
    // For now, just verify user exists
    // In future, you might want to blacklist tokens
    await this.userService.getById(user._id);
    // Generate new token pair
    const tokens = tokenService.generateTokenPair(user);
    return { user, tokens };
  }

  async logout(userId: Types.ObjectId): Promise<void> {
    // For now, just verify user exists
    // In future, you might want to blacklist tokens
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // TODO: Implement token blacklisting if needed
  }
}

export const authService = AuthService.getInstance(userService);
