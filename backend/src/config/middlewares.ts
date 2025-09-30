import { Application } from 'express';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { rateLimiter } from '../middlewares/rateLimiter';

export const setupMiddlewares = (app: Application): void => {
    // Seguridad
    app.use(helmet());

    // CORS
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    }));

    // Parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Rate limiting
    app.use(rateLimiter);

    // Swagger Documentation
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};