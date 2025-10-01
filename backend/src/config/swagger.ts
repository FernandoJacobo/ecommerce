import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'E-commerce API',
			version: '1.0.0',
			description: 'API para e-commerce con autenticación, productos, carrito, órdenes y cotizaciones',
			contact: {
				name: '<JacoboDev />',
				email: 'contacto@jacobodev.com',
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
			schemas: {
				Category: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '550e8400-e29b-41d4-a716-446655440000',
						},
						name: {
							type: 'string',
							example: 'Electrónica',
						},
						description: {
							type: 'string',
							example: 'Productos electrónicos y gadgets',
						},
						slug: {
							type: 'string',
							example: 'electronica',
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
						},
						updatedAt: {
							type: 'string',
							format: 'date-time',
						},
					},
				},
				Product: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
						},
						name: {
							type: 'string',
							example: 'iPhone 15 Pro',
						},
						description: {
							type: 'string',
							example: 'Último modelo de iPhone con chip A17 Pro',
						},
						price: {
							type: 'number',
							format: 'decimal',
							example: 999.99,
						},
						stock: {
							type: 'integer',
							example: 50,
						},
						sku: {
							type: 'string',
							example: 'IPH15PRO-256-BLK',
						},
						images: {
							type: 'string',
							description: 'JSON array de URLs de imágenes',
							example: '["https://example.com/image1.jpg", "https://example.com/image2.jpg"]',
						},
						categoryId: {
							type: 'string',
							format: 'uuid',
						},
						isActive: {
							type: 'boolean',
							example: true,
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
						},
						updatedAt: {
							type: 'string',
							format: 'date-time',
						},
					},
				},
			},
		},
		tags: [
			{ name: 'Health', description: 'Health check endpoints' },
			{ name: 'Auth', description: 'Autenticación y autorización' },
			{ name: 'Categories', description: 'Gestión de categorías de productos' },
			{ name: 'Products', description: 'Gestión de productos' },
			{ name: 'Cart', description: 'Carrito de compras' },
			{ name: 'Orders', description: 'Órdenes de compra' },
			{ name: 'Quotations', description: 'Cotizaciones' },
			{ name: 'Users', description: 'Gestión de usuarios (Admin)' },
		],
	},
	apis: [
		path.join(__dirname, '../controllers/**/*.ts'),
		path.join(__dirname, '../routes/**/*.ts'),
		path.join(__dirname, '../config/routes.ts'),
	],
};

export const swaggerSpec = swaggerJsdoc(options);