// Centralized dependency container with lazy, on-demand singleton resolution.
// This minimizes startup cost and reduces accidental circular dependency chains.

import { UserRepository } from '../repositories/user.repository';
import { UserModel } from '../models/user.model';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { DatabaseConnection } from '../config';
import { TMDBService } from '../services/tmdb.service';

let _userRepository: UserRepository | undefined;

let _tokenService: TokenService | undefined;
let _userService: UserService | undefined;
let _authService: AuthService | undefined;
let _dbConnection: DatabaseConnection | undefined;

let _tmdbService: TMDBService | undefined;

const getUserRepository = (): UserRepository => {
  return (_userRepository ||= UserRepository.getInstance(UserModel));
};

// Public accessors (idempotent)
export const getDbConnection = (): DatabaseConnection => {
  return (_dbConnection ||= DatabaseConnection.getInstance());
};

export const getTokenService = (): TokenService => {
  return (_tokenService ||= TokenService.getInstance());
};

export const getUserService = (): UserService => {
  return (_userService ||= UserService.getInstance(getUserRepository()));
};

export const getAuthService = (): AuthService => {
  return (_authService ||= AuthService.getInstance(
    getUserService(),
    getTokenService()
  ));
};

export const getTmdbService = (): TMDBService => {
  return (_tmdbService ||= TMDBService.getInstance());
};
