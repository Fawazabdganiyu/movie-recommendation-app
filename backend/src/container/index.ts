// Centralized dependency container with lazy, on-demand singleton resolution.
// This minimizes startup cost and reduces accidental circular dependency chains.

import { UserRepository } from '../repositories/user.repository';
import { UserModel } from '../models/user.model';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { DatabaseConnection } from '../config';
import { TMDBService } from '../services/tmdb.service';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { WatchlistModel } from '../models/watchlist.model';
import { RatingReviewRepository } from '../repositories/rating-review.repository';
import { RatingReviewService } from '../services/rating-review.service';
import { RatingReviewModel } from '../models/rating-review.model';

let _userRepository: UserRepository | undefined;
let _watchlistRepository: WatchlistRepository | undefined;
let _ratingReviewRepository: RatingReviewRepository | undefined;

let _tokenService: TokenService | undefined;
let _userService: UserService | undefined;
let _authService: AuthService | undefined;
let _dbConnection: DatabaseConnection | undefined;

let _tmdbService: TMDBService | undefined;
let _watchlistService: WatchlistService | undefined;
let _rateingReviewService: RatingReviewService | undefined;

const getUserRepository = (): UserRepository => {
  return (_userRepository ||= UserRepository.getInstance(UserModel));
};

const getWatchlistRepository = (): WatchlistRepository => {
  return (_watchlistRepository ||=
    WatchlistRepository.getInstance(WatchlistModel));
};

const getRatingsReviewRepository = (): RatingReviewRepository => {
  return (_ratingReviewRepository ||=
    RatingReviewRepository.getInstance(RatingReviewModel));
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

export const getWatchlistService = (): WatchlistService => {
  return (_watchlistService ||= WatchlistService.getInstance(
    getWatchlistRepository()
  ));
};

export const getRatingReviewService = (): RatingReviewService => {
  return (_rateingReviewService ||= RatingReviewService.getInstance(
    getRatingsReviewRepository()
  ));
};
