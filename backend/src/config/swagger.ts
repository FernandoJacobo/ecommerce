import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0',
            description: 'API completa para e-commerce con autenticación, productos, carrito, órdenes y cotizaciones',
            contact: {
                name: 'Fernando',
                email: 'tu-email@ejemplo.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa el access token recibido en login/register',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refreshToken',
                    description: 'Refresh token almacenado en cookie httpOnly',
                },
            },
        },
        tags: [
            { name: 'Health', description: 'Health check endpoints' },
            { name: 'Auth', description: 'Autenticación y autorización' },
            { name: 'Products', description: 'Gestión de productos' },
            { name: 'Categories', description: 'Gestión de categorías' },
            { name: 'Cart', description: 'Carrito de compras' },
            { name: 'Orders', description: 'Órdenes de compra' },
            { name: 'Quotations', description: 'Cotizaciones' },
            { name: 'Users', description: 'Gestión de usuarios (Admin)' },
        ],
    },
    // Rutas donde buscar comentarios de Swagger (CRÍTICO)
    apis: [
        path.join(__dirname, '../controllers/**/*.ts'),
        path.join(__dirname, '../routes/**/*.ts'),
        path.join(__dirname, '../config/routes.ts'),
    ],
};

export const swaggerSpec = swaggerJsdoc(options);