import { Types } from 'mongoose';
import { IUser } from '../interfaces';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { PasswordUtils } from '../utils/password/password.util';
import {
  AuthenticationError,
  DuplicateRequestError,
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
    const tokens = this.tokenService.generateTokenPair(user);

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

    const tokens = this.tokenService.generateTokenPair(user);
    return { user, tokens };
  }

  async getRefreshToken(
    user: IUser
  ): Promise<{ user: IUser; tokens: TokenPair }> {
    // For now, just verify user exists
    // In future, you might want to blacklist tokens
    await this.userService.getById(user._id);
    // Generate new token pair
    const tokens = this.tokenService.generateTokenPair(user);
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
