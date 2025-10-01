'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { Cart } from '@/types';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Cargar carrito cuando el usuario esté autenticado
    useEffect(() => {
        if (isAuthenticated) {
            refreshCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated]);

    const refreshCart = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await api.get<{ data: { cart: Cart } }>('/cart');
            setCart(response.data.data.cart);
        } catch (error) {
            console.error('Error al cargar carrito:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: string, quantity: number) => {
        try {
            setLoading(true);
            const response = await api.post<{ data: { cart: Cart } }>('/cart/items', {
                productId,
                quantity,
            });
            setCart(response.data.data.cart);
            toast.success('Producto agregado al carrito');
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            setLoading(true);
            const response = await api.put<{ data: { cart: Cart } }>(`/cart/items/${itemId}`, {
                quantity,
            });
            setCart(response.data.data.cart);
            toast.success('Cantidad actualizada');
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            setLoading(true);
            const response = await api.delete<{ data: { cart: Cart } }>(`/cart/items/${itemId}`);
            setCart(response.data.data.cart);
            toast.success('Producto eliminado del carrito');
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            await api.delete('/cart');
            setCart(null);
            toast.success('Carrito limpiado');
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}