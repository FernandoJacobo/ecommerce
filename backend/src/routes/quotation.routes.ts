import { Router } from 'express';
import { QuotationController } from '../controllers/quotation.controller';
import {
    createQuotationValidator,
    updateQuotationStatusValidator,
    convertToOrderValidator,
    quotationIdValidator,
    quotationNumberValidator,
    quotationFilterValidator,
} from '../middlewares/validators/quotation.validator';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';

const router : Router = Router();
const quotationController = new QuotationController();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para usuarios autenticados
router.post(
    '/',
    createQuotationValidator,
    validate,
    quotationController.create
);

router.get(
    '/',
    quotationFilterValidator,
    validate,
    quotationController.getAll
);

router.get(
    '/:id',
    quotationIdValidator,
    validate,
    quotationController.getById
);

router.get(
    '/number/:quotationNumber',
    quotationNumberValidator,
    validate,
    quotationController.getByQuotationNumber
);

router.post(
    '/:id/convert-to-order',
    convertToOrderValidator,
    validate,
    quotationController.convertToOrder
);

router.delete(
    '/:id',
    quotationIdValidator,
    validate,
    quotationController.delete
);

// Rutas solo para ADMIN
router.patch(
    '/:id/status',
    authorize('ADMIN'),
    updateQuotationStatusValidator,
    validate,
    quotationController.updateStatus
);

export default router;