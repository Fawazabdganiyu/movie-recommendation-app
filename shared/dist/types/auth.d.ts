import { loginSchema, registerSchema } from "../validation";
import type { User } from "./user";
import { z } from "zod";
/**
 * JWT Token Pair
 */
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
}
/**
 * Authentication Response
 * Returned by login and register endpoints
 */
export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}
/**
 * Form Data Types for Authentication
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
/**
 * Password Reset Types
 */
export interface ForgotPasswordRequest {
    email: string;
}
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}
/**
 * Email Verification Types
 */
export interface VerifyEmailRequest {
    token: string;
}
export interface ResendVerificationRequest {
    email: string;
}
//# sourceMappingURL=auth.d.ts.map