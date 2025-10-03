'use client';

import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { Order } from '@/types';
import {
    ShoppingBag,
    Search,
    Eye,
    X,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusConfig = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: Clock, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    CONFIRMED: { label: 'Confirmada', color: 'bg-blue-100 text-blue-700', icon: CheckCircle, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    PROCESSING: { label: 'Procesando', color: 'bg-purple-100 text-purple-700', icon: Package, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
    SHIPPED: { label: 'Enviada', color: 'bg-indigo-100 text-indigo-700', icon: Truck, gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
    DELIVERED: { label: 'Entregada', color: 'bg-green-100 text-green-700', icon: CheckCircle, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    CANCELLED: { label: 'Cancelada', color: 'bg-red-100 text-red-700', icon: XCircle, gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ data: { orders: Order[] } }>('/orders', {
                params: { limit: 100 },
            });
            setOrders(response.data.data.orders);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = async (orderId: string) => {
        try {
            const response = await api.get<{ data: { order: Order } }>(`/orders/${orderId}`);
            setSelectedOrder(response.data.data.order);
            setShowModal(true);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleUpdateStatus = async (status: Order['status']) => {
        if (!selectedOrder) return;

        setUpdatingStatus(true);
        try {
            await api.put(`/orders/${selectedOrder.id}/status`, { status });
            toast.success('Estado actualizado exitosamente');
            setShowModal(false);
            loadOrders();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setUpdatingStatus(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#022f2e' }}>
                    Gestión de Órdenes
                </h1>
                <p className="text-gray-600 text-lg">Administra las órdenes de compra</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por número de orden..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-orange-400"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors"
                    >
                        <option value="">Todos los estados</option>
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>
                                {config.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {Object.entries(statusConfig).map(([status, config]) => {
                    const count = orders.filter((o) => o.status === status).length;
                    const StatusIcon = config.icon;
                    return (
                        <div key={status} className="bg-white rounded-2xl shadow-lg p-4 border-2 border-gray-100 hover:scale-105 transition-transform duration-300">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${config.color}`}>
                                <StatusIcon className="h-4 w-4" />
                                {count}
                            </div>
                            <p className="text-xs font-semibold text-gray-600 mt-2">{config.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Orders Table */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#022f2e' }}>
                        No hay órdenes
                    </h3>
                    <p className="text-gray-600 text-lg">No se encontraron órdenes con los filtros aplicados</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                                <tr>
                                    <th className="text-left p-4 text-white font-bold">Orden</th>
                                    <th className="text-left p-4 text-white font-bold">Fecha</th>
                                    <th className="text-left p-4 text-white font-bold">Total</th>
                                    <th className="text-left p-4 text-white font-bold">Estado</th>
                                    <th className="text-left p-4 text-white font-bold">Items</th>
                                    <th className="text-left p-4 text-white font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, index) => {
                                    const StatusIcon = statusConfig[order.status].icon;
                                    return (
                                        <tr
                                            key={order.id}
                                            className={`border-b border-gray-100 hover:bg-orange-50 transition-colors ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                        >
                                            <td className="p-4">
                                                <div className="font-bold" style={{ color: '#022f2e' }}>
                                                    {order.orderNumber}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('es-MX')}
                                            </td>
                                            <td className="p-4">
                                                <span className="font-bold text-lg text-orange-600">
                                                    {formatPrice(order.total)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${statusConfig[order.status].color}`}>
                                                    <StatusIcon className="h-4 w-4" />
                                                    {statusConfig[order.status].label}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold text-sm">
                                                    {order.itemCount || 0}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleViewOrder(order.id)}
                                                    className="p-2.5 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all duration-300 hover:scale-110"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Orden #{selectedOrder.orderNumber}</h2>
                                        <p className="text-emerald-200 text-sm mt-1">
                                            {new Date(selectedOrder.createdAt).toLocaleString('es-MX')}
                                        </p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status Update */}
                                <div>
                                    <label className="block text-sm font-bold mb-3" style={{ color: '#022f2e' }}>
                                        Actualizar Estado de la Orden
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {Object.entries(statusConfig).map(([status, config]) => {
                                            const StatusIcon = config.icon;
                                            const isSelected = selectedOrder.status === status;
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => handleUpdateStatus(status as Order['status'])}
                                                    disabled={updatingStatus}
                                                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                                                        isSelected
                                                            ? `${config.color} border-current shadow-lg`
                                                            : 'border-gray-200 hover:border-orange-300 bg-white'
                                                    }`}
                                                >
                                                    <StatusIcon className="h-6 w-6 mx-auto mb-2" />
                                                    <span className="text-xs font-bold block">{config.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4" style={{ color: '#022f2e' }}>Productos de la Orden</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-orange-200 transition-colors">
                                                <img
                                                    src={item.product.images[0] || '/placeholder.png'}
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-xl border-2 border-gray-300"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-bold text-base" style={{ color: '#022f2e' }}>{item.product.name}</p>
                                                    <p className="text-sm text-gray-500 font-mono">SKU: {item.product.sku}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-700 mb-1">x{item.quantity}</p>
                                                    <p className="text-base font-bold text-orange-600">{formatPrice(item.subtotal)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Addresses */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold mb-3" style={{ color: '#022f2e' }}>Dirección de Envío</h3>
                                        <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                                            <p className="text-sm font-semibold text-gray-800 leading-relaxed">{selectedOrder.shippingAddress.street}</p>
                                            <p className="text-sm text-gray-700">
                                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-3" style={{ color: '#022f2e' }}>Dirección de Facturación</h3>
                                        <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                                            <p className="text-sm font-semibold text-gray-800 leading-relaxed">{selectedOrder.billingAddress.street}</p>
                                            <p className="text-sm text-gray-700">
                                                {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {selectedOrder.billingAddress.zipCode}, {selectedOrder.billingAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-3" style={{ color: '#022f2e' }}>Notas del Cliente</h3>
                                        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200">
                                            <p className="text-sm text-gray-800 leading-relaxed">{selectedOrder.notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="pt-6 border-t-2 border-gray-200">
                                    <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                        <span className="text-2xl font-bold" style={{ color: '#022f2e' }}>Total de la Orden</span>
                                        <span className="text-3xl font-bold text-orange-600">
                                            {formatPrice(selectedOrder.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}