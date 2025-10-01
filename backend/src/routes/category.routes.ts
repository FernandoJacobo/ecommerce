import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import {
    createCategoryValidator,
    updateCategoryValidator,
    categoryIdValidator,
    categorySlugValidator,
} from '../middlewares/validators/category.validator';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';

const router: Router = Router();
const categoryController = new CategoryController();

// Rutas públicas
router.get('/', categoryController.getAll);
router.get('/:id', categoryIdValidator, validate, categoryController.getById);
router.get('/slug/:slug', categorySlugValidator, validate, categoryController.getBySlug);

// Rutas protegidas (solo ADMIN)
router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    createCategoryValidator,
    validate,
    categoryController.create
);

router.put(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    updateCategoryValidator,
    validate,
    categoryController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    categoryIdValidator,
    validate,
    categoryController.delete
);

export default router;