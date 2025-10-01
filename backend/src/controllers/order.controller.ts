import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';

const orderService = new OrderService();

export class OrderController {
    /**
     * @swagger
     * /api/orders:
     *   post:
     *     summary: Crear orden desde el carrito
     *     description: Crea una nueva orden con los productos del carrito actual del usuario. Valida stock y actualiza inventario automáticamente.
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - shippingAddress
     *               - billingAddress
     *             properties:
     *               shippingAddress:
     *                 type: object
     *                 required:
     *                   - street
     *                   - city
     *                   - state
     *                   - zipCode
     *                   - country
     *                 properties:
     *                   street:
     *                     type: string
     *                     example: Av. Revolución 1234
     *                   city:
     *                     type: string
     *                     example: Guadalajara
     *                   state:
     *                     type: string
     *                     example: Jalisco
     *                   zipCode:
     *                     type: string
     *                     example: 44100
     *                   country:
     *                     type: string
     *                     example: México
     *               billingAddress:
     *                 type: object
     *                 required:
     *                   - street
     *                   - city
     *                   - state
     *                   - zipCode
     *                   - country
     *                 properties:
     *                   street:
     *                     type: string
     *                   city:
     *                     type: string
     *                   state:
     *                     type: string
     *                   zipCode:
     *                     type: string
     *                   country:
     *                     type: string
     *               paymentMethod:
     *                 type: string
     *                 example: credit_card
     *               notes:
     *                 type: string
     *                 example: Favor de tocar el timbre
     *     responses:
     *       201:
     *         description: Orden creada exitosamente
     *       400:
     *         description: Carrito vacío o stock insuficiente
     *       401:
     *         description: No autenticado
     *       404:
     *         description: Carrito no encontrado
     */
    create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

        const order = await orderService.createFromCart({
            userId,
            shippingAddress,
            billingAddress,
            paymentMethod,
            notes,
        });

        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: { order },
        });
    });

    /**
     * @swagger
     * /api/orders:
     *   get:
     *     summary: Listar órdenes
     *     description: Obtiene lista de órdenes. Los usuarios normales solo ven sus propias órdenes, los ADMIN ven todas.
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
     *         description: Filtrar por estado
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 20
     *     responses:
     *       200:
     *         description: Lista de órdenes obtenida exitosamente
     *       401:
     *         description: No autenticado
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const userRole = req.user!.role;

        const filters = {
            // Si no es ADMIN, solo ver sus propias órdenes
            userId: userRole !== 'ADMIN' ? userId : undefined,
            status: req.query.status as string,
            page: req.query.page ? parseInt(req.query.page as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        };

        const result = await orderService.findAll(filters);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    });

    /**
     * @swagger
     * /api/orders/{id}:
     *   get:
     *     summary: Obtener orden por ID
     *     description: Obtiene los detalles completos de una orden. Los usuarios solo pueden ver sus propias órdenes.
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Orden obtenida exitosamente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No tienes permiso para ver esta orden
     *       404:
     *         description: Orden no encontrada
     */
    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;
        const userRole = req.user!.role;

        const order = await orderService.findById(id);

        // Verificar permisos
        if (userRole !== 'ADMIN' && order.userId !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to view this order',
            });
        }

        res.status(200).json({
            status: 'success',
            data: { order },
        });
    });

    /**
     * @swagger
     * /api/orders/number/{orderNumber}:
     *   get:
     *     summary: Obtener orden por número
     *     description: Obtiene una orden usando su número único
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: orderNumber
     *         required: true
     *         schema:
     *           type: string
     *         example: ORD-1234567890-5678
     *     responses:
     *       200:
     *         description: Orden obtenida exitosamente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No tienes permiso
     *       404:
     *         description: Orden no encontrada
     */
    getByOrderNumber = asyncHandler(async (req: Request, res: Response) => {
        const { orderNumber } = req.params;
        const userId = req.user!.userId;
        const userRole = req.user!.role;

        const order = await orderService.findByOrderNumber(orderNumber);

        // Verificar permisos
        if (userRole !== 'ADMIN' && order.userId !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to view this order',
            });
        }

        res.status(200).json({
            status: 'success',
            data: { order },
        });
    });

    /**
     * @swagger
     * /api/orders/{id}/status:
     *   patch:
     *     summary: Actualizar estado de la orden
     *     description: Actualiza el estado de una orden. Solo usuarios ADMIN.
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - status
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
     *                 example: CONFIRMED
     *               paymentStatus:
     *                 type: string
     *                 example: paid
     *     responses:
     *       200:
     *         description: Estado actualizado exitosamente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Orden no encontrada
     */
    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await orderService.updateStatus(id, {
            status,
            paymentStatus,
        });

        res.status(200).json({
            status: 'success',
            message: 'Order status updated successfully',
            data: { order },
        });
    });

    /**
     * @swagger
     * /api/orders/{id}/cancel:
     *   patch:
     *     summary: Cancelar orden
     *     description: Cancela una orden y devuelve el stock. Los usuarios pueden cancelar sus propias órdenes si no han sido enviadas.
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Orden cancelada exitosamente
     *       400:
     *         description: No se puede cancelar la orden en su estado actual
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No tienes permiso para cancelar esta orden
     *       404:
     *         description: Orden no encontrada
     */
    cancel = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;
        const userRole = req.user!.role;

        const order = await orderService.cancel(id, userId, userRole === 'ADMIN');

        res.status(200).json({
            status: 'success',
            message: 'Order cancelled successfully',
            data: { order },
        });
    });
}