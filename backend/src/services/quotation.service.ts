import { pool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateQuotationData {
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
    }>;
    validUntil: Date;
    notes?: string;
    customerNotes?: string;
}

interface UpdateQuotationStatusData {
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
    notes?: string;
}

interface QuotationRow extends RowDataPacket {
    id: string;
    quotationNumber: string;
    userId: string;
    status: string;
    total: number;
    validUntil: Date;
    notes: string | null;
    customerNotes: string | null;
    createdAt: Date;
    updatedAt: Date;
    userEmail?: string;
    userFirstName?: string;
    userLastName?: string;
}

interface QuotationItemRow extends RowDataPacket {
    id: string;
    quotationId: string;
    productId: string;
    quantity: number;
    price: number;
    productName: string;
    productSku: string;
    productImages: string;
}

interface ProductRow extends RowDataPacket {
    price: number;
    isActive: boolean;
    name: string;
}

export class QuotationService {
    // Generar número de cotización único
    private generateQuotationNumber(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `QUOT-${timestamp}-${random}`;
    }

    // Crear cotización
    async create(data: CreateQuotationData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            if (data.items.length === 0) {
                throw new AppError('At least one item is required', 400);
            }

            // Validar productos y calcular total
            let total = 0;
            const validatedItems: Array<{
                productId: string;
                quantity: number;
                price: number;
                name: string;
            }> = [];

            for (const item of data.items) {
                const [products] = await connection.execute<ProductRow[]>(
                    'SELECT price, isActive, name FROM products WHERE id = ?',
                    [item.productId]
                );

                if (products.length === 0) {
                    throw new AppError(`Product with ID ${item.productId} not found`, 404);
                }

                const product = products[0];

                if (!product.isActive) {
                    throw new AppError(`Product "${product.name}" is not available`, 400);
                }

                const itemTotal = product.price * item.quantity;
                total += itemTotal;

                validatedItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                    name: product.name,
                });
            }

            // Generar número de cotización
            const quotationNumber = this.generateQuotationNumber();

            // Crear cotización
            await connection.execute(
                `INSERT INTO quotations (
          id, quotationNumber, userId, status, total, 
          validUntil, notes, customerNotes
        ) VALUES (UUID(), ?, ?, 'PENDING', ?, ?, ?, ?)`,
                [
                    quotationNumber,
                    data.userId,
                    total,
                    data.validUntil,
                    data.notes || null,
                    data.customerNotes || null,
                ]
            );

            // Obtener ID de la cotización creada
            const [quotations] = await connection.execute<QuotationRow[]>(
                'SELECT id FROM quotations WHERE quotationNumber = ?',
                [quotationNumber]
            );

            const quotationId = quotations[0].id;

            // Crear items de la cotización
            for (const item of validatedItems) {
                await connection.execute(
                    `INSERT INTO quotation_items (id, quotationId, productId, quantity, price)
           VALUES (UUID(), ?, ?, ?, ?)`,
                    [quotationId, item.productId, item.quantity, item.price]
                );
            }

            await connection.commit();

            // Obtener cotización completa
            const quotation = await this.findById(quotationId);

            connection.release();
            return quotation;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    // Obtener todas las cotizaciones (con filtros opcionales)
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

            // Construir WHERE clause
            const conditions: string[] = [];
            const values: any[] = [];

            if (filters.userId) {
                conditions.push('q.userId = ?');
                values.push(filters.userId);
            }

            if (filters.status) {
                conditions.push('q.status = ?');
                values.push(filters.status);
            }

            const whereClause =
                conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Obtener total
            const [countResult] = await connection.execute<RowDataPacket[]>(
                `SELECT COUNT(*) as total FROM quotations q ${whereClause}`,
                values
            );

            const total = countResult[0].total;

            // Obtener cotizaciones
            const [quotations] = await connection.execute<QuotationRow[]>(
                `SELECT 
          q.*,
          u.email as userEmail,
          u.firstName as userFirstName,
          u.lastName as userLastName
        FROM quotations q
        INNER JOIN users u ON q.userId = u.id
        ${whereClause}
        ORDER BY q.createdAt DESC
        LIMIT ? OFFSET ?`,
                [...values, limit, offset]
            );

            connection.release();

            // Formatear cotizaciones
            const formattedQuotations = quotations.map((quotation) => ({
                ...quotation,
                user: {
                    email: quotation.userEmail,
                    firstName: quotation.userFirstName,
                    lastName: quotation.userLastName,
                },
            }));

            return {
                quotations: formattedQuotations,
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

    // Obtener cotización por ID
    async findById(id: string) {
        const connection = await pool.getConnection();

        try {
            // Obtener cotización
            const [quotations] = await connection.execute<QuotationRow[]>(
                `SELECT 
          q.*,
          u.email as userEmail,
          u.firstName as userFirstName,
          u.lastName as userLastName
        FROM quotations q
        INNER JOIN users u ON q.userId = u.id
        WHERE q.id = ?`,
                [id]
            );

            if (quotations.length === 0) {
                throw new AppError('Quotation not found', 404);
            }

            const quotation = quotations[0];

            // Obtener items de la cotización
            const [items] = await connection.execute<QuotationItemRow[]>(
                `SELECT 
          qi.*,
          p.name as productName,
          p.sku as productSku,
          p.images as productImages
        FROM quotation_items qi
        INNER JOIN products p ON qi.productId = p.id
        WHERE qi.quotationId = ?`,
                [id]
            );

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
                ...quotation,
                user: {
                    email: quotation.userEmail,
                    firstName: quotation.userFirstName,
                    lastName: quotation.userLastName,
                },
                items: formattedItems,
                itemCount: formattedItems.length,
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Obtener cotización por número
    async findByQuotationNumber(quotationNumber: string) {
        const connection = await pool.getConnection();

        try {
            const [quotations] = await connection.execute<QuotationRow[]>(
                'SELECT id FROM quotations WHERE quotationNumber = ?',
                [quotationNumber]
            );

            if (quotations.length === 0) {
                throw new AppError('Quotation not found', 404);
            }

            connection.release();

            return await this.findById(quotations[0].id);
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Actualizar estado de la cotización (solo ADMIN)
    async updateStatus(id: string, data: UpdateQuotationStatusData) {
        const connection = await pool.getConnection();

        try {
            // Verificar que la cotización existe
            const [quotations] = await connection.execute<QuotationRow[]>(
                'SELECT id, status FROM quotations WHERE id = ?',
                [id]
            );

            if (quotations.length === 0) {
                throw new AppError('Quotation not found', 404);
            }

            // Actualizar estado
            const updates: string[] = ['status = ?'];
            const values: any[] = [data.status];

            if (data.notes !== undefined) {
                updates.push('notes = ?');
                values.push(data.notes);
            }

            values.push(id);

            await connection.execute(
                `UPDATE quotations SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
                values
            );

            // Obtener cotización actualizada
            const quotation = await this.findById(id);

            connection.release();
            return quotation;
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Convertir cotización aprobada en orden
    async convertToOrder(quotationId: string, userId: string, shippingAddress: any, billingAddress: any) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Obtener cotización
            const [quotations] = await connection.execute<QuotationRow[]>(
                'SELECT id, userId, status, total, validUntil FROM quotations WHERE id = ?',
                [quotationId]
            );

            if (quotations.length === 0) {
                throw new AppError('Quotation not found', 404);
            }

            const quotation = quotations[0];

            // Verificar permisos
            if (quotation.userId !== userId) {
                throw new AppError('You do not have permission to convert this quotation', 403);
            }

            // Verificar estado
            if (quotation.status !== 'APPROVED') {
                throw new AppError('Only approved quotations can be converted to orders', 400);
            }

            // Verificar validez
            if (new Date() > new Date(quotation.validUntil)) {
                throw new AppError('Quotation has expired', 400);
            }

            // Obtener items de la cotización
            const [items] = await connection.execute<QuotationItemRow[]>(
                `SELECT qi.*, p.stock, p.isActive, p.name
         FROM quotation_items qi
         INNER JOIN products p ON qi.productId = p.id
         WHERE qi.quotationId = ?`,
                [quotationId]
            );

            // Validar stock
            for (const item of items) {
                if (!item.isActive) {
                    throw new AppError(`Product "${item.productName}" is no longer available`, 400);
                }

                if (item.stock < item.quantity) {
                    throw new AppError(
                        `Insufficient stock for "${item.productName}". Available: ${item.stock}`,
                        400
                    );
                }
            }

            // Generar número de orden
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 10000);
            const orderNumber = `ORD-${timestamp}-${random}`;

            // Crear orden
            const shippingAddressJson = JSON.stringify(shippingAddress);
            const billingAddressJson = JSON.stringify(billingAddress);

            await connection.execute(
                `INSERT INTO orders (
          id, orderNumber, userId, status, total, 
          shippingAddress, billingAddress, notes
        ) VALUES (UUID(), ?, ?, 'PENDING', ?, ?, ?, ?)`,
                [
                    orderNumber,
                    userId,
                    quotation.total,
                    shippingAddressJson,
                    billingAddressJson,
                    `Converted from quotation ${quotation.quotationNumber}`,
                ]
            );

            // Obtener ID de la orden
            const [orders] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM orders WHERE orderNumber = ?',
                [orderNumber]
            );

            const orderId = orders[0].id;

            // Crear items de orden y actualizar stock
            for (const item of items) {
                await connection.execute(
                    `INSERT INTO order_items (id, orderId, productId, quantity, price)
           VALUES (UUID(), ?, ?, ?, ?)`,
                    [orderId, item.productId, item.quantity, item.price]
                );

                await connection.execute(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.productId]
                );
            }

            await connection.commit();
            connection.release();

            return {
                message: 'Quotation converted to order successfully',
                orderNumber,
                orderId,
            };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    // Eliminar cotización (solo si está en PENDING)
    async delete(id: string, userId: string, isAdmin: boolean = false) {
        const connection = await pool.getConnection();

        try {
            // Verificar que la cotización existe
            const [quotations] = await connection.execute<QuotationRow[]>(
                'SELECT id, userId, status FROM quotations WHERE id = ?',
                [id]
            );

            if (quotations.length === 0) {
                throw new AppError('Quotation not found', 404);
            }

            const quotation = quotations[0];

            // Verificar permisos
            if (!isAdmin && quotation.userId !== userId) {
                throw new AppError('You do not have permission to delete this quotation', 403);
            }

            // Solo se pueden eliminar cotizaciones pendientes
            if (quotation.status !== 'PENDING') {
                throw new AppError('Only pending quotations can be deleted', 400);
            }

            // Eliminar cotización (los items se eliminan por CASCADE)
            await connection.execute('DELETE FROM quotations WHERE id = ?', [id]);

            connection.release();

            return { message: 'Quotation deleted successfully' };
        } catch (error) {
            connection.release();
            throw error;
        }
    }
}