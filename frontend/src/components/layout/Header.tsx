'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';

export default function Header() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cart } = useCart();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const itemCount = cart?.itemCount || 0;

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md border-b shadow-lg" style={{ background: 'rgba(2, 47, 46, 0.95)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="p-2 rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">E-commerce</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/"
                            className="px-4 py-2 text-gray-200 hover:text-white rounded-lg transition-all duration-300 relative group"
                        >
                            <span className="relative z-10">Inicio</span>
                            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(16, 185, 129, 0.1)' }}></span>
                        </Link>
                        <Link
                            href="/products"
                            className="px-4 py-2 text-gray-200 hover:text-white rounded-lg transition-all duration-300 relative group"
                        >
                            <span className="relative z-10">Productos</span>
                            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(16, 185, 129, 0.1)' }}></span>
                        </Link>
                        <Link
                            href="/categories"
                            className="px-4 py-2 text-gray-200 hover:text-white rounded-lg transition-all duration-300 relative group"
                        >
                            <span className="relative z-10">Categorías</span>
                            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(16, 185, 129, 0.1)' }}></span>
                        </Link>
                        <Link
                            href="/about"
                            className="px-4 py-2 text-gray-200 hover:text-white rounded-lg transition-all duration-300 relative group"
                        >
                            <span className="relative z-10">Nosotros</span>
                            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(16, 185, 129, 0.1)' }}></span>
                        </Link>
                        <Link
                            href="/contact"
                            className="px-4 py-2 text-gray-200 hover:text-white rounded-lg transition-all duration-300 relative group"
                        >
                            <span className="relative z-10">Contacto</span>
                            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(16, 185, 129, 0.1)' }}></span>
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Cart */}
                        {isAuthenticated && (
                            <Link
                                href="/cart"
                                className="relative p-2 text-gray-200 hover:text-white rounded-lg transition-all duration-300 hover:bg-white/10 group"
                            >
                                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User Menu - Desktop */}
                        {isAuthenticated ? (
                            <div className="hidden md:block relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 border border-transparent hover:border-emerald-400/30"
                                >
                                    <div className="p-1 rounded-full" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-white">
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
                                        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border py-2 z-20 backdrop-blur-md" style={{ background: 'rgba(2, 47, 46, 0.98)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                            {isAdmin && (
                                                <>
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-200 hover:text-white hover:bg-emerald-500/10 transition-all duration-300"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        <div className="p-1.5 rounded-lg bg-purple-500/20">
                                                            <LayoutDashboard className="h-4 w-4 text-purple-400" />
                                                        </div>
                                                        <span>Dashboard Admin</span>
                                                    </Link>
                                                    <div className="my-1 mx-3 border-t border-emerald-800/30"></div>
                                                </>
                                            )}
                                            <Link
                                                href="/orders"
                                                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-200 hover:text-white hover:bg-emerald-500/10 transition-all duration-300"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <div className="p-1.5 rounded-lg bg-blue-500/20">
                                                    <Package className="h-4 w-4 text-blue-400" />
                                                </div>
                                                <span>Mis Órdenes</span>
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-200 hover:text-white hover:bg-emerald-500/10 transition-all duration-300"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <div className="p-1.5 rounded-lg bg-emerald-500/20">
                                                    <User className="h-4 w-4 text-emerald-400" />
                                                </div>
                                                <span>Mi Perfil</span>
                                            </Link>
                                            <div className="my-1 mx-3 border-t border-emerald-800/30"></div>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    logout();
                                                }}
                                                className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                                            >
                                                <div className="p-1.5 rounded-lg bg-red-500/20">
                                                    <LogOut className="h-4 w-4" />
                                                </div>
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-gray-200 hover:text-white hover:bg-white/10">
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                        <Sparkles className="h-4 w-4 mr-1" />
                                        Registrarse
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 text-gray-200 hover:text-white rounded-lg transition-all duration-300 hover:bg-white/10"
                        >
                            {showMobileMenu ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden border-t py-4 backdrop-blur-md" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        <nav className="flex flex-col space-y-1 mb-4">
                            <Link
                                href="/products"
                                className="px-4 py-3 text-gray-200 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all duration-300"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Productos
                            </Link>
                            <Link
                                href="/categories"
                                className="px-4 py-3 text-gray-200 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all duration-300"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Categorías
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-3 text-gray-200 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all duration-300"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Nosotros
                            </Link>
                            <Link
                                href="/contact"
                                className="px-4 py-3 text-gray-200 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all duration-300"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Contacto
                            </Link>
                        </nav>

                        {isAuthenticated ? (
                            <div className="border-t pt-4 space-y-1" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                <div className="px-4 py-2 text-emerald-400 text-sm font-semibold">
                                    Hola, {user?.firstName}
                                </div>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all duration-300"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span>Dashboard Admin</span>
                                    </Link>
                                )}
                                <Link
                                    href="/orders"
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all duration-300"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <Package className="h-5 w-5" />
                                    <span>Mis Órdenes</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all duration-300"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <User className="h-5 w-5" />
                                    <span>Mi Perfil</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowMobileMenu(false);
                                        logout();
                                    }}
                                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        ) : (
                            <div className="border-t pt-4 px-4 space-y-2" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                <Link href="/login" className="block" onClick={() => setShowMobileMenu(false)}>
                                    <Button variant="ghost" className="w-full text-gray-200 hover:text-white hover:bg-white/10">
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                                <Link href="/register" className="block" onClick={() => setShowMobileMenu(false)}>
                                    <Button className="w-full font-semibold text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Registrarse
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}