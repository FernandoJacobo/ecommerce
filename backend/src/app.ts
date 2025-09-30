import express, { Application } from 'express';
import { setupMiddlewares } from './config/middlewares';
import { setupRoutes } from './config/routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Configurar middlewares
setupMiddlewares(app);

// Configurar rutas
setupRoutes(app);

// Error handler (siempre al final)
app.use(errorHandler);

export default app;