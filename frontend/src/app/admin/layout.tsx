'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    FolderOpen,
    FileText,
    LogOut,
    Menu,
    X,
    Store,
    Shield
} from 'lucide-react';
import { useState } from 'react';
import Spinner from '@/components/ui/Spinner';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!isAdmin) {
            router.push('/');
        }
    }, [isAuthenticated, isAdmin, router]);

    if (!isAuthenticated || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, color: '#10b981' },
        { name: 'Productos', href: '/admin/products', icon: Package, color: '#3b82f6' },
        { name: 'Categorías', href: '/admin/categories', icon: FolderOpen, color: '#8b5cf6' },
        { name: 'Órdenes', href: '/admin/orders', icon: ShoppingBag, color: '#f59e0b' },
        { name: 'Cotizaciones', href: '/admin/quotations', icon: FileText, color: '#06b6d4' },
        { name: 'Usuarios', href: '/admin/users', icon: Users, color: '#ec4899' },
    ];

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}
                >
                    {sidebarOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 text-white transform transition-transform duration-300 ease-in-out z-40 shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
                style={{ background: 'linear-gradient(180deg, #022f2e 0%, #034442 100%)' }}
            >
                {/* Logo */}
                <div className="p-6 border-b border-emerald-800/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                    </div>
                    <p className="text-sm text-gray-400">E-commerce Dashboard</p>
                </div>

                {/* User Info */}
                <div className="p-6 border-b border-emerald-800/30">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${item.color}20` }}>
                                        <item.icon className="h-5 w-5 transition-colors duration-300" style={{ color: item.color }} />
                                    </div>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-emerald-800/30">
                    <Link
                        href="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 mb-2 group"
                    >
                        <div className="p-1.5 rounded-lg bg-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Store className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="font-medium">Ver Tienda</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group"
                        style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    >
                        <div className="p-1.5 rounded-lg bg-red-500/20 group-hover:scale-110 transition-transform duration-300">
                            <LogOut className="h-5 w-5 text-red-400" />
                        </div>
                        <span className="font-medium text-red-400">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-72 min-h-screen">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}