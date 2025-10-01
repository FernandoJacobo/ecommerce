import { body, param } from 'express-validator';

export const addToCartValidator = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isUUID()
    .withMessage('Invalid product ID format'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

export const updateCartItemValidator = [
  param('itemId')
    .isUUID()
    .withMessage('Invalid cart item ID'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

export const cartItemIdValidator = [
  param('itemId')
    .isUUID()
    .withMessage('Invalid cart item ID'),
];