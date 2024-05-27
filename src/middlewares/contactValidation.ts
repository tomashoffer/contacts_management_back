import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCreateContact = [
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('phone').notEmpty().withMessage('Phone is required'),
];

export const validateUpdateContact = [
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('address').optional().notEmpty().withMessage('Address is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('phone').optional().notEmpty().withMessage('Phone is required'),
];

export const handleContactValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};