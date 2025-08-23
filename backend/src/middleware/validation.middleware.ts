import { Response, Request, NextFunction } from 'express';
import { BadRequestError } from '../errors/api.error';

// Validation middleware for user data
const validateUserData = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.body || !Object.keys(req.body).length)
    return next(new BadRequestError('Name, email, and age are required'));

  const { name, email, age } = req.body;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0)
    return next(new BadRequestError('Name is required'));

  const trimmedName = name.trim();

  if (trimmedName.length > 100)
    return next(new BadRequestError('Name must be 100 characters or less'));

  // Validate email
  if (!email || typeof email !== 'string' || email.trim().length === 0)
    return next(new BadRequestError('Email is required'));

  const trimmedEmail = email.trim();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail))
    return next(new BadRequestError('Invalid email format'));

  if (trimmedEmail.length > 100)
    return next(new BadRequestError('Email must be 100 characters or less'));

  // Validate age
  if (age === undefined || age === null)
    return next(new BadRequestError('Age is required'));

  if (!Number.isInteger(age) || age < 0 || age > 150)
    return next(
      new BadRequestError('Age must be a valid integer between 0 and 150')
    );

  // Trim whitespace for strings
  req.body.name = trimmedName;
  req.body.email = trimmedEmail;
  req.body.age = age;

  next();
};

// Validation middleware for ID parameter
const validateIdParam = (req: Request, _res: Response, next: NextFunction) => {
  const id = req.params.id;

  // For integer IDs, validate that it's a positive integer
  if (parseInt(id) <= 0) {
    return next(new BadRequestError('Invalid ID format'));
  }

  next();
};

export { validateUserData, validateIdParam };
