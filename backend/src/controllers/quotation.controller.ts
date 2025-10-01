import { Request, Response } from 'express';
import { QuotationService } from '../services/quotation.service';
import { asyncHandler } from '../utils/asyncHandler';

const quotationService = new QuotationService();

export class QuotationController {
  /**
   * @swagger
   * /api/quotations:
   *   post:
   *     summary: Crear una cotización
   *     description: Crea una nueva cotización con productos específicos. El usuario puede solicitar una cotización sin realizar la compra inmediatamente.
   *     tags: [Quotations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - items
   *               - validUntil
   *             properties:
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - productId
   *                     - quantity
   *                   properties:
   *                     productId:
   *                       type: string
   *                       format: uuid
   *                     quantity:
   *                       type: integer
   *                       minimum: 1
   *                 example:
   *                   - productId: "550e8400-e29b-41d4-a716-446655440000"
   *                     quantity: 5
   *                   - productId: "650e8400-e29b-41d4-a716-446655440001"
   *                     quantity: 10
   *               validUntil:
   *                 type: string
   *                 format: date-time
   *                 description: Fecha de validez de la cotización (debe ser futura)
   *                 example: "2025-12-31T23:59:59Z"
   *               notes:
   *                 type: string
   *                 description: Notas internas (visibles para admin)
   *                 example: "Cliente preferencial, aplicar descuento"
   *               customerNotes:
   *                 type: string
   *                 description: Notas del cliente
   *                 example: "Necesito entrega urgente"
   *     responses:
   *       201:
   *         description: Cotización creada exitosamente
   *       400:
   *         description: Datos inválidos o productos no disponibles
   *       401:
   *         description: No autenticado
   *       404:
   *         description: Producto no encontrado
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { items, validUntil, notes, customerNotes } = req.body;

    const quotation = await quotationService.create({
      userId,
      items,
      validUntil: new Date(validUntil),
      notes,
      customerNotes,
    });

    res.status(201).json({
      status: 'success',
      message: 'Quotation created successfully',
      data: { quotation },
    });
  });

  /**
   * @swagger
   * /api/quotations:
   *   get:
   *     summary: Listar cotizaciones
   *     description: Obtiene lista de cotizaciones. Los usuarios normales solo ven sus propias cotizaciones, los ADMIN ven todas.
   *     tags: [Quotations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, APPROVED, REJECTED, EXPIRED]
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
   *         description: Lista de cotizaciones obtenida exitosamente
   *       401:
   *         description: No autenticado
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const filters = {
      // Si no es ADMIN, solo ver sus propias cotizaciones
      userId: userRole !== 'ADMIN' ? userId : undefined,
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const result = await quotationService.findAll(filters);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  });

  /**
   * @swagger
   * /api/quotations/{id}:
   *   get:
   *     summary: Obtener cotización por ID
   *     description: Obtiene los detalles completos de una cotización. Los usuarios solo pueden ver sus propias cotizaciones.
   *     tags: [Quotations]
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
   *         description: Cotización obtenida exitosamente
   *       401:
   *         description: No autenticado
   *       403:
   *         description: No tienes permiso para ver esta cotización
   *       404:
   *         description: Cotización no encontrada
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const quotation = await quotationService.findById(id);

    // Verificar permisos
    if (userRole !== 'ADMIN' && quotation.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to view this quotation',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { quotation },
    });
  });

  /**
   * @swagger
   * /api/quotations/number/{quotationNumber}:
   *   get:
   *     summary: Obtener cotización por número
   *     description: Obtiene una cotización usando su número único
   *     tags: [Quotations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: quotationNumber
   *         required: true
   *         schema:
   *           type: string
   *         example: QUOT-1234567890-5678
   *     responses:
   *       200:
   *         description: Cotización obtenida exitosamente
   *       401:
   *         description: No autenticado
   *       403:
   *         description: No tienes permiso
   *       404:
   *         description: Cotización no encontrada
   */
  getByQuotationNumber = asyncHandler(async (req: Request, res: Response) => {
    const { quotationNumber } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const quotation = await quotationService.findByQuotationNumber(quotationNumber);

    // Verificar permisos
    if (userRole !== 'ADMIN' && quotation.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to view this quotation',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { quotation },
    });
  });

  /**
   * @swagger
   * /api/quotations/{id}/status:
   *   patch:
   *     summary: Actualizar estado de la cotización
   *     description: Actualiza el estado de una cotización. Solo usuarios ADMIN.
   *     tags: [Quotations]
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
   *                 enum: [PENDING, APPROVED, REJECTED, EXPIRED]
   *                 example: APPROVED
   *               notes:
   *                 type: string
   *                 example: "Cotización aprobada con descuento del 10%"
   *     responses:
   *       200:
   *         description: Estado actualizado exitosamente
   *       401:
   *         description: No autenticado
   *       403:
   *         description: No autorizado
   *       404:
   *         description: Cotización no encontrada
   */
  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const quotation = await quotationService.updateStatus(id, {
      status,
      notes,
    });

    res.status(200).json({
      status: 'success',
      message: 'Quotation status updated successfully',
      data: { quotation },
    });
  });

  /**
   * @swagger
   * /api/quotations/{id}/convert-to-order:
   *   post:
   *     summary: Convertir cotización aprobada en orden
   *     description: Convierte una cotización aprobada en una orden de compra. Solo el dueño de la cotización puede hacer esto.
   *     tags: [Quotations]
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
   *               - shippingAddress
   *               - billingAddress
   *             properties:
   *               shippingAddress:
   *                 type: object
   *               billingAddress:
   *                 type: object
   *     responses:
   *       200:
   *         description: Cotización convertida a orden exitosamente
   *       400:
   *         description: Cotización no aprobada, expirada o sin stock
   *       401:
   *         description: No autenticado
   *       403:
   *         description: No autorizado
   *       404:
   *         description: Cotización no encontrada
   */
  convertToOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const { shippingAddress, billingAddress } = req.body;

    const result = await quotationService.convertToOrder(
      id,
      userId,
      shippingAddress,
      billingAddress
    );

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: {
        orderNumber: result.orderNumber,
        orderId: result.orderId,
      },
    });
  });

  /**
   * @swagger
   * /api/quotations/{id}:
   *   delete:
   *     summary: Eliminar cotización
   *     description: Elimina una cotización. Solo se pueden eliminar cotizaciones pendientes. El usuario puede eliminar sus propias cotizaciones.
   *     tags: [Quotations]
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
   *         description: Cotización eliminada exitosamente
   *       400:
   *         description: Solo se pueden eliminar cotizaciones pendientes
   *       401:
   *         description: No autenticado
   *       403:
   *         description: No autorizado
   *       404:
   *         description: Cotización no encontrada
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const result = await quotationService.delete(id, userId, userRole === 'ADMIN');

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  });
}