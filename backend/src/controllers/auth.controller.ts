import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

const authService = new AuthService();

export class AuthController {
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Registrar un nuevo usuario
     *     description: Crea una nueva cuenta de usuario en el sistema. La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números.
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - firstName
     *               - lastName
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Email único del usuario
     *                 example: fernando@ejemplo.com
     *               password:
     *                 type: string
     *                 minLength: 8
     *                 description: Contraseña segura (mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números)
     *                 example: MiPassword123
     *               firstName:
     *                 type: string
     *                 minLength: 2
     *                 description: Nombre del usuario
     *                 example: Fernando
     *               lastName:
     *                 type: string
     *                 minLength: 2
     *                 description: Apellido del usuario
     *                 example: García
     *     responses:
     *       201:
     *         description: Usuario registrado exitosamente
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
     *                   example: User registered successfully
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                           example: 550e8400-e29b-41d4-a716-446655440000
     *                         email:
     *                           type: string
     *                           example: fernando@ejemplo.com
     *                         firstName:
     *                           type: string
     *                           example: Fernando
     *                         lastName:
     *                           type: string
     *                           example: García
     *                         role:
     *                           type: string
     *                           enum: [USER, ADMIN]
     *                           example: USER
     *                         createdAt:
     *                           type: string
     *                           format: date-time
     *                     accessToken:
     *                       type: string
     *                       description: Token JWT de acceso (válido por 15 minutos)
     *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *         headers:
     *           Set-Cookie:
     *             description: Cookie httpOnly con el refresh token (válido por 7 días)
     *             schema:
     *               type: string
     *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
     *       400:
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: fail
     *                 message:
     *                   type: string
     *                   example: Password must be at least 8 characters long, Password must contain at least one uppercase letter, one lowercase letter, and one number
     *       409:
     *         description: El usuario ya existe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: error
     *                 message:
     *                   type: string
     *                   example: User with this email already exists
     */
    register = asyncHandler(async (req: Request, res: Response) => {
        const { email, password, firstName, lastName } = req.body;

        const result = await authService.register({
            email,
            password,
            firstName,
            lastName,
        });

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    });

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Iniciar sesión
     *     description: Autentica un usuario existente y devuelve tokens de acceso. El access token se envía en la respuesta JSON y el refresh token en una cookie httpOnly.
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Email del usuario registrado
     *                 example: fernando@ejemplo.com
     *               password:
     *                 type: string
     *                 description: Contraseña del usuario
     *                 example: MiPassword123
     *     responses:
     *       200:
     *         description: Login exitoso
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
     *                   example: Login successful
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                         email:
     *                           type: string
     *                         firstName:
     *                           type: string
     *                         lastName:
     *                           type: string
     *                         role:
     *                           type: string
     *                           enum: [USER, ADMIN]
     *                     accessToken:
     *                       type: string
     *                       description: Token JWT de acceso (válido por 15 minutos)
     *         headers:
     *           Set-Cookie:
     *             description: Cookie httpOnly con el refresh token (válido por 7 días)
     *             schema:
     *               type: string
     *       400:
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: fail
     *                 message:
     *                   type: string
     *                   example: Please provide a valid email
     *       401:
     *         description: Credenciales inválidas
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: error
     *                 message:
     *                   type: string
     *                   example: Invalid credentials
     */
    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const result = await authService.login({ email, password });

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    });

    /**
     * @swagger
     * /api/auth/logout:
     *   post:
     *     summary: Cerrar sesión
     *     description: Cierra la sesión del usuario eliminando el refresh token de la base de datos y limpiando la cookie. No requiere autenticación por Bearer token.
     *     tags: [Auth]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Logout exitoso
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
     *                   example: Logout successful
     *         headers:
     *           Set-Cookie:
     *             description: Cookie eliminada
     *             schema:
     *               type: string
     *               example: refreshToken=; Max-Age=0
     */
    logout = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        res.clearCookie('refreshToken');

        res.status(200).json({
            status: 'success',
            message: 'Logout successful',
        });
    });

    /**
     * @swagger
     * /api/auth/refresh:
     *   post:
     *     summary: Renovar access token
     *     description: Genera un nuevo access token usando el refresh token almacenado en la cookie. Útil cuando el access token ha expirado (después de 15 minutos).
     *     tags: [Auth]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Token renovado exitosamente
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
     *                   example: Token refreshed successfully
     *                 data:
     *                   type: object
     *                   properties:
     *                     accessToken:
     *                       type: string
     *                       description: Nuevo token JWT de acceso (válido por 15 minutos)
     *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *       401:
     *         description: Refresh token inválido o expirado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: error
     *                 message:
     *                   type: string
     *                   example: Invalid refresh token
     */
    refresh = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                status: 'error',
                message: 'Refresh token not found',
            });
        }

        const result = await authService.refreshAccessToken(refreshToken);

        res.status(200).json({
            status: 'success',
            message: 'Token refreshed successfully',
            data: {
                accessToken: result.accessToken,
            },
        });
    });

    /**
     * @swagger
     * /api/auth/me:
     *   get:
     *     summary: Obtener información del usuario actual
     *     description: Devuelve la información del usuario autenticado usando el token JWT. Útil para verificar la sesión y obtener datos del perfil.
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Información del usuario obtenida exitosamente
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
     *                     user:
     *                       type: object
     *                       properties:
     *                         userId:
     *                           type: string
     *                           description: ID único del usuario
     *                           example: 550e8400-e29b-41d4-a716-446655440000
     *                         email:
     *                           type: string
     *                           description: Email del usuario
     *                           example: fernando@ejemplo.com
     *                         role:
     *                           type: string
     *                           enum: [USER, ADMIN]
     *                           description: Rol del usuario en el sistema
     *                           example: USER
     *       401:
     *         description: No autenticado o token inválido
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: error
     *                 message:
     *                   type: string
     *                   example: Invalid or expired token
     */
    getMe = asyncHandler(async (req: Request, res: Response) => {
        res.status(200).json({
            status: 'success',
            data: {
                user: req.user,
            },
        });
    });
}