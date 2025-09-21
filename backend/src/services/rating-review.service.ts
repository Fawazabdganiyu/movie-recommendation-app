import { RatingReview, RatingReviewDocument } from '../types';
import { RatingReviewRepository } from '../repositories/rating-review.repository';
import { DuplicateRequestError, NotFoundError } from '../errors/api.error';
import { Types } from 'mongoose';

export class RatingReviewService {
  private static instance: RatingReviewService;
  private repo: RatingReviewRepository;

  private constructor(repo: RatingReviewRepository) {
    this.repo = repo;
  }

  static getInstance(repo: RatingReviewRepository): RatingReviewService {
    if (!RatingReviewService.instance) {
      RatingReviewService.instance = new RatingReviewService(repo);
    }
    return RatingReviewService.instance;
  }

  async createRatingReview(data: RatingReview): Promise<RatingReviewDocument> {
    const { movieId, userId } = data;
    const existing = await this.repo.getUserRatingReviewForMovie(
      movieId,
      userId
    );
    if (existing) {
      if (existing?.rating && data.rating)
        throw new DuplicateRequestError(
          'Rating already exists for this movie by the user'
        );

      if (existing?.review && data.review)
        throw new DuplicateRequestError(
          'Review already exists for this movie by the user'
        );

      // Allow adding review if only rating exists and vice versa
      return this.updateRatingReview(data);
    }

    return this.repo.createRatingReview(data);
  }

  async getUserRatingReviewForMovie(
    movieId: number,
    userId: Types.ObjectId
  ): Promise<RatingReviewDocument> {
    const rating = await this.repo.getUserRatingReviewForMovie(movieId, userId);
    if (!rating) throw new NotFoundError('Rating not found');

    return rating;
  }

  async getMovieRatingsReviews(
    movieId: number
  ): Promise<RatingReviewDocument[]> {
    return this.repo.getMovieRatingsReviews(movieId);
  }

  async updateRatingReview(data: RatingReview): Promise<RatingReviewDocument> {
    const rating = await this.repo.updateRatingReview(data);
    if (!rating) throw new NotFoundError('Rating not found');

    return rating;
  }
}
