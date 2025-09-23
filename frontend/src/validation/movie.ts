import { z } from "zod";

export const createOrUpdateRatingSchema = z.object({
  rating: z.number().min(1).max(10).optional(),
  review: z.string().min(1).max(500).optional(),
});
