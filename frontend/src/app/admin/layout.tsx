'use client';

import { useEffect, useState, useRef } from 'react';
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
    Shield,
    ChevronDown,
    User as UserIcon,
    Settings
} from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!isAdmin) {
            router.push('/');
        }
    }, [isAuthenticated, isAdmin, router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            {/* Navbar */}
            <nav className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white border-b-2 border-gray-100 z-30 shadow-sm">
                <div className="h-full px-6 flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="h-6 w-6" style={{ color: '#022f2e' }} />
                    </button>

                    {/* Empty space for alignment */}
                    <div className="hidden lg:block"></div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            >
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold" style={{ color: '#022f2e' }}>
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}</p>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden">
                                {/* User Info */}
                                <div className="p-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                        >
                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate" style={{ color: '#022f2e' }}>
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                        <Shield className="h-3 w-3" />
                                        {user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                                    </span>
                                </div>

                                {/* Menu Items */}
                                <div className="p-2">
                                    <Link
                                        href="/"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                            <Store className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: '#022f2e' }}>Ver Tienda</span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            logout();
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                                            <LogOut className="h-4 w-4 text-red-600" />
                                        </div>
                                        <span className="text-sm font-medium text-red-600">Cerrar Sesión</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

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

                {/* Navigation */}
                <nav className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
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
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-72 mt-16">
                <div className="p-6 lg:p-8 min-h-screen">
                    {children}
                </div>

                {/* Footer */}
                <footer className="border-t-2 border-gray-100 bg-white">
                    <div className="px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Shield className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-semibold" style={{ color: '#022f2e' }}>
                                    Admin Panel
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">
                                © {new Date().getFullYear()} E-commerce. Todos los derechos reservados.
                            </p>

                            <div className="flex items-center gap-4">
                                <a href="http://localhost:5000/api/docs" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                                    API Docs
                                </a>
                                <span className="text-gray-300">|</span>
                                <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                                    Ver Tienda
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}