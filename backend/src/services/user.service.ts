import { pool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { hashPassword } from '../utils/password';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface UserRow extends RowDataPacket {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

interface UpdateUserData {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: 'USER' | 'ADMIN';
    password?: string;
}

interface UserStats extends RowDataPacket {
    orderCount: number;
    quotationCount: number;
    totalSpent: number;
}

export class UserService {
    // Obtener todos los usuarios con estadísticas
    async findAll(filters: {
        role?: string;
        search?: string;
        page?: number;
        limit?: number;
    } = {}) {
        const connection = await pool.getConnection();

        try {
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const offset = (page - 1) * limit;

            // Construir WHERE clause
            const conditions: string[] = [];
            const values: any[] = [];

            if (filters.role) {
                conditions.push('u.role = ?');
                values.push(filters.role);
            }

            if (filters.search) {
                conditions.push(
                    '(u.email LIKE ? OR u.firstName LIKE ? OR u.lastName LIKE ?)'
                );
                const searchTerm = `%${filters.search}%`;
                values.push(searchTerm, searchTerm, searchTerm);
            }

            const whereClause =
                conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Obtener total
            const [countResult] = await connection.execute<RowDataPacket[]>(
                `SELECT COUNT(*) as total FROM users u ${whereClause}`,
                values
            );

            const total = countResult[0].total;

            // Obtener usuarios con estadísticas
            const [users] = await connection.execute<UserRow[]>(
                `SELECT 
          u.id,
          u.email,
          u.firstName,
          u.lastName,
          u.role,
          u.createdAt,
          u.updatedAt,
          COUNT(DISTINCT o.id) as orderCount,
          COUNT(DISTINCT q.id) as quotationCount,
          COALESCE(SUM(CASE WHEN o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED') THEN o.total ELSE 0 END), 0) as totalSpent
        FROM users u
        LEFT JOIN orders o ON u.id = o.userId
        LEFT JOIN quotations q ON u.id = q.userId
        ${whereClause}
        GROUP BY u.id
        ORDER BY u.createdAt DESC
        LIMIT ? OFFSET ?`,
                [...values, limit, offset]
            );

            connection.release();

            return {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Obtener usuario por ID con detalles completos
    async findById(id: string) {
        const connection = await pool.getConnection();

        try {
            // Obtener usuario
            const [users] = await connection.execute<UserRow[]>(
                'SELECT id, email, firstName, lastName, role, createdAt, updatedAt FROM users WHERE id = ?',
                [id]
            );

            if (users.length === 0) {
                throw new AppError('User not found', 404);
            }

            const user = users[0];

            // Obtener estadísticas
            const [stats] = await connection.execute<UserStats[]>(
                `SELECT 
          COUNT(DISTINCT o.id) as orderCount,
          COUNT(DISTINCT q.id) as quotationCount,
          COALESCE(SUM(CASE WHEN o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED') THEN o.total ELSE 0 END), 0) as totalSpent
        FROM users u
        LEFT JOIN orders o ON u.id = o.userId
        LEFT JOIN quotations q ON u.id = q.userId
        WHERE u.id = ?`,
                [id]
            );

            // Obtener últimas órdenes
            const [recentOrders] = await connection.execute<RowDataPacket[]>(
                `SELECT 
          id, orderNumber, status, total, createdAt
        FROM orders
        WHERE userId = ?
        ORDER BY createdAt DESC
        LIMIT 5`,
                [id]
            );

            // Obtener últimas cotizaciones
            const [recentQuotations] = await connection.execute<RowDataPacket[]>(
                `SELECT 
          id, quotationNumber, status, total, validUntil, createdAt
        FROM quotations
        WHERE userId = ?
        ORDER BY createdAt DESC
        LIMIT 5`,
                [id]
            );

            connection.release();

            return {
                ...user,
                stats: stats[0],
                recentOrders,
                recentQuotations,
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Actualizar usuario
    async update(id: string, data: UpdateUserData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar que el usuario existe
            const [existing] = await connection.execute<UserRow[]>(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );

            if (existing.length === 0) {
                throw new AppError('User not found', 404);
            }

            const user = existing[0];

            // Si se actualiza el email, verificar que no exista
            if (data.email && data.email !== user.email) {
                const [duplicates] = await connection.execute<UserRow[]>(
                    'SELECT id FROM users WHERE email = ? AND id != ?',
                    [data.email, id]
                );

                if (duplicates.length > 0) {
                    throw new AppError('Email already in use', 409);
                }
            }

            // Construir query dinámicamente
            const updates: string[] = [];
            const values: any[] = [];

            if (data.email !== undefined) {
                updates.push('email = ?');
                values.push(data.email);
            }
            if (data.firstName !== undefined) {
                updates.push('firstName = ?');
                values.push(data.firstName);
            }
            if (data.lastName !== undefined) {
                updates.push('lastName = ?');
                values.push(data.lastName);
            }
            if (data.role !== undefined) {
                updates.push('role = ?');
                values.push(data.role);
            }
            if (data.password !== undefined) {
                const hashedPassword = await hashPassword(data.password);
                updates.push('password = ?');
                values.push(hashedPassword);
            }

            if (updates.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            values.push(id);

            await connection.execute(
                `UPDATE users SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
                values
            );

            await connection.commit();

            // Obtener usuario actualizado
            const updatedUser = await this.findById(id);

            connection.release();
            return updatedUser;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    // Eliminar usuario
    async delete(id: string) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar que el usuario existe
            const [users] = await connection.execute<UserRow[]>(
                'SELECT id, role FROM users WHERE id = ?',
                [id]
            );

            if (users.length === 0) {
                throw new AppError('User not found', 404);
            }

            // No permitir eliminar al último administrador
            const [adminCount] = await connection.execute<RowDataPacket[]>(
                "SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'"
            );

            if (users[0].role === 'ADMIN' && adminCount[0].count <= 1) {
                throw new AppError('Cannot delete the last admin user', 400);
            }

            // Verificar si tiene órdenes completadas
            const [completedOrders] = await connection.execute<RowDataPacket[]>(
                "SELECT COUNT(*) as count FROM orders WHERE userId = ? AND status IN ('DELIVERED', 'PROCESSING', 'SHIPPED')",
                [id]
            );

            if (completedOrders[0].count > 0) {
                throw new AppError(
                    'Cannot delete user with completed orders. Consider deactivating instead.',
                    400
                );
            }

            // Eliminar usuario (las relaciones se eliminan por CASCADE)
            await connection.execute('DELETE FROM users WHERE id = ?', [id]);

            await connection.commit();
            connection.release();

            return { message: 'User deleted successfully' };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    // Obtener estadísticas generales de usuarios (dashboard admin)
    async getStatistics() {
        const connection = await pool.getConnection();

        try {
            // Total de usuarios por rol
            const [usersByRole] = await connection.execute<RowDataPacket[]>(
                `SELECT 
          role,
          COUNT(*) as count
        FROM users
        GROUP BY role`
            );

            // Usuarios registrados en los últimos 30 días
            const [newUsers] = await connection.execute<RowDataPacket[]>(
                `SELECT COUNT(*) as count
        FROM users
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
            );

            // Top 5 clientes por gasto total
            const [topCustomers] = await connection.execute<RowDataPacket[]>(
                `SELECT 
          u.id,
          u.email,
          u.firstName,
          u.lastName,
          COUNT(o.id) as orderCount,
          SUM(o.total) as totalSpent
        FROM users u
        INNER JOIN orders o ON u.id = o.userId
        WHERE o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED')
        GROUP BY u.id
        ORDER BY totalSpent DESC
        LIMIT 5`
            );

            // Usuarios sin órdenes
            const [usersWithoutOrders] = await connection.execute<RowDataPacket[]>(
                `SELECT COUNT(*) as count
        FROM users u
        LEFT JOIN orders o ON u.id = o.userId
        WHERE o.id IS NULL`
            );

            connection.release();

            return {
                usersByRole,
                newUsersLast30Days: newUsers[0].count,
                topCustomers,
                usersWithoutOrders: usersWithoutOrders[0].count,
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }
}