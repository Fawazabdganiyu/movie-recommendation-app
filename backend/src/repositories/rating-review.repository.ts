import { Model, Types } from 'mongoose';
import { RatingReview, RatingReviewDocument } from '../types';

export class RatingReviewRepository {
  private static instance: RatingReviewRepository;

  private constructor(private model: Model<RatingReviewDocument>) {
    this.model = model;
  }

  static getInstance(
    model: Model<RatingReviewDocument>
  ): RatingReviewRepository {
    if (!RatingReviewRepository.instance) {
      RatingReviewRepository.instance = new RatingReviewRepository(model);
    }
    return RatingReviewRepository.instance;
  }

  async createRatingReview(data: RatingReview): Promise<RatingReviewDocument> {
    const rating = new this.model(data);
    return rating.save();
  }

  async updateRatingReview(
    data: RatingReview
  ): Promise<RatingReviewDocument | null> {
    const { movieId, userId } = data;
    return this.model.findOneAndUpdate(
      { movieId, userId },
      { $set: data },
      { new: true }
    );
  }

  async getMovieRatingsReviews(
    movieId: number
  ): Promise<RatingReviewDocument[]> {
    return this.model.find({ movieId });
  }

  async getUserRatingReviewForMovie(
    movieId: number,
    userId: Types.ObjectId
  ): Promise<RatingReviewDocument | null> {
    return this.model.findOne({ movieId, userId });
  }
}
