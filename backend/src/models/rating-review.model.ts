import { model, Schema } from 'mongoose';
import { RatingReviewDocument } from '../types';

const RatingReviewSchema: Schema = new Schema(
  {
    movieId: { type: Number, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, min: 1, max: 10 },
    review: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const RatingReviewModel = model<RatingReviewDocument>(
  'Rating',
  RatingReviewSchema
);
