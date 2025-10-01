import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { asyncHandler } from '../utils/asyncHandler';

const categoryService = new CategoryService();

export class CategoryController {
    /**
     * @swagger
     * /api/categories:
     *   post:
     *     summary: Crear una nueva categoría
     *     description: Crea una nueva categoría de productos. Solo usuarios ADMIN pueden crear categorías.
     *     tags: [Categories]
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
     *               - slug
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nombre de la categoría
     *                 example: Electrónica
     *               description:
     *                 type: string
     *                 description: Descripción de la categoría
     *                 example: Productos electrónicos y gadgets
     *               slug:
     *                 type: string
     *                 description: Slug único para URLs (lowercase, con guiones)
     *                 example: electronica
     *     responses:
     *       201:
     *         description: Categoría creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 message:
     *                   type: string
     *                   example: Category created successfully
     *                 data:
     *                   type: object
     *                   properties:
     *                     category:
     *                       $ref: '#/components/schemas/Category'
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado (requiere rol ADMIN)
     *       409:
     *         description: El slug ya existe
     */
    create = asyncHandler(async (req: Request, res: Response) => {
        const { name, description, slug } = req.body;

        const category = await categoryService.create({
            name,
            description,
            slug,
        });

        res.status(201).json({
            status: 'success',
            message: 'Category created successfully',
            data: { category },
        });
    });

    /**
     * @swagger
     * /api/categories:
     *   get:
     *     summary: Listar todas las categorías
     *     description: Obtiene todas las categorías con el contador de productos asociados
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: Lista de categorías obtenida exitosamente
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
     *                     categories:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Category'
     *                     count:
     *                       type: integer
     *                       example: 5
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const categories = await categoryService.findAll();

        res.status(200).json({
            status: 'success',
            data: {
                categories,
                count: categories.length,
            },
        });
    });

    /**
     * @swagger
     * /api/categories/{id}:
     *   get:
     *     summary: Obtener categoría por ID
     *     description: Obtiene una categoría específica con sus productos asociados
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID de la categoría
     *     responses:
     *       200:
     *         description: Categoría obtenida exitosamente
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
     *                     category:
     *                       $ref: '#/components/schemas/Category'
     *       404:
     *         description: Categoría no encontrada
     */
    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const category = await categoryService.findById(id);

        res.status(200).json({
            status: 'success',
            data: { category },
        });
    });

    /**
     * @swagger
     * /api/categories/slug/{slug}:
     *   get:
     *     summary: Obtener categoría por slug
     *     description: Obtiene una categoría específica usando su slug
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: slug
     *         required: true
     *         schema:
     *           type: string
     *         description: Slug de la categoría
     *         example: electronica
     *     responses:
     *       200:
     *         description: Categoría obtenida exitosamente
     *       404:
     *         description: Categoría no encontrada
     */
    getBySlug = asyncHandler(async (req: Request, res: Response) => {
        const { slug } = req.params;

        const category = await categoryService.findBySlug(slug);

        res.status(200).json({
            status: 'success',
            data: { category },
        });
    });

    /**
     * @swagger
     * /api/categories/{id}:
     *   put:
     *     summary: Actualizar categoría
     *     description: Actualiza una categoría existente. Solo usuarios ADMIN.
     *     tags: [Categories]
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
     *               slug:
     *                 type: string
     *     responses:
     *       200:
     *         description: Categoría actualizada exitosamente
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Categoría no encontrada
     */
    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, description, slug } = req.body;

        const category = await categoryService.update(id, {
            name,
            description,
            slug,
        });

        res.status(200).json({
            status: 'success',
            message: 'Category updated successfully',
            data: { category },
        });
    });

    /**
     * @swagger
     * /api/categories/{id}:
     *   delete:
     *     summary: Eliminar categoría
     *     description: Elimina una categoría. Solo si no tiene productos asociados. Solo usuarios ADMIN.
     *     tags: [Categories]
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
     *         description: Categoría eliminada exitosamente
     *       400:
     *         description: No se puede eliminar, tiene productos asociados
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Categoría no encontrada
     */
    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await categoryService.delete(id);

        res.status(200).json({
            status: 'success',
            message: result.message,
        });
    });
}