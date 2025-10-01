import { body, param, query } from 'express-validator';

export const updateUserValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid user ID'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long'),

    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long'),

    body('role')
        .optional()
        .isIn(['USER', 'ADMIN'])
        .withMessage('Role must be USER or ADMIN'),

    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

export const userIdValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid user ID'),
];

export const userFilterValidator = [
    query('role')
        .optional()
        .isIn(['USER', 'ADMIN'])
        .withMessage('Role must be USER or ADMIN'),

    query('search')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Search term must be at least 2 characters'),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];