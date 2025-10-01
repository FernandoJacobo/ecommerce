import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';

const productService = new ProductService();

export class ProductController {
    /**
     * @swagger
     * /api/products:
     *   post:
     *     summary: Crear un nuevo producto
     *     description: Crea un nuevo producto. Solo usuarios ADMIN pueden crear productos.
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - description
     *               - price
     *               - stock
     *               - sku
     *               - images
     *               - categoryId
     *             properties:
     *               name:
     *                 type: string
     *                 example: iPhone 15 Pro
     *               description:
     *                 type: string
     *                 example: Último modelo de iPhone con chip A17 Pro y cámara de 48MP
     *               price:
     *                 type: number
     *                 example: 999.99
     *               stock:
     *                 type: integer
     *                 example: 50
     *               sku:
     *                 type: string
     *                 example: IPH15PRO-256-BLK
     *               images:
     *                 type: array
     *                 items:
     *                   type: string
     *                 example: ["https://example.com/iphone1.jpg", "https://example.com/iphone2.jpg"]
     *               categoryId:
     *                 type: string
     *                 format: uuid
     *     responses:
     *       201:
     *         description: Producto creado exitosamente
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado (requiere rol ADMIN)
     *       404:
     *         description: Categoría no encontrada
     *       409:
     *         description: El SKU ya existe
     */
    create = asyncHandler(async (req: Request, res: Response) => {
        const { name, description, price, stock, sku, images, categoryId } = req.body;

        const product = await productService.create({
            name,
            description,
            price,
            stock,
            sku,
            images,
            categoryId,
        });

        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: { product },
        });
    });

    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Listar productos con filtros y paginación
     *     description: Obtiene lista de productos con opciones de filtrado, búsqueda y paginación
     *     tags: [Products]
     *     parameters:
     *       - in: query
     *         name: categoryId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filtrar por categoría
     *       - in: query
     *         name: minPrice
     *         schema:
     *           type: number
     *         description: Precio mínimo
     *       - in: query
     *         name: maxPrice
     *         schema:
     *           type: number
     *         description: Precio máximo
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Buscar en nombre, descripción o SKU
     *       - in: query
     *         name: isActive
     *         schema:
     *           type: boolean
     *         description: Filtrar por productos activos/inactivos
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Número de página
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 20
     *         description: Productos por página
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [name, price, createdAt, stock]
     *           default: createdAt
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [ASC, DESC]
     *           default: DESC
     *     responses:
     *       200:
     *         description: Lista de productos obtenida exitosamente
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const filters = {
            categoryId: req.query.categoryId as string,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
            search: req.query.search as string,
            isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
            page: req.query.page ? parseInt(req.query.page as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            sortBy: req.query.sortBy as 'name' | 'price' | 'createdAt' | 'stock',
            sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
        };

        const result = await productService.findAll(filters);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    });

    /**
     * @swagger
     * /api/products/{id}:
     *   get:
     *     summary: Obtener producto por ID
     *     description: Obtiene un producto específico con su información de categoría
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Producto obtenido exitosamente
     *       404:
     *         description: Producto no encontrado
     */
    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const product = await productService.findById(id);

        res.status(200).json({
            status: 'success',
            data: { product },
        });
    });

    /**
     * @swagger
     * /api/products/sku/{sku}:
     *   get:
     *     summary: Obtener producto por SKU
     *     description: Obtiene un producto específico usando su SKU
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: sku
     *         required: true
     *         schema:
     *           type: string
     *         example: IPH15PRO-256-BLK
     *     responses:
     *       200:
     *         description: Producto obtenido exitosamente
     *       404:
     *         description: Producto no encontrado
     */
    getBySku = asyncHandler(async (req: Request, res: Response) => {
        const { sku } = req.params;

        const product = await productService.findBySku(sku);

        res.status(200).json({
            status: 'success',
            data: { product },
        });
    });

    /**
     * @swagger
     * /api/products/{id}:
     *   put:
     *     summary: Actualizar producto
     *     description: Actualiza un producto existente. Solo usuarios ADMIN.
     *     tags: [Products]
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
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               price:
     *                 type: number
     *               stock:
     *                 type: integer
     *               sku:
     *                 type: string
     *               images:
     *                 type: array
     *                 items:
     *                   type: string
     *               categoryId:
     *                 type: string
     *               isActive:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Producto actualizado exitosamente
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Producto o categoría no encontrado
     */
    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updateData = req.body;

        const product = await productService.update(id, updateData);

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: { product },
        });
    });

    /**
     * @swagger
     * /api/products/{id}:
     *   delete:
     *     summary: Eliminar producto
     *     description: Elimina un producto. Solo usuarios ADMIN.
     *     tags: [Products]
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
     *         description: Producto eliminado exitosamente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Producto no encontrado
     */
    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await productService.delete(id);

        res.status(200).json({
            status: 'success',
            message: result.message,
        });
    });

    /**
     * @swagger
     * /api/products/{id}/stock:
     *   patch:
     *     summary: Actualizar stock del producto
     *     description: Incrementa o decrementa el stock. Solo usuarios ADMIN.
     *     tags: [Products]
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
     *               - quantity
     *             properties:
     *               quantity:
     *                 type: integer
     *                 description: Cantidad a sumar (positivo) o restar (negativo)
     *                 example: 10
     *     responses:
     *       200:
     *         description: Stock actualizado exitosamente
     *       400:
     *         description: Stock insuficiente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Producto no encontrado
     */
    updateStock = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { quantity } = req.body;

        const result = await productService.updateStock(id, quantity);

        res.status(200).json({
            status: 'success',
            message: result.message,
            data: { newStock: result.newStock },
        });
    });

    /**
     * @swagger
     * /api/products/{id}/toggle-active:
     *   patch:
     *     summary: Activar/Desactivar producto
     *     description: Cambia el estado activo/inactivo del producto. Solo usuarios ADMIN.
     *     tags: [Products]
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
     *         description: Estado actualizado exitosamente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Producto no encontrado
     */
    toggleActive = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await productService.toggleActive(id);

        res.status(200).json({
            status: 'success',
            message: result.message,
            data: { isActive: result.isActive },
        });
    });
}