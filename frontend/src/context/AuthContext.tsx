'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api, { getErrorMessage } from '@/lib/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Cargar usuario al iniciar
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                try {
                    const response = await api.get<AuthResponse>('/auth/me');
                    setUser(response.data.user);
                } catch (error) {
                    localStorage.removeItem('accessToken');
                }
            }

            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await api.post<{ data: AuthResponse }>('/auth/login', credentials);
            const { user, accessToken } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            setUser(user);

            toast.success(`¡Bienvenido ${user.firstName}!`);

            // Redirigir según rol
            if (user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/products');
            }
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await api.post<{ data: AuthResponse }>('/auth/register', data);
            const { user, accessToken } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            setUser(user);

            toast.success('¡Cuenta creada exitosamente!');
            router.push('/products');
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
            toast.success('Sesión cerrada');
            router.push('/');
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}