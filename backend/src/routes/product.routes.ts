import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import {
    createProductValidator,
    updateProductValidator,
    productIdValidator,
    productSkuValidator,
    updateStockValidator,
    productFilterValidator,
} from '../middlewares/validators/product.validator';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';

const router: Router = Router();
const productController = new ProductController();

// Rutas públicas
router.get(
    '/',
    productFilterValidator,
    validate,
    productController.getAll
);

router.get(
    '/:id',
    productIdValidator,
    validate,
    productController.getById
);

router.get(
    '/sku/:sku',
    productSkuValidator,
    validate,
    productController.getBySku
);

// Rutas protegidas (solo ADMIN)
router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    createProductValidator,
    validate,
    productController.create
);

router.put(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    updateProductValidator,
    validate,
    productController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    productIdValidator,
    validate,
    productController.delete
);

router.patch(
    '/:id/stock',
    authenticate,
    authorize('ADMIN'),
    updateStockValidator,
    validate,
    productController.updateStock
);

router.patch(
    '/:id/toggle-active',
    authenticate,
    authorize('ADMIN'),
    productIdValidator,
    validate,
    productController.toggleActive
);

export default router;