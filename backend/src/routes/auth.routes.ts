import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../middlewares/validators/auth.validator';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 */

const router: Router = Router();
const authController = new AuthController();

// Rutas públicas
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

// Rutas protegidas
router.get('/me', authenticate, authController.getMe);

export default router;