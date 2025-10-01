'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';

export default function Header() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cart } = useCart();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const itemCount = cart?.itemCount || 0;

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-8 w-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">E-commerce</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/products"
                            className="text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            Productos
                        </Link>
                        <Link
                            href="/categories"
                            className="text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            Categorías
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            Nosotros
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            Contacto
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        {isAuthenticated && (
                            <Link
                                href="/cart"
                                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <User className="h-6 w-6 text-gray-700" />
                                    <span className="hidden md:block text-sm font-medium text-gray-700">
                                        {user?.firstName}
                                    </span>
                                </button>

                                {/* Dropdown */}
                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    <span>Dashboard Admin</span>
                                                </Link>
                                            )}
                                            <Link
                                                href="/orders"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <Package className="h-4 w-4" />
                                                <span>Mis Órdenes</span>
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <User className="h-4 w-4" />
                                                <span>Mi Perfil</span>
                                            </Link>
                                            <hr className="my-1" />
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    logout();
                                                }}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">
                                        Registrarse
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}