'use client';

import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import {
    TrendingUp,
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    ShoppingBag,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Store,
    BookOpen,
    Plus
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface Stats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    lowStockProducts: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                api.get('/users/statistics'),
                api.get('/products?limit=1000'),
                api.get('/orders?limit=1000'),
            ]);

            const products = productsRes.data.data.products;
            const orders = ordersRes.data.data.orders;

            const totalRevenue = orders
                .filter((o: any) => ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status))
                .reduce((sum: number, o: any) => sum + parseFloat(o.total), 0);

            const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;
            const lowStockProducts = products.filter((p: any) => p.stock < 10 && p.stock > 0).length;

            setStats({
                totalUsers: usersRes.data.data.statistics.usersByRole.reduce((sum: number, r: any) => sum + r.count, 0),
                totalProducts: products.length,
                totalOrders: orders.length,
                totalRevenue,
                pendingOrders,
                lowStockProducts,
            });
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Ventas Totales',
            value: formatPrice(stats?.totalRevenue || 0),
            icon: DollarSign,
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        },
        {
            title: 'Total Órdenes',
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        },
        {
            title: 'Órdenes Pendientes',
            value: stats?.pendingOrders || 0,
            icon: ShoppingCart,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        },
        {
            title: 'Total Productos',
            value: stats?.totalProducts || 0,
            icon: Package,
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        },
        {
            title: 'Total Usuarios',
            value: stats?.totalUsers || 0,
            icon: Users,
            gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        },
        {
            title: 'Stock Bajo',
            value: stats?.lowStockProducts || 0,
            icon: TrendingUp,
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#022f2e' }}>Dashboard</h1>
                <p className="text-gray-600 text-lg">Bienvenido al panel de administración</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-2 font-medium">{stat.title}</p>
                                <p className="text-4xl font-bold" style={{ color: '#022f2e' }}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl" style={{ background: stat.gradient }}>
                                <stat.icon className="h-10 w-10 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                    <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                        <h2 className="text-2xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                            <Plus className="h-6 w-6 mr-2 text-emerald-600" />
                            Acciones Rápidas
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            <a
                                href="/admin/products"
                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold text-white"
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            >
                                <span>Agregar Producto</span>
                                <Plus className="h-5 w-5" />
                            </a>
                            <a
                                href="/admin/categories"
                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold text-white"
                                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                            >
                                <span>Agregar Categoría</span>
                                <Plus className="h-5 w-5" />
                            </a>
                            <a
                                href="/admin/orders"
                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold text-white"
                                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                            >
                                <span>Ver Órdenes Pendientes</span>
                                <ShoppingCart className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                    <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                        <h2 className="text-2xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                            <AlertCircle className="h-6 w-6 mr-2 text-orange-600" />
                            Alertas
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {stats?.pendingOrders! > 0 && (
                                <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ background: 'rgba(251, 146, 60, 0.1)', borderColor: 'rgba(251, 146, 60, 0.3)' }}>
                                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-semibold text-orange-900">
                                        <strong>{stats?.pendingOrders}</strong> órdenes pendientes de confirmar
                                    </p>
                                </div>
                            )}
                            {stats?.lowStockProducts! > 0 && (
                                <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-semibold text-red-900">
                                        <strong>{stats?.lowStockProducts}</strong> productos con stock bajo
                                    </p>
                                </div>
                            )}
                            {stats?.pendingOrders === 0 && stats?.lowStockProducts === 0 && (
                                <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-semibold text-emerald-900">
                                        Todo está bajo control
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                    <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                        <h2 className="text-2xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                            <BookOpen className="h-6 w-6 mr-2 text-purple-600" />
                            Enlaces Útiles
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            <a
                                href="http://localhost:5000/api/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-purple-50 transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-100 group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <span className="font-semibold" style={{ color: '#022f2e' }}>Documentación API</span>
                                </div>
                                <ExternalLink className="h-4 w-4 text-gray-400" />
                            </a>

                            <a
                                href="/"
                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-100 group-hover:scale-110 transition-transform duration-300">
                                        <Store className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <span className="font-semibold" style={{ color: '#022f2e' }}>Ver Tienda</span>
                                </div>
                            </a>

                            <a
                                href="/admin/users"
                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 group-hover:scale-110 transition-transform duration-300">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="font-semibold" style={{ color: '#022f2e' }}>Gestionar Usuarios</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}