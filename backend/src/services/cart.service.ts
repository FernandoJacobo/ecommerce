import { pool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface AddToCartData {
    userId: string;
    productId: string;
    quantity: number;
}

interface UpdateCartItemData {
    quantity: number;
}

interface CartRow extends RowDataPacket {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface CartItemRow extends RowDataPacket {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    productName: string;
    productPrice: number;
    productStock: number;
    productImages: string;
    productSku: string;
    productIsActive: boolean;
}

interface ProductRow extends RowDataPacket {
    stock: number;
    isActive: boolean;
}

export class CartService {
    // Obtener o crear carrito del usuario
    async getOrCreateCart(userId: string): Promise<string> {
        const connection = await pool.getConnection();

        try {
            // Buscar carrito existente
            const [carts] = await connection.execute<CartRow[]>(
                'SELECT id FROM carts WHERE userId = ?',
                [userId]
            );

            if (carts.length > 0) {
                connection.release();
                return carts[0].id;
            }

            // Crear nuevo carrito
            await connection.execute(
                'INSERT INTO carts (id, userId) VALUES (UUID(), ?)',
                [userId]
            );

            const [newCarts] = await connection.execute<CartRow[]>(
                'SELECT id FROM carts WHERE userId = ?',
                [userId]
            );

            connection.release();
            return newCarts[0].id;
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Agregar producto al carrito
    async addItem(data: AddToCartData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar que el producto existe y está activo
            const [products] = await connection.execute<ProductRow[]>(
                'SELECT stock, isActive FROM products WHERE id = ?',
                [data.productId]
            );

            if (products.length === 0) {
                throw new AppError('Product not found', 404);
            }

            const product = products[0];

            if (!product.isActive) {
                throw new AppError('Product is not available', 400);
            }

            if (product.stock < data.quantity) {
                throw new AppError('Insufficient stock', 400);
            }

            // Obtener o crear carrito
            const cartId = await this.getOrCreateCart(data.userId);

            // Verificar si el producto ya está en el carrito
            const [existingItems] = await connection.execute<CartItemRow[]>(
                'SELECT id, quantity FROM cart_items WHERE cartId = ? AND productId = ?',
                [cartId, data.productId]
            );

            if (existingItems.length > 0) {
                // Actualizar cantidad
                const newQuantity = existingItems[0].quantity + data.quantity;

                if (product.stock < newQuantity) {
                    throw new AppError('Insufficient stock', 400);
                }

                await connection.execute(
                    'UPDATE cart_items SET quantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
                    [newQuantity, existingItems[0].id]
                );
            } else {
                // Agregar nuevo item
                await connection.execute(
                    'INSERT INTO cart_items (id, cartId, productId, quantity) VALUES (UUID(), ?, ?, ?)',
                    [cartId, data.productId, data.quantity]
                );
            }

            await connection.commit();

            // Obtener carrito actualizado
            const cart = await this.getCartByUserId(data.userId);

            connection.release();
            return cart;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    // Obtener carrito del usuario
    async getCartByUserId(userId: string) {
        const connection = await pool.getConnection();

        try {
            // Obtener o crear carrito
            const cartId = await this.getOrCreateCart(userId);

            // Obtener items del carrito con información del producto
            const [items] = await connection.execute<CartItemRow[]>(
                `SELECT 
          ci.id,
          ci.cartId,
          ci.productId,
          ci.quantity,
          p.name as productName,
          p.price as productPrice,
          p.stock as productStock,
          p.images as productImages,
          p.sku as productSku,
          p.isActive as productIsActive
        FROM cart_items ci
        INNER JOIN products p ON ci.productId = p.id
        WHERE ci.cartId = ?`,
                [cartId]
            );

            // Calcular total
            let total = 0;
            const formattedItems = items.map((item) => {
                const itemTotal = item.productPrice * item.quantity;
                total += itemTotal;

                return {
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    product: {
                        name: item.productName,
                        price: item.productPrice,
                        stock: item.productStock,
                        images: JSON.parse(item.productImages),
                        sku: item.productSku,
                        isActive: item.productIsActive,
                    },
                    itemTotal,
                };
            });

            connection.release();

            return {
                cartId,
                items: formattedItems,
                itemCount: formattedItems.length,
                total: parseFloat(total.toFixed(2)),
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Actualizar cantidad de un item
    async updateItem(userId: string, itemId: string, data: UpdateCartItemData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar que el item existe y pertenece al usuario
            const [items] = await connection.execute<CartItemRow[]>(
                `SELECT ci.id, ci.productId, c.userId
         FROM cart_items ci
         INNER JOIN carts c ON ci.cartId = c.id
         WHERE ci.id = ? AND c.userId = ?`,
                [itemId, userId]
            );

            if (items.length === 0) {
                throw new AppError('Cart item not found', 404);
            }

            const item = items[0];

            // Verificar stock disponible
            const [products] = await connection.execute<ProductRow[]>(
                'SELECT stock, isActive FROM products WHERE id = ?',
                [item.productId]
            );

            if (products.length === 0 || !products[0].isActive) {
                throw new AppError('Product is not available', 400);
            }

            if (products[0].stock < data.quantity) {
                throw new AppError('Insufficient stock', 400);
            }

            // Actualizar cantidad
            await connection.execute(
                'UPDATE cart_items SET quantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
                [data.quantity, itemId]
            );

            await connection.commit();

            // Obtener carrito actualizado
            const cart = await this.getCartByUserId(userId);

            connection.release();
            return cart;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    // Eliminar item del carrito
    async removeItem(userId: string, itemId: string) {
        const connection = await pool.getConnection();

        try {
            // Verificar que el item existe y pertenece al usuario
            const [items] = await connection.execute<CartItemRow[]>(
                `SELECT ci.id
         FROM cart_items ci
         INNER JOIN carts c ON ci.cartId = c.id
         WHERE ci.id = ? AND c.userId = ?`,
                [itemId, userId]
            );

            if (items.length === 0) {
                throw new AppError('Cart item not found', 404);
            }

            // Eliminar item
            await connection.execute('DELETE FROM cart_items WHERE id = ?', [itemId]);

            // Obtener carrito actualizado
            const cart = await this.getCartByUserId(userId);

            connection.release();
            return cart;
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    // Limpiar carrito
    async clearCart(userId: string) {
        const connection = await pool.getConnection();

        try {
            // Obtener carrito del usuario
            const [carts] = await connection.execute<CartRow[]>(
                'SELECT id FROM carts WHERE userId = ?',
                [userId]
            );

            if (carts.length === 0) {
                throw new AppError('Cart not found', 404);
            }

            // Eliminar todos los items
            await connection.execute('DELETE FROM cart_items WHERE cartId = ?', [
                carts[0].id,
            ]);

            connection.release();

            return { message: 'Cart cleared successfully' };
        } catch (error) {
            connection.release();
            throw error;
        }
    }
}