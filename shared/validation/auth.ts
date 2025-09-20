import { z } from "zod";

/**
 * Validation Schemas using Zod
 * These can be used on both frontend and backend
 */
export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be 128 characters or less"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less")
    .transform((val) => val.trim()),
  email: z
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be 128 characters or less")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be 128 characters or less")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Common validation schemas for IDs and params
export const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .min(1, "Page must be at least 1")
    .optional()
    .default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(10),
});
