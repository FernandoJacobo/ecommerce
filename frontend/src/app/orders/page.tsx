'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api, { getErrorMessage } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, Eye, CheckCircle, Clock, Truck, XCircle, RefreshCw, Sparkles, MapPin, CreditCard } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import toast from 'react-hot-toast';

function OrdersContent() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Mostrar mensaje de éxito si viene del checkout
        if (searchParams.get('success') === 'true') {
            const orderNumber = searchParams.get('orderNumber');
            toast.success(`¡Orden ${orderNumber} creada exitosamente!`, {
                duration: 5000,
            });
            router.replace('/orders');
        }

        loadOrders();
    }, [isAuthenticated, router]);

    const loadOrders = async () => {
        const isRefresh = orders.length > 0;
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        
        try {
            const response = await api.get<{ data: { orders: Order[] } }>('/orders');
            setOrders(response.data.data.orders);
            if (isRefresh) {
                toast.success('Órdenes actualizadas');
            }
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getStatusBadge = (status: Order['status']) => {
        const statusConfig: Record<Order['status'], { variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; label: string; icon: any; color: string }> = {
            PENDING: { variant: 'warning', label: 'Pendiente', icon: Clock, color: '#f59e0b' },
            CONFIRMED: { variant: 'info', label: 'Confirmada', icon: CheckCircle, color: '#3b82f6' },
            PROCESSING: { variant: 'info', label: 'Procesando', icon: Package, color: '#06b6d4' },
            SHIPPED: { variant: 'info', label: 'Enviada', icon: Truck, color: '#8b5cf6' },
            DELIVERED: { variant: 'success', label: 'Entregada', icon: CheckCircle, color: '#10b981' },
            CANCELLED: { variant: 'danger', label: 'Cancelada', icon: XCircle, color: '#ef4444' },
        };

        const config = statusConfig[status];
        const Icon = config.icon;
        
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm border-2" style={{ 
                backgroundColor: `${config.color}15`,
                borderColor: `${config.color}40`,
                color: config.color
            }}>
                <Icon className="h-4 w-4" />
                {config.label}
            </div>
        );
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Spinner size="lg" />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            <Header />

            <main className="flex-1">
                {/* Hero Header */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    <div className="container mx-auto px-4 py-12 relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-3">
                                    <Sparkles className="h-4 w-4 text-emerald-300" />
                                    <span className="text-sm font-medium text-emerald-100">{orders.length} orden{orders.length !== 1 ? 'es' : ''}</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-2">Mis Órdenes</h1>
                                <p className="text-gray-300 text-lg">Revisa el historial de tus compras</p>
                            </div>
                            <button
                                onClick={loadOrders}
                                disabled={refreshing}
                                className="h-12 px-6 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                                style={{ background: refreshing ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            >
                                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                                {refreshing ? 'Actualizando...' : 'Actualizar'}
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 -mb-px">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {orders.length === 0 ? (
                        <div className="max-w-lg mx-auto text-center py-16">
                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                                <Package className="h-16 w-16 text-gray-400" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4" style={{ color: '#022f2e' }}>
                                No tienes órdenes aún
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                Comienza a comprar y aquí verás el historial de tus pedidos
                            </p>
                            <Link href="/products">
                                <Button 
                                    size="lg" 
                                    className="font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                >
                                    <Package className="mr-2 h-5 w-5" />
                                    Explorar Productos
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div 
                                    key={order.id} 
                                    className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                                >
                                    <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-xl mb-1" style={{ color: '#022f2e' }}>
                                                    Orden #{order.orderNumber}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(order.status)}
                                                <Link href={`/orders/${order.id}`}>
                                                    <Button 
                                                        size="sm" 
                                                        className="h-10 px-5 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105"
                                                        style={{ 
                                                            borderColor: '#10b981',
                                                            color: '#022f2e',
                                                            background: 'white'
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Ver Detalles
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-200">
                                                <p className="text-sm text-gray-600 mb-2 font-medium">Total del Pedido</p>
                                                <p className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                    {formatPrice(order.total)}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CreditCard className="h-4 w-4 text-blue-600" />
                                                    <p className="text-sm text-gray-600 font-medium">Método de Pago</p>
                                                </div>
                                                <p className="font-bold text-lg" style={{ color: '#022f2e' }}>
                                                    {order.paymentMethod || 'No especificado'}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MapPin className="h-4 w-4 text-purple-600" />
                                                    <p className="text-sm text-gray-600 font-medium">Dirección de Envío</p>
                                                </div>
                                                <p className="font-semibold text-sm" style={{ color: '#022f2e' }}>
                                                    {order.shippingAddress.street}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {order.shippingAddress.city}, {order.shippingAddress.state}
                                                </p>
                                            </div>
                                        </div>

                                        {order.notes && (
                                            <div className="mt-6 p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                                                <p className="text-sm text-gray-500 mb-2 font-semibold">Notas del pedido</p>
                                                <p className="text-sm text-gray-700 leading-relaxed">{order.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Spinner size="lg" />
                </main>
                <Footer />
            </div>
        }>
            <OrdersContent />
        </Suspense>
    );
}