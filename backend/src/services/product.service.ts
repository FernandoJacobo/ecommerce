import { pool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateProductData {
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    images: string[];
    categoryId: string;
}

interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    sku?: string;
    images?: string[];
    categoryId?: string;
    isActive?: boolean;
}

interface ProductRow extends RowDataPacket {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    images: string;
    categoryId: string;
    categoryName?: string;
    categorySlug?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface FilterOptions {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price' | 'createdAt' | 'stock';
    sortOrder?: 'ASC' | 'DESC';
}

export class ProductService {
    async create(data: CreateProductData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar que la categoría existe
            const [categories] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM categories WHERE id = ?',
                [data.categoryId]
            );

            if (categories.length === 0) {
                throw new AppError('Category not found', 404);
            }

            // Verificar que el SKU no existe
            const [existing] = await connection.execute<ProductRow[]>(
                'SELECT id FROM products WHERE sku = ?',
                [data.sku]
            );

            if (existing.length > 0) {
                throw new AppError('Product with this SKU already exists', 409);
            }

            // Convertir array de imágenes a JSON string
            const imagesJson = JSON.stringify(data.images);

            // Crear producto
            await connection.execute(
                `INSERT INTO products (id, name, description, price, stock, sku, images, categoryId) 
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.name,
                    data.description,
                    data.price,
                    data.stock,
                    data.sku,
                    imagesJson,
                    data.categoryId,
                ]
            );

            // Obtener el producto creado con categoría
            const [products] = await connection.execute<ProductRow[]>(
                `SELECT p.*, c.name as categoryName, c.slug as categorySlug
         FROM products p
         INNER JOIN categories c ON p.categoryId = c.id
         WHERE p.sku = ?`,
                [data.sku]
            );

            await connection.commit();
            connection.release();

            const product = products[0];

            return {
                ...product,
                images: JSON.parse(product.images),
                category: {
                    id: product.categoryId,
                    name: product.categoryName,
                    slug: product.categorySlug,
                },
            };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    async findAll(filters: FilterOptions = {}) {
        const connection = await pool.getConnection();

        try {
            // Valores por defecto
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const offset = (page - 1) * limit;
            const sortBy = filters.sortBy || 'createdAt';
            const sortOrder = filters.sortOrder || 'DESC';

            // Construir WHERE clause dinámicamente
            const conditions: string[] = [];
            const values: any[] = [];

            if (filters.categoryId) {
                conditions.push('p.categoryId = ?');
                values.push(filters.categoryId);
            }

            if (filters.minPrice !== undefined) {
                conditions.push('p.price >= ?');
                values.push(filters.minPrice);
            }

            if (filters.maxPrice !== undefined) {
                conditions.push('p.price <= ?');
                values.push(filters.maxPrice);
            }

            if (filters.search) {
                conditions.push('(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)');
                const searchTerm = `%${filters.search}%`;
                values.push(searchTerm, searchTerm, searchTerm);
            }

            if (filters.isActive !== undefined) {
                conditions.push('p.isActive = ?');
                values.push(filters.isActive);
            }

            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Obtener total de productos
            const [countResult] = await connection.execute<RowDataPacket[]>(
                `SELECT COUNT(*) as total FROM products p ${whereClause}`,
                values
            );

            const total = countResult[0].total;

            // Obtener productos con paginación
            const [products] = await connection.execute<ProductRow[]>(
                `SELECT p.*, c.name as categoryName, c.slug as categorySlug
         FROM products p
         INNER JOIN categories c ON p.categoryId = c.id
         ${whereClause}
         ORDER BY p.${sortBy} ${sortOrder}
         LIMIT ? OFFSET ?`,
                [...values, limit, offset]
            );

            connection.release();

            // Parsear imágenes y formatear respuesta
            const formattedProducts = products.map((product) => ({
                ...product,
                images: JSON.parse(product.images),
                category: {
                    id: product.categoryId,
                    name: product.categoryName,
                    slug: product.categorySlug,
                },
            }));

            return {
                products: formattedProducts,
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

    async findById(id: string) {
        const connection = await pool.getConnection();

        try {
            const [products] = await connection.execute<ProductRow[]>(
                `SELECT p.*, c.name as categoryName, c.slug as categorySlug
         FROM products p
         INNER JOIN categories c ON p.categoryId = c.id
         WHERE p.id = ?`,
                [id]
            );

            if (products.length === 0) {
                throw new AppError('Product not found', 404);
            }

            connection.release();

            const product = products[0];

            return {
                ...product,
                images: JSON.parse(product.images),
                category: {
                    id: product.categoryId,
                    name: product.categoryName,
                    slug: product.categorySlug,
                },
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async findBySku(sku: string) {
        const connection = await pool.getConnection();

        try {
            const [products] = await connection.execute<ProductRow[]>(
                `SELECT p.*, c.name as categoryName, c.slug as categorySlug
         FROM products p
         INNER JOIN categories c ON p.categoryId = c.id
         WHERE p.sku = ?`,
                [sku]
            );

            if (products.length === 0) {
                throw new AppError('Product not found', 404);
            }

            connection.release();

            const product = products[0];

            return {
                ...product,
                images: JSON.parse(product.images),
                category: {
                    id: product.categoryId,
                    name: product.categoryName,
                    slug: product.categorySlug,
                },
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async update(id: string, data: UpdateProductData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar que el producto existe
            const [existing] = await connection.execute<ProductRow[]>(
                'SELECT * FROM products WHERE id = ?',
                [id]
            );

            if (existing.length === 0) {
                throw new AppError('Product not found', 404);
            }

            const product = existing[0];

            // Si se actualiza el SKU, verificar que no exista
            if (data.sku && data.sku !== product.sku) {
                const [duplicates] = await connection.execute<ProductRow[]>(
                    'SELECT id FROM products WHERE sku = ? AND id != ?',
                    [data.sku, id]
                );

                if (duplicates.length > 0) {
                    throw new AppError('Product with this SKU already exists', 409);
                }
            }

            // Si se actualiza la categoría, verificar que existe
            if (data.categoryId) {
                const [categories] = await connection.execute<RowDataPacket[]>(
                    'SELECT id FROM categories WHERE id = ?',
                    [data.categoryId]
                );

                if (categories.length === 0) {
                    throw new AppError('Category not found', 404);
                }
            }

            // Construir query dinámicamente
            const updates: string[] = [];
            const values: any[] = [];

            if (data.name !== undefined) {
                updates.push('name = ?');
                values.push(data.name);
            }
            if (data.description !== undefined) {
                updates.push('description = ?');
                values.push(data.description);
            }
            if (data.price !== undefined) {
                updates.push('price = ?');
                values.push(data.price);
            }
            if (data.stock !== undefined) {
                updates.push('stock = ?');
                values.push(data.stock);
            }
            if (data.sku !== undefined) {
                updates.push('sku = ?');
                values.push(data.sku);
            }
            if (data.images !== undefined) {
                updates.push('images = ?');
                values.push(JSON.stringify(data.images));
            }
            if (data.categoryId !== undefined) {
                updates.push('categoryId = ?');
                values.push(data.categoryId);
            }
            if (data.isActive !== undefined) {
                updates.push('isActive = ?');
                values.push(data.isActive);
            }

            if (updates.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            values.push(id);

            await connection.execute(
                `UPDATE products SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
                values
            );

            // Obtener producto actualizado
            const [updated] = await connection.execute<ProductRow[]>(
                `SELECT p.*, c.name as categoryName, c.slug as categorySlug
         FROM products p
         INNER JOIN categories c ON p.categoryId = c.id
         WHERE p.id = ?`,
                [id]
            );

            await connection.commit();
            connection.release();

            const updatedProduct = updated[0];

            return {
                ...updatedProduct,
                images: JSON.parse(updatedProduct.images),
                category: {
                    id: updatedProduct.categoryId,
                    name: updatedProduct.categoryName,
                    slug: updatedProduct.categorySlug,
                },
            };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    async delete(id: string) {
        const connection = await pool.getConnection();

        try {
            // Verificar que el producto existe
            const [products] = await connection.execute<ProductRow[]>(
                'SELECT * FROM products WHERE id = ?',
                [id]
            );

            if (products.length === 0) {
                throw new AppError('Product not found', 404);
            }

            // Eliminar producto
            await connection.execute('DELETE FROM products WHERE id = ?', [id]);

            connection.release();

            return { message: 'Product deleted successfully' };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async updateStock(id: string, quantity: number) {
        const connection = await pool.getConnection();

        try {
            // Verificar que el producto existe
            const [products] = await connection.execute<ProductRow[]>(
                'SELECT stock FROM products WHERE id = ?',
                [id]
            );

            if (products.length === 0) {
                throw new AppError('Product not found', 404);
            }

            const newStock = products[0].stock + quantity;

            if (newStock < 0) {
                throw new AppError('Insufficient stock', 400);
            }

            // Actualizar stock
            await connection.execute(
                'UPDATE products SET stock = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
                [newStock, id]
            );

            connection.release();

            return { message: 'Stock updated successfully', newStock };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async toggleActive(id: string) {
        const connection = await pool.getConnection();

        try {
            // Verificar que el producto existe
            const [products] = await connection.execute<ProductRow[]>(
                'SELECT isActive FROM products WHERE id = ?',
                [id]
            );

            if (products.length === 0) {
                throw new AppError('Product not found', 404);
            }

            const newStatus = !products[0].isActive;

            // Actualizar estado
            await connection.execute(
                'UPDATE products SET isActive = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
                [newStatus, id]
            );

            connection.release();

            return {
                message: `Product ${newStatus ? 'activated' : 'deactivated'} successfully`,
                isActive: newStatus,
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }
}