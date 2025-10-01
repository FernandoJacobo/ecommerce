import { body, param, query } from 'express-validator';

export const createQuotationValidator = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('At least one item is required'),

    body('items.*.productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isUUID()
        .withMessage('Invalid product ID format'),

    body('items.*.quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('validUntil')
        .notEmpty()
        .withMessage('Valid until date is required')
        .isISO8601()
        .withMessage('Valid until must be a valid date')
        .custom((value) => {
            const date = new Date(value);
            if (date <= new Date()) {
                throw new Error('Valid until date must be in the future');
            }
            return true;
        }),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),

    body('customerNotes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Customer notes must not exceed 500 characters'),
];

export const updateQuotationStatusValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid quotation ID'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'])
        .withMessage('Invalid status'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),
];

export const convertToOrderValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid quotation ID'),

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
];

export const quotationIdValidator = [
    param('id')
        .isUUID()
        .withMessage('Invalid quotation ID'),
];

export const quotationNumberValidator = [
    param('quotationNumber')
        .trim()
        .notEmpty()
        .withMessage('Quotation number is required')
        .matches(/^QUOT-\d+-\d+$/)
        .withMessage('Invalid quotation number format'),
];

export const quotationFilterValidator = [
    query('status')
        .optional()
        .isIn(['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'])
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