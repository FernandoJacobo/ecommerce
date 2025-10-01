import { body, param, query } from 'express-validator';

export const createOrderValidator = [
    body('shippingAddress')
        .notEmpty()
        .withMessage('Shipping address is required')
        .isObject()
        .withMessage('Shipping address must be an object'),

    body('shippingAddress.street')
        .trim()
        .notEmpty()
        .withMessage('Street is required'),

    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),

    body('shippingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),

    body('shippingAddress.zipCode')
        .trim()
        .notEmpty()
        .withMessage('Zip code is required'),

    body('shippingAddress.country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),

    body('billingAddress')
        .notEmpty()
        .withMessage('Billing address is required')
        .isObject()
        .withMessage('Billing address must be an object'),

    body('billingAddress.street')
        .trim()
        .notEmpty()
        .withMessage('Street is required'),

    body('billingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),

    body('billingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),

    body('billingAddress.zipCode')
        .trim()
        .notEmpty()
        .withMessage('Zip code is required'),

    body('billingAddress.country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),

    body('paymentMethod')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Payment method cannot be empty'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),
];

export const updateOrderStatusValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid order ID'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
        .withMessage('Invalid status'),

    body('paymentStatus')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Payment status cannot be empty'),
];

export const orderIdValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid order ID'),
];

export const orderNumberValidator = [
    param('orderNumber')
        .trim()
        .notEmpty()
        .withMessage('Order number is required')
        .matches(/^ORD-\d+-\d+$/)
        .withMessage('Invalid order number format'),
];

export const orderFilterValidator = [
    query('status')
        .optional()
        .isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
        .withMessage('Invalid status'),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];