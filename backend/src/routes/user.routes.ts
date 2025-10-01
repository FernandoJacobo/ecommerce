import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import {
    updateUserValidator,
    userIdValidator,
    userFilterValidator,
} from '../middlewares/validators/user.validator';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';

const router : Router = Router();
const userController = new UserController();

// Todas las rutas requieren autenticación y rol ADMIN
router.use(authenticate);
router.use(authorize('ADMIN'));

// Rutas de usuarios
router.get('/statistics', userController.getStatistics);

router.get('/', userFilterValidator, validate, userController.getAll);

router.get('/:id', userIdValidator, validate, userController.getById);

router.put(
    '/:id',
    updateUserValidator,
    validate,
    userController.update
);

router.delete('/:id', userIdValidator, validate, userController.delete);

export default router;