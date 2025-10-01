import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { asyncHandler } from '../utils/asyncHandler';

const cartService = new CartService();

export class CartController {
    /**
     * @swagger
     * /api/cart:
     *   get:
     *     summary: Obtener carrito del usuario
     *     description: Obtiene el carrito actual del usuario autenticado con todos sus items y totales
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Carrito obtenido exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   type: object
     *                   properties:
     *                     cart:
     *                       type: object
     *                       properties:
     *                         cartId:
     *                           type: string
     *                           format: uuid
     *                         items:
     *                           type: array
     *                           items:
     *                             type: object
     *                             properties:
     *                               id:
     *                                 type: string
     *                               productId:
     *                                 type: string
     *                               quantity:
     *                                 type: integer
     *                               product:
     *                                 type: object
     *                               itemTotal:
     *                                 type: number
     *                         itemCount:
     *                           type: integer
     *                         total:
     *                           type: number
     *       401:
     *         description: No autenticado
     */
    getCart = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;

        const cart = await cartService.getCartByUserId(userId);

        res.status(200).json({
            status: 'success',
            data: { cart },
        });
    });

    /**
     * @swagger
     * /api/cart/items:
     *   post:
     *     summary: Agregar producto al carrito
     *     description: Agrega un producto al carrito o incrementa su cantidad si ya existe
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - productId
     *               - quantity
     *             properties:
     *               productId:
     *                 type: string
     *                 format: uuid
     *                 description: ID del producto a agregar
     *                 example: 550e8400-e29b-41d4-a716-446655440000
     *               quantity:
     *                 type: integer
     *                 minimum: 1
     *                 description: Cantidad a agregar
     *                 example: 2
     *     responses:
     *       200:
     *         description: Producto agregado al carrito exitosamente
     *       400:
     *         description: Stock insuficiente o producto no disponible
     *       401:
     *         description: No autenticado
     *       404:
     *         description: Producto no encontrado
     */
    addItem = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { productId, quantity } = req.body;

        const cart = await cartService.addItem({
            userId,
            productId,
            quantity,
        });

        res.status(200).json({
            status: 'success',
            message: 'Product added to cart successfully',
            data: { cart },
        });
    });

    /**
     * @swagger
     * /api/cart/items/{itemId}:
     *   put:
     *     summary: Actualizar cantidad de un item
     *     description: Actualiza la cantidad de un producto específico en el carrito
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: itemId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID del item del carrito
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - quantity
     *             properties:
     *               quantity:
     *                 type: integer
     *                 minimum: 1
     *                 description: Nueva cantidad
     *                 example: 5
     *     responses:
     *       200:
     *         description: Cantidad actualizada exitosamente
     *       400:
     *         description: Stock insuficiente
     *       401:
     *         description: No autenticado
     *       404:
     *         description: Item no encontrado
     */
    updateItem = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { itemId } = req.params;
        const { quantity } = req.body;

        const cart = await cartService.updateItem(userId, itemId, { quantity });

        res.status(200).json({
            status: 'success',
            message: 'Cart item updated successfully',
            data: { cart },
        });
    });

    /**
     * @swagger
     * /api/cart/items/{itemId}:
     *   delete:
     *     summary: Eliminar item del carrito
     *     description: Elimina un producto específico del carrito
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: itemId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID del item del carrito
     *     responses:
     *       200:
     *         description: Item eliminado exitosamente
     *       401:
     *         description: No autenticado
     *       404:
     *         description: Item no encontrado
     */
    removeItem = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { itemId } = req.params;

        const cart = await cartService.removeItem(userId, itemId);

        res.status(200).json({
            status: 'success',
            message: 'Item removed from cart successfully',
            data: { cart },
        });
    });

    /**
     * @swagger
     * /api/cart:
     *   delete:
     *     summary: Limpiar carrito
     *     description: Elimina todos los items del carrito del usuario
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Carrito limpiado exitosamente
     *       401:
     *         description: No autenticado
     *       404:
     *         description: Carrito no encontrado
     */
    clearCart = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;

        const result = await cartService.clearCart(userId);

        res.status(200).json({
            status: 'success',
            message: result.message,
        });
    });
}