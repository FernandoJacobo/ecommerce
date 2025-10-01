import { pool } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface UserRow extends RowDataPacket {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
}

interface RefreshTokenRow extends RowDataPacket {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    email: string;
    role: string;
}

export class AuthService {
    async register(data: RegisterData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar si el usuario ya existe
            const [existingUsers] = await connection.execute<UserRow[]>(
                'SELECT id FROM users WHERE email = ?',
                [data.email]
            );

            if (existingUsers.length > 0) {
                throw new AppError('User with this email already exists', 409);
            }

            // Hashear contraseña
            const hashedPassword = await hashPassword(data.password);

            // Crear usuario
            const [result] = await connection.execute<ResultSetHeader>(
                `INSERT INTO users (id, email, password, firstName, lastName, role) 
         VALUES (UUID(), ?, ?, ?, ?, 'USER')`,
                [data.email, hashedPassword, data.firstName, data.lastName]
            );

            // Obtener el usuario creado
            const [users] = await connection.execute<UserRow[]>(
                `SELECT id, email, firstName, lastName, role, createdAt 
         FROM users WHERE email = ?`,
                [data.email]
            );

            const user = users[0];

            // Generar tokens
            const accessToken = generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const refreshToken = generateRefreshToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            // Guardar refresh token en BD
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await connection.execute(
                `INSERT INTO refresh_tokens (id, token, userId, expiresAt) 
         VALUES (UUID(), ?, ?, ?)`,
                [refreshToken, user.id, expiresAt]
            );

            await connection.commit();

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    createdAt: user.createdAt,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async login(data: LoginData) {
        const connection = await pool.getConnection();

        try {
            // Buscar usuario
            const [users] = await connection.execute<UserRow[]>(
                'SELECT id, email, password, firstName, lastName, role FROM users WHERE email = ?',
                [data.email]
            );

            if (users.length === 0) {
                throw new AppError('Invalid credentials', 401);
            }

            const user = users[0];

            // Verificar contraseña
            const isPasswordValid = await comparePassword(data.password, user.password);

            if (!isPasswordValid) {
                throw new AppError('Invalid credentials', 401);
            }

            // Generar tokens
            const accessToken = generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const refreshToken = generateRefreshToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            // Guardar refresh token en BD
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await connection.execute(
                `INSERT INTO refresh_tokens (id, token, userId, expiresAt) 
         VALUES (UUID(), ?, ?, ?)`,
                [refreshToken, user.id, expiresAt]
            );

            connection.release();

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async logout(refreshToken: string) {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM refresh_tokens WHERE token = ?',
            [refreshToken]
        );

        return { message: 'Logged out successfully' };
    }

    async refreshAccessToken(refreshToken: string) {
        const connection = await pool.getConnection();

        try {
            // Verificar que el token existe en BD
            const [tokens] = await connection.execute<RefreshTokenRow[]>(
                `SELECT rt.id, rt.token, rt.userId, rt.expiresAt, u.email, u.role
         FROM refresh_tokens rt
         INNER JOIN users u ON rt.userId = u.id
         WHERE rt.token = ?`,
                [refreshToken]
            );

            if (tokens.length === 0) {
                throw new AppError('Invalid refresh token', 401);
            }

            const storedToken = tokens[0];

            // Verificar si el token ha expirado
            if (new Date() > new Date(storedToken.expiresAt)) {
                await connection.execute(
                    'DELETE FROM refresh_tokens WHERE token = ?',
                    [refreshToken]
                );
                throw new AppError('Refresh token expired', 401);
            }

            // Generar nuevo access token
            const accessToken = generateAccessToken({
                userId: storedToken.userId,
                email: storedToken.email,
                role: storedToken.role,
            });

            connection.release();

            return { accessToken };
        } catch (error) {
            connection.release();
            throw error;
        }
    }
}