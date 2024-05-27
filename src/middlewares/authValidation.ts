import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegisterUser = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('username').notEmpty().withMessage('Username is required'),
];

export const validateLoginUser = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];


export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
