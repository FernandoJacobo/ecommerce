import { Application, Request, Response } from 'express';
import authRoutes from '../routes/auth.routes';
import categoryRoutes from '../routes/category.routes';
import productRoutes from '../routes/product.routes';
import cartRoutes from '../routes/cart.routes';
import orderRoutes from '../routes/order.routes';
import quotationRoutes from '../routes/quotation.routes';
import userRoutes from '../routes/user.routes';

export const setupRoutes = (app: Application): void => {
    // Health check
    /**
     * @swagger
     * /health:
     *   get:
     *     summary: Health check endpoint
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Server is running
     */
    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({
            status: 'OK',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        });
    });

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/quotations', quotationRoutes);
    app.use('/api/users', userRoutes);

    // 404 handler
    app.use((req: Request, res: Response) => {
        res.status(404).json({
            status: 'error',
            message: 'Route not found',
            path: req.path,
        });
    });
};