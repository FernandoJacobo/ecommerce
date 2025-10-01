import { body, param } from 'express-validator';

export const createCategoryValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Category name must be between 2 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),

    body('slug')
        .trim()
        .notEmpty()
        .withMessage('Slug is required')
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug must be lowercase, alphanumeric with hyphens only (e.g., electronics, home-decor)')
        .isLength({ min: 2, max: 100 })
        .withMessage('Slug must be between 2 and 100 characters'),
];

export const updateCategoryValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid category ID'),

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Category name cannot be empty')
        .isLength({ min: 2, max: 100 })
        .withMessage('Category name must be between 2 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),

    body('slug')
        .optional()
        .trim()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug must be lowercase, alphanumeric with hyphens only'),
];

export const categoryIdValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid category ID'),
];

export const categorySlugValidator = [
    param('slug')
        .trim()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Invalid slug format'),
];