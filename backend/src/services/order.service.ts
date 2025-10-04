import { pool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateOrderData {
    userId: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    billingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod?: string;
    notes?: string;
}

interface UpdateOrderStatusData {
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentStatus?: string;
}

interface OrderRow extends RowDataPacket {
    id: string;
    orderNumber: string;
    userId: string;
    status: string;
    total: number;
    paymentMethod: string | null;
    paymentStatus: string | null;
    shippingAddress: string;
    billingAddress: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    userEmail?: string;
    userFirstName?: string;
    userLastName?: string;
}

interface OrderItemRow extends RowDataPacket {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    productName: string;
    productSku: string;
    productImages: string;
}

interface CartItemRow extends RowDataPacket {
    productId: string;
    quantity: number;
    price: number;
    stock: number;
    isActive: boolean;
    name: string;
}

export class OrderService {
    // Generar número de orden único
    private generateOrderNumber(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `ORD-${timestamp}-${random}`;
    }

    // Crear orden desde el carrito
    async createFromCart(data: CreateOrderData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Obtener carrito del usuario
            const [carts] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM carts WHERE userId = ?',
                [data.userId]
            );

            if (carts.length === 0) {
                throw new AppError('Cart not found', 404);
            }

            const cartId = carts[0].id;

            // Obtener items del carrito con precios actuales
            const [cartItems] = await connection.execute<CartItemRow[]>(
                `SELECT 
          ci.productId,
          ci.quantity,
          p.price,
          p.stock,
          p.isActive,
          p.name
        FROM cart_items ci
        INNER JOIN products p ON ci.productId = p.id
        WHERE ci.cartId = ?`,
                [cartId]
            );

            if (cartItems.length === 0) {
                throw new AppError('Cart is empty', 400);
            }

            // Validar stock y productos activos
            let total = 0;
            for (const item of cartItems) {
                if (!item.isActive) {
                    throw new AppError(`Product "${item.name}" is not available`, 400);
                }

                if (item.stock < item.quantity) {
                    throw new AppError(
                        `Insufficient stock for product "${item.name}". Available: ${item.stock}`,
                        400
                    );
                }

                total += item.price * item.quantity;
            }

            // Generar número de orden
            const orderNumber = this.generateOrderNumber();

            // Crear orden
            const shippingAddressJson = JSON.stringify(data.shippingAddress);
            const billingAddressJson = JSON.stringify(data.billingAddress);

            await connection.execute(
                `INSERT INTO orders (
          id, orderNumber, userId, status, total, 
          paymentMethod, shippingAddress, billingAddress, notes
        ) VALUES (UUID(), ?, ?, 'PENDING', ?, ?, ?, ?, ?)`,
                [
                    orderNumber,
                    data.userId,
                    total,
                    data.paymentMethod || null,
                    shippingAddressJson,
                    billingAddressJson,
                    data.notes || null,
                ]
            );

            // Obtener ID de la orden creada
            const [orders] = await connection.execute<OrderRow[]>(
                'SELECT id FROM orders WHERE orderNumber = ?',
                [orderNumber]
            );

            const orderId = orders[0].id;

            // Crear items de la orden y actualizar stock
            for (const item of cartItems) {
                // Insertar item de orden
                await connection.execute(
                    `INSERT INTO order_items (id, orderId, productId, quantity, price)
           VALUES (UUID(), ?, ?, ?, ?)`,
                    [orderId, item.productId, item.quantity, item.price]
                );

                // Decrementar stock
                await connection.execute(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.productId]
                );
            }

            // Limpiar carrito
            await connection.execute('DELETE FROM cart_items WHERE cartId = ?', [
                cartId,
            ]);

            await connection.commit();

            // Obtener orden completa
            const order = await this.findById(orderId);

            connection.release();
            return order;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    // Obtener todas las órdenes (con filtros opcionales)
    async findAll(filters: {
        userId?: string;
        status?: string;
        page?: number;
        limit?: number;
    } = {}) {
        const connection = await pool.getConnection();

        try {
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const offset = (page - 1) * limit;

            const conditions: string[] = [];
            const values: any[] = [];

            if (filters.userId) {
                conditions.push('o.userId = ?');
                values.push(filters.userId);
            }

            if (filters.status) {
                conditions.push('o.status = ?');
                values.push(filters.status);
            }

            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Obtener total

            const [countResult] = await connection.execute<RowDataPacket[]>(
                `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
                values
            );

            const total = countResult[0].total;

            // Obtener órdenes CON itemCount real
            const [orders] = await connection.execute<OrderRow[]>(`
                SELECT 
                o.*,
                u.email as userEmail,
                u.firstName as userFirstName,
                u.lastName as userLastName,
                COUNT(oi.id) as itemCount
                FROM orders o
                INNER JOIN users u ON o.userId = u.id
                LEFT JOIN order_items oi ON o.id = oi.orderId
                ${whereClause}
                GROUP BY o.id
                ORDER BY o.createdAt DESC
                LIMIT ? OFFSET ?
            `, [...values, limit, offset]);

            connection.release();

            // Formatear órdenes
            const formattedOrders = orders.map((order) => ({
                ...order,
                shippingAddress: JSON.parse(order.shippingAddress),
                billingAddress: JSON.parse(order.billingAddress),
                user: {
                    email: order.userEmail,
                    firstName: order.userFirstName,
                    lastName: order.userLastName,
                },
                itemCount: Number(order.itemCount), // Convertir a número
            }));

            return {
                orders: formattedOrders,
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

    // Obtener orden por ID
    async findById(id: string) {
        const connection = await pool.getConnection();

        try {
            // Obtener orden
            const [orders] = await connection.execute<OrderRow[]>(`
                SELECT 
                o.*,
                u.email as userEmail,
                u.firstName as userFirstName,
                u.lastName as userLastName
                FROM orders o
                INNER JOIN users u ON o.userId = u.id
                WHERE o.id = ?
            `, [id]);

            if (orders.length === 0) {
                throw new AppError('Order not found', 404);
            }

            const order = orders[0];

            // Obtener items de la orden
            const [items] = await connection.execute<OrderItemRow[]>(`
                SELECT 
                oi.*,
                p.name as productName,
                p.sku as productSku,
                p.images as productImages
                FROM order_items oi
                INNER JOIN products p ON oi.productId = p.id
                WHERE oi.orderId = ?
            `, [id]);

            connection.release();

            // Formatear items
            const formattedItems = items.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity,
                product: {
                    name: item.productName,
                    sku: item.productSku,
                    images: JSON.parse(item.productImages),
                },
            }));

            return {
                ...order,
                shippingAddress: JSON.parse(order.shippingAddress),
                billingAddress: JSON.parse(order.billingAddress),
                user: {
                    email: order.userEmail,
                    firstName: order.userFirstName,
                    lastName: order.userLastName,
                },
                items: formattedItems,
                itemCount: formattedItems.length,
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Obtener orden por número
    async findByOrderNumber(orderNumber: string) {
        const connection = await pool.getConnection();

        try {
            const [orders] = await connection.execute<OrderRow[]>(
                'SELECT id FROM orders WHERE orderNumber = ?',
                [orderNumber]
            );

            if (orders.length === 0) {
                throw new AppError('Order not found', 404);
            }

            connection.release();

            return await this.findById(orders[0].id);
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Actualizar estado de la orden (solo ADMIN)
    async updateStatus(id: string, data: UpdateOrderStatusData) {
        const connection = await pool.getConnection();

        try {
            // Verificar que la orden existe
            const [orders] = await connection.execute<OrderRow[]>(
                'SELECT id FROM orders WHERE id = ?',
                [id]
            );

            if (orders.length === 0) {
                throw new AppError('Order not found', 404);
            }

            // Actualizar estado
            const updates: string[] = ['status = ?'];
            const values: any[] = [data.status];

            if (data.paymentStatus) {
                updates.push('paymentStatus = ?');
                values.push(data.paymentStatus);
            }

            values.push(id);

            await connection.execute(
                `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            // Obtener orden actualizada
            const order = await this.findById(id);

            connection.release();

            return order;
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Cancelar orden
    async cancel(id: string, userId: string, isAdmin: boolean = false) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Obtener orden
            const [orders] = await connection.execute<OrderRow[]>(
                'SELECT id, userId, status FROM orders WHERE id = ?',
                [id]
            );

            if (orders.length === 0) {
                throw new AppError('Order not found', 404);
            }

            const order = orders[0];

            // Verificar permisos
            if (!isAdmin && order.userId !== userId) {
                throw new AppError('You do not have permission to cancel this order', 403);
            }

            // Verificar que se puede cancelar
            if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
                throw new AppError(`Cannot cancel order with status ${order.status}`, 400);
            }

            // Obtener items de la orden
            const [items] = await connection.execute<OrderItemRow[]>(
                'SELECT productId, quantity FROM order_items WHERE orderId = ?',
                [id]
            );

            // Devolver stock
            for (const item of items) {
                await connection.execute(
                    'UPDATE products SET stock = stock + ? WHERE id = ?',
                    [item.quantity, item.productId]
                );
            }

            // Actualizar estado
            await connection.execute(
                "UPDATE orders SET status = 'CANCELLED', updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
                [id]
            );

            await connection.commit();

            // Obtener orden actualizada
            const updatedOrder = await this.findById(id);

            connection.release();
            return updatedOrder;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
}