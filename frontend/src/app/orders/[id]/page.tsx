'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api, { getErrorMessage } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, MapPin, CreditCard, Package, X, Sparkles, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        loadOrder();
    }, [isAuthenticated, params.id]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ data: { order: Order } }>(`/orders/${params.id}`);
            setOrder(response.data.data.order);
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
            router.push('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de cancelar esta orden?')) {
            return;
        }

        setCancelling(true);
        try {
            await api.patch(`/orders/${params.id}/cancel`);
            toast.success('Orden cancelada exitosamente');
            loadOrder();
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
        } finally {
            setCancelling(false);
        }
    };

    const getStatusBadge = (status: Order['status']) => {
        const statusConfig: Record<Order['status'], { variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; label: string; icon: any; color: string }> = {
            PENDING: { variant: 'warning', label: 'Pendiente', icon: Clock, color: '#f59e0b' },
            CONFIRMED: { variant: 'info', label: 'Confirmada', icon: CheckCircle2, color: '#3b82f6' },
            PROCESSING: { variant: 'info', label: 'Procesando', icon: Package, color: '#06b6d4' },
            SHIPPED: { variant: 'info', label: 'Enviada', icon: Truck, color: '#8b5cf6' },
            DELIVERED: { variant: 'success', label: 'Entregada', icon: CheckCircle2, color: '#10b981' },
            CANCELLED: { variant: 'danger', label: 'Cancelada', icon: XCircle, color: '#ef4444' },
        };

        const config = statusConfig[status];
        const Icon = config.icon;
        
        return (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border-2" style={{ 
                backgroundColor: `${config.color}15`,
                borderColor: `${config.color}40`,
                color: config.color
            }}>
                <Icon className="h-5 w-5" />
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

    if (!order) {
        return null;
    }

    const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            <Header />

            <main className="flex-1">
                {/* Hero Header */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    <div className="container mx-auto px-4 py-12 relative z-10">
                        <Link href="/orders">
                            <button className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                                <ArrowLeft className="h-4 w-4" />
                                Volver a mis órdenes
                            </button>
                        </Link>

                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-3">
                                    <Sparkles className="h-4 w-4 text-emerald-300" />
                                    <span className="text-sm font-medium text-emerald-100">Orden #{order.orderNumber}</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    Detalle de tu orden
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    Realizada el {formatDate(order.createdAt)}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {getStatusBadge(order.status)}
                                {canCancel && (
                                    <Button
                                        size="sm"
                                        onClick={handleCancel}
                                        isLoading={cancelling}
                                        disabled={cancelling}
                                        className="h-11 px-5 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
                                        style={{ background: cancelling ? '#6b7280' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                                    >
                                        {!cancelling && <X className="h-4 w-4 mr-2" />}
                                        Cancelar Orden
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 -mb-px">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Products */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                                <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                    <h2 className="text-xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                                        <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                            <Package className="h-5 w-5 text-white" />
                                        </div>
                                        Productos ({order.itemCount})
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors duration-300">
                                            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                                                <img
                                                    src={item.product.images[0] || 'https://via.placeholder.com/80'}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg mb-1" style={{ color: '#022f2e' }}>{item.product.name}</h3>
                                                <p className="text-sm text-gray-500 font-mono mb-2">SKU: {item.product.sku}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-gray-100 border border-gray-200" style={{ color: '#022f2e' }}>
                                                        Cantidad: {item.quantity}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg font-bold mb-1" style={{ color: '#022f2e' }}>{formatPrice(item.price)}</p>
                                                <p className="text-sm text-gray-500 font-medium">
                                                    Subtotal: <span className="text-emerald-600 font-bold">{formatPrice(item.subtotal)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                                <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                    <h2 className="text-xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                                        <div className="p-2 rounded-lg mr-3 bg-gradient-to-br from-blue-500 to-blue-600">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                        Dirección de Envío
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <address className="not-italic text-gray-700 space-y-1 text-lg">
                                        <p className="font-semibold" style={{ color: '#022f2e' }}>{order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                        <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
                                    </address>
                                </div>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                        <h2 className="text-xl font-bold" style={{ color: '#022f2e' }}>Notas del Pedido</h2>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-700 leading-relaxed">{order.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6 sticky top-24">
                                {/* Summary */}
                                <div className="bg-white rounded-2xl shadow-lg border-2 p-6" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#022f2e' }}>Resumen</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">{formatPrice(order.total)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Envío</span>
                                            <span className="text-emerald-600 font-semibold">Gratis</span>
                                        </div>
                                        <div className="border-t-2 border-gray-100 pt-4 flex justify-between text-xl font-bold">
                                            <span style={{ color: '#022f2e' }}>Total</span>
                                            <span style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                        <h2 className="text-xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                                            <div className="p-2 rounded-lg mr-3 bg-gradient-to-br from-purple-500 to-purple-600">
                                                <CreditCard className="h-5 w-5 text-white" />
                                            </div>
                                            Información de Pago
                                        </h2>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Método de pago</p>
                                            <p className="font-bold text-lg" style={{ color: '#022f2e' }}>
                                                {order.paymentMethod || 'No especificado'}
                                            </p>
                                        </div>
                                        {order.paymentStatus && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Estado del pago</p>
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                    <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}