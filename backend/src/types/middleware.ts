export interface AuthMiddlewareOptions {
  required?: boolean;
  roles?: string[];
  skipUserFetch?: boolean;
}
