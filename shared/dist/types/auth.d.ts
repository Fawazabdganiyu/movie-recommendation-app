import { z } from 'zod';
import type { User } from './user';
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
export interface LoginFormData {
    email: string;
    password: string;
}
export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}
/**
 * Validation Schemas using Zod
 * These can be used on both frontend and backend
 */
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
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