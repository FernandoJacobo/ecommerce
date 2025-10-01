import { pool } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateCategoryData {
    name: string;
    description?: string;
    slug: string;
}

interface UpdateCategoryData {
    name?: string;
    description?: string;
    slug?: string;
}

interface CategoryRow extends RowDataPacket {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    productCount?: number;
}

interface ProductRow extends RowDataPacket {
    id: string;
    name: string;
    price: number;
    images: string;
    stock: number;
}

export class CategoryService {
    async create(data: CreateCategoryData) {
        const connection = await pool.getConnection();

        try {
            // Verificar si el slug ya existe
            const [existing] = await connection.execute<CategoryRow[]>(
                'SELECT id FROM categories WHERE slug = ?',
                [data.slug]
            );

            if (existing.length > 0) {
                throw new AppError('Category with this slug already exists', 409);
            }

            // Crear categoría
            await connection.execute(
                `INSERT INTO categories (id, name, description, slug) 
         VALUES (UUID(), ?, ?, ?)`,
                [data.name, data.description || null, data.slug]
            );

            // Obtener la categoría creada
            const [categories] = await connection.execute<CategoryRow[]>(
                'SELECT * FROM categories WHERE slug = ?',
                [data.slug]
            );

            connection.release();

            return categories[0];
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async findAll() {
        const [categories] = await pool.execute<CategoryRow[]>(
            `SELECT c.*, COUNT(p.id) as productCount
       FROM categories c
       LEFT JOIN products p ON c.id = p.categoryId
       GROUP BY c.id
       ORDER BY c.name ASC`
        );

        return categories;
    }

    async findById(id: string) {
        const connection = await pool.getConnection();

        try {
            // Obtener categoría
            const [categories] = await connection.execute<CategoryRow[]>(`
                SELECT * FROM categories WHERE id = ?
            `, [id]);

            if (categories.length === 0) {
                throw new AppError('Category not found', 404);
            }

            const category = categories[0];

            // Obtener productos de la categoría
            const [products] = await connection.execute<ProductRow[]>(`
                SELECT id, name, price, images, stock 
                FROM products 
                WHERE categoryId = ? AND isActive = true
            `, [id]);

            connection.release();

            return {
                ...category,
                products,
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async findBySlug(slug: string) {
        const connection = await pool.getConnection();

        try {
            // Obtener categoría
            const [categories] = await connection.execute<CategoryRow[]>(
                'SELECT * FROM categories WHERE slug = ?',
                [slug]
            );

            if (categories.length === 0) {
                throw new AppError('Category not found', 404);
            }

            const category = categories[0];

            // Obtener productos de la categoría
            const [products] = await connection.execute<ProductRow[]>(
                `SELECT id, name, price, images, stock 
         FROM products 
         WHERE categoryId = ? AND isActive = true`,
                [category.id]
            );

            connection.release();

            return {
                ...category,
                products,
            };
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async update(id: string, data: UpdateCategoryData) {
        const connection = await pool.getConnection();

        try {
            // Verificar que la categoría existe
            const [existing] = await connection.execute<CategoryRow[]>(
                'SELECT * FROM categories WHERE id = ?',
                [id]
            );

            if (existing.length === 0) {
                throw new AppError('Category not found', 404);
            }

            const category = existing[0];

            // Si se actualiza el slug, verificar que no exista
            if (data.slug && data.slug !== category.slug) {
                const [duplicates] = await connection.execute<CategoryRow[]>(
                    'SELECT id FROM categories WHERE slug = ? AND id != ?',
                    [data.slug, id]
                );

                if (duplicates.length > 0) {
                    throw new AppError('Category with this slug already exists', 409);
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
            if (data.slug !== undefined) {
                updates.push('slug = ?');
                values.push(data.slug);
            }

            if (updates.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            values.push(id);

            await connection.execute(
                `UPDATE categories SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
                values
            );

            // Obtener categoría actualizada
            const [updated] = await connection.execute<CategoryRow[]>(
                'SELECT * FROM categories WHERE id = ?',
                [id]
            );

            connection.release();

            return updated[0];
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async delete(id: string) {
        const connection = await pool.getConnection();

        try {
            // Verificar que la categoría existe
            const [categories] = await connection.execute<CategoryRow[]>(
                'SELECT * FROM categories WHERE id = ?',
                [id]
            );

            if (categories.length === 0) {
                throw new AppError('Category not found', 404);
            }

            // Verificar si tiene productos
            const [products] = await connection.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM products WHERE categoryId = ?',
                [id]
            );

            if (products[0].count > 0) {
                throw new AppError('Cannot delete category with associated products', 400);
            }

            // Eliminar categoría
            await connection.execute('DELETE FROM categories WHERE id = ?', [id]);

            connection.release();

            return { message: 'Category deleted successfully' };
        } catch (error) {
            connection.release();
            throw error;
        }
    }
}