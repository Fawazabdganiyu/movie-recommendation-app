import { CustomError } from '.';

export class AuthenticationError extends CustomError {
  constructor(message: string) {
    super(401, 'Unauthorized', message);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string) {
    super(403, 'Forbidden', message);
  }
}

export class ValidationError extends CustomError {
  public readonly errors?: string[];

  constructor(message: string, errors: string[] = []) {
    super(400, 'Validation Error', message);
    this.errors = errors;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(400, 'Bad Request', message);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(404, 'Not Found', message);
  }
}

export class DuplicateRequestError extends CustomError {
  constructor(message: string) {
    super(409, 'Conflict', message);
  }
}
