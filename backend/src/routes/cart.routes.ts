import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import {
    addToCartValidator,
    updateCartItemValidator,
    cartItemIdValidator,
} from '../middlewares/validators/cart.validator';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';

const router: Router = Router();
const cartController = new CartController();

// Todas las rutas del carrito requieren autenticación
router.use(authenticate);

// Obtener carrito
router.get('/', cartController.getCart);

// Agregar item al carrito
router.post('/items', addToCartValidator, validate, cartController.addItem);

// Actualizar item del carrito
router.put(
    '/items/:itemId',
    updateCartItemValidator,
    validate,
    cartController.updateItem
);

// Eliminar item del carrito
router.delete(
    '/items/:itemId',
    cartItemIdValidator,
    validate,
    cartController.removeItem
);

// Limpiar carrito
router.delete('/', cartController.clearCart);

export default router;