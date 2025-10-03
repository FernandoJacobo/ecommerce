'use client';

import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { Quotation } from '@/types';
import { FileText, Search, Eye, X, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusConfig = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    APPROVED: { label: 'Aprobada', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-700', icon: XCircle },
    EXPIRED: { label: 'Expirada', color: 'bg-gray-100 text-gray-700', icon: AlertTriangle },
};

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        loadQuotations();
    }, []);

    const loadQuotations = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ data: { quotations: Quotation[] } }>('/quotations', {
                params: { limit: 100 },
            });
            setQuotations(response.data.data.quotations);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleViewQuotation = async (quotationId: string) => {
        try {
            const response = await api.get<{ data: { quotation: Quotation } }>(`/quotations/${quotationId}`);
            setSelectedQuotation(response.data.data.quotation);
            setShowModal(true);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleUpdateStatus = async (status: Quotation['status']) => {
        if (!selectedQuotation) return;

        setUpdatingStatus(true);
        try {
            await api.put(`/quotations/${selectedQuotation.id}/status`, { status });
            toast.success('Estado actualizado exitosamente');
            setShowModal(false);
            loadQuotations();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setUpdatingStatus(false);
        }
    };

    const filteredQuotations = quotations.filter((quotation) => {
        const matchesSearch = quotation.quotationNumber.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || quotation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#022f2e' }}>Gestión de Cotizaciones</h1>
                <p className="text-gray-600 text-lg">Administra las solicitudes de cotización</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input type="text" placeholder="Buscar por número de cotización..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:outline-none">
                        <option value="">Todos los estados</option>
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Object.entries(statusConfig).map(([status, config]) => {
                    const count = quotations.filter((q) => q.status === status).length;
                    return (
                        <div key={status} className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
                                <config.icon className="h-4 w-4" />
                                {count}
                            </div>
                            <p className="text-xs text-gray-600 mt-2">{config.label}</p>
                        </div>
                    );
                })}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
            ) : filteredQuotations.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#022f2e' }}>No hay cotizaciones</h3>
                    <p className="text-gray-600">No se encontraron cotizaciones con los filtros aplicados</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                                <tr>
                                    <th className="text-left p-4 text-white font-bold">Cotización</th>
                                    <th className="text-left p-4 text-white font-bold">Fecha</th>
                                    <th className="text-left p-4 text-white font-bold">Total</th>
                                    <th className="text-left p-4 text-white font-bold">Válida Hasta</th>
                                    <th className="text-left p-4 text-white font-bold">Estado</th>
                                    <th className="text-left p-4 text-white font-bold">Items</th>
                                    <th className="text-left p-4 text-white font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuotations.map((quotation, index) => {
                                    const StatusIcon = statusConfig[quotation.status].icon;
                                    const isExpired = new Date(quotation.validUntil) < new Date();
                                    return (
                                        <tr key={quotation.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                            <td className="p-4"><div className="font-semibold" style={{ color: '#022f2e' }}>{quotation.quotationNumber}</div></td>
                                            <td className="p-4 text-gray-600">{new Date(quotation.createdAt).toLocaleDateString('es-MX')}</td>
                                            <td className="p-4"><span className="font-bold text-cyan-600">{formatPrice(quotation.total)}</span></td>
                                            <td className="p-4"><span className={`text-sm ${isExpired ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>{new Date(quotation.validUntil).toLocaleDateString('es-MX')}</span></td>
                                            <td className="p-4"><span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig[quotation.status].color}`}><StatusIcon className="h-4 w-4" />{statusConfig[quotation.status].label}</span></td>
                                            <td className="p-4 text-gray-600">{quotation.itemCount || 0}</td>
                                            <td className="p-4"><button onClick={() => handleViewQuotation(quotation.id)} className="p-2 rounded-lg bg-cyan-100 text-cyan-600 hover:bg-cyan-200 transition-all duration-300 hover:scale-110"><Eye className="h-4 w-4" /></button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && selectedQuotation && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Cotización {selectedQuotation.quotationNumber}</h2>
                                        <p className="text-cyan-100 text-sm mt-1">Válida hasta: {new Date(selectedQuotation.validUntil).toLocaleDateString('es-MX')}</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200"><X className="h-6 w-6" /></button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-3" style={{ color: '#022f2e' }}>Actualizar Estado</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {Object.entries(statusConfig).map(([status, config]) => {
                                            const StatusIcon = config.icon;
                                            return (
                                                <button key={status} onClick={() => handleUpdateStatus(status as Quotation['status'])} disabled={updatingStatus} className={`p-3 rounded-xl border-2 transition-all ${selectedQuotation.status === status ? `${config.color} border-current` : 'border-gray-200 hover:border-cyan-300'}`}>
                                                    <StatusIcon className="h-5 w-5 mx-auto mb-1" />
                                                    <span className="text-xs font-semibold">{config.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-3" style={{ color: '#022f2e' }}>Productos</h3>
                                    <div className="space-y-3">
                                        {selectedQuotation.items?.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                                <img src={item.product.images[0] || '/placeholder.png'} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                                                <div className="flex-1">
                                                    <p className="font-semibold" style={{ color: '#022f2e' }}>{item.product.name}</p>
                                                    <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-700">x{item.quantity}</p>
                                                    <p className="text-sm font-bold text-cyan-600">{formatPrice(item.subtotal)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedQuotation.notes && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-3" style={{ color: '#022f2e' }}>Notas del Admin</h3>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200"><p className="text-sm text-gray-700">{selectedQuotation.notes}</p></div>
                                    </div>
                                )}

                                {selectedQuotation.customerNotes && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-3" style={{ color: '#022f2e' }}>Notas del Cliente</h3>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200"><p className="text-sm text-gray-700">{selectedQuotation.customerNotes}</p></div>
                                    </div>
                                )}

                                <div className="pt-4 border-t-2 border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold" style={{ color: '#022f2e' }}>Total</span>
                                        <span className="text-2xl font-bold text-cyan-600">{formatPrice(selectedQuotation.total)}</span>
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