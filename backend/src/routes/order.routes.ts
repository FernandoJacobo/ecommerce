import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import {
    createOrderValidator,
    updateOrderStatusValidator,
    orderIdValidator,
    orderNumberValidator,
    orderFilterValidator,
} from '../middlewares/validators/order.validator';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';

const router : Router = Router();
const orderController = new OrderController();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para usuarios autenticados
router.post('/', createOrderValidator, validate, orderController.create);

router.get('/', orderFilterValidator, validate, orderController.getAll);

router.get('/:id', orderIdValidator, validate, orderController.getById);

router.get(
    '/number/:orderNumber',
    orderNumberValidator,
    validate,
    orderController.getByOrderNumber
);

router.patch(
    '/:id/cancel',
    orderIdValidator,
    validate,
    orderController.cancel
);

// Rutas solo para ADMIN
router.patch(
    '/:id/status',
    authorize('ADMIN'),
    updateOrderStatusValidator,
    validate,
    orderController.updateStatus
);

export default router;