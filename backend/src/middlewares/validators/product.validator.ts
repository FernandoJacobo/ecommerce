import { body, param, query } from 'express-validator';

export const createProductValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Product name must be between 2 and 255 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),

    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),

    body('stock')
        .notEmpty()
        .withMessage('Stock is required')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),

    body('sku')
        .trim()
        .notEmpty()
        .withMessage('SKU is required')
        .matches(/^[A-Z0-9-]+$/)
        .withMessage('SKU must contain only uppercase letters, numbers, and hyphens')
        .isLength({ min: 3, max: 100 })
        .withMessage('SKU must be between 3 and 100 characters'),

    body('images')
        .isArray({ min: 1 })
        .withMessage('At least one image is required'),

    body('images.*')
        .isURL()
        .withMessage('Each image must be a valid URL'),

    body('categoryId')
        .notEmpty()
        .withMessage('Category ID is required')
        .isUUID()
        .withMessage('Invalid category ID format'),
];

export const updateProductValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid product ID'),

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Product name cannot be empty')
        .isLength({ min: 2, max: 255 })
        .withMessage('Product name must be between 2 and 255 characters'),

    body('description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Description cannot be empty')
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),

    body('price')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),

    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),

    body('sku')
        .optional()
        .trim()
        .matches(/^[A-Z0-9-]+$/)
        .withMessage('SKU must contain only uppercase letters, numbers, and hyphens'),

    body('images')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one image is required'),

    body('images.*')
        .optional()
        .isURL()
        .withMessage('Each image must be a valid URL'),

    body('categoryId')
        .optional()
        .isUUID()
        .withMessage('Invalid category ID format'),

    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
];

export const productIdValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid product ID'),
];

export const productSkuValidator = [
    param('sku')
        .trim()
        .matches(/^[A-Z0-9-]+$/)
        .withMessage('Invalid SKU format'),
];

export const updateStockValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid product ID'),

    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt()
        .withMessage('Quantity must be an integer'),
];

export const productFilterValidator = [
    query('categoryId')
        .optional()
        .isUUID()
        .withMessage('Invalid category ID'),

    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Min price must be a positive number'),

    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Max price must be a positive number'),

    query('search')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Search term must be at least 2 characters'),

    query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be true or false'),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('sortBy')
        .optional()
        .isIn(['name', 'price', 'createdAt', 'stock'])
        .withMessage('sortBy must be name, price, createdAt, or stock'),

    query('sortOrder')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('sortOrder must be ASC or DESC'),
];