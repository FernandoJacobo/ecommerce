import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        { expiresIn: '59m' } // 15 minutos
    );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' } // 7 días
    );
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as TokenPayload;
};