import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';

const userService = new UserService();

export class UserController {
    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Listar todos los usuarios
     *     description: Obtiene lista de usuarios con estadísticas. Solo para ADMIN.
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: role
     *         schema:
     *           type: string
     *           enum: [USER, ADMIN]
     *         description: Filtrar por rol
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Buscar por email, nombre o apellido
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
     *         description: Lista de usuarios obtenida exitosamente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado (requiere ADMIN)
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const filters = {
            role: req.query.role as string,
            search: req.query.search as string,
            page: req.query.page ? parseInt(req.query.page as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        };

        const result = await userService.findAll(filters);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    });

    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *     summary: Obtener usuario por ID
     *     description: Obtiene detalles completos de un usuario con estadísticas, órdenes y cotizaciones recientes. Solo para ADMIN.
     *     tags: [Users]
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
     *         description: Usuario obtenido exitosamente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Usuario no encontrado
     */
    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const user = await userService.findById(id);

        res.status(200).json({
            status: 'success',
            data: { user },
        });
    });

    /**
     * @swagger
     * /api/users/{id}:
     *   put:
     *     summary: Actualizar usuario
     *     description: Actualiza información de un usuario. Solo para ADMIN.
     *     tags: [Users]
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
     *               email:
     *                 type: string
     *                 format: email
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               role:
     *                 type: string
     *                 enum: [USER, ADMIN]
     *               password:
     *                 type: string
     *                 minLength: 8
     *     responses:
     *       200:
     *         description: Usuario actualizado exitosamente
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Usuario no encontrado
     *       409:
     *         description: Email ya en uso
     */
    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updateData = req.body;

        const user = await userService.update(id, updateData);

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: { user },
        });
    });

    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *     summary: Eliminar usuario
     *     description: Elimina un usuario. No se puede eliminar usuarios con órdenes completadas o al último admin. Solo para ADMIN.
     *     tags: [Users]
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
     *         description: Usuario eliminado exitosamente
     *       400:
     *         description: No se puede eliminar (tiene órdenes completadas o es el último admin)
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     *       404:
     *         description: Usuario no encontrado
     */
    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await userService.delete(id);

        res.status(200).json({
            status: 'success',
            message: result.message,
        });
    });

    /**
     * @swagger
     * /api/users/statistics:
     *   get:
     *     summary: Obtener estadísticas de usuarios
     *     description: Obtiene estadísticas generales para el dashboard de administración. Solo para ADMIN.
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estadísticas obtenidas exitosamente
     *       401:
     *         description: No autenticado
     *       403:
     *         description: No autorizado
     */
    getStatistics = asyncHandler(async (req: Request, res: Response) => {
        const statistics = await userService.getStatistics();

        res.status(200).json({
            status: 'success',
            data: { statistics },
        });
    });
}