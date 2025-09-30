import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import { asyncHandler } from '../utils/asyncHandler';

export const authenticate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Obtener token del header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verificar token
            const decoded = verifyAccessToken(token);

            // Agregar info del usuario al request
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            };

            next();
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    }
);

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }

        if (!roles.includes(req.user.role)) {
            throw new AppError('You do not have permission to perform this action', 403);
        }

        next();
    };
};