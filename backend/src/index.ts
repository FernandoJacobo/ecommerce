import app from './app';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Probar conexión a BD antes de iniciar servidor
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});