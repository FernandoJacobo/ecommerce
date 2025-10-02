'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils';
import api, { getErrorMessage } from '@/lib/api';
import { Address } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { CreditCard, MapPin, ShoppingBag, Sparkles, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { isAuthenticated, user } = useAuth();
    const { cart, loading: cartLoading, refreshCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [shippingAddress, setShippingAddress] = useState<Address>({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México',
    });

    const [billingAddress, setBillingAddress] = useState<Address>({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México',
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (sameAsShipping) {
            setBillingAddress(shippingAddress);
        }
    }, [sameAsShipping, shippingAddress]);

    if (!isAuthenticated || cartLoading) {
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

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
                <Header />
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-20">
                        <div className="max-w-lg mx-auto text-center">
                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                                <ShoppingBag className="h-16 w-16 text-gray-400" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4" style={{ color: '#022f2e' }}>
                                No hay productos en tu carrito
                            </h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Agrega productos antes de proceder al pago
                            </p>
                            <Button
                                onClick={() => router.push('/products')}
                                className="font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            >
                                Ver Productos
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                shippingAddress,
                billingAddress: sameAsShipping ? shippingAddress : billingAddress,
                paymentMethod,
                notes,
            };

            const response = await api.post('/orders', orderData);
            const orderNumber = response.data.data.order.orderNumber;

            toast.success('¡Orden creada exitosamente!');
            await refreshCart();
            router.push(`/orders?success=true&orderNumber=${orderNumber}`);
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            <Header />

            <main className="flex-1">
                {/* Hero Header */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>

                    <div className="container mx-auto px-4 py-12 relative z-10">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-4">
                                <Shield className="h-4 w-4 text-emerald-300" />
                                <span className="text-sm font-medium text-emerald-100">Compra segura</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Finalizar Compra</h1>
                            <p className="text-gray-300 text-lg">Completa tu información para procesar tu pedido</p>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 -mb-px">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Shipping Address */}
                                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#022f2e' }}>
                                        <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                            <MapPin className="h-6 w-6 text-white" />
                                        </div>
                                        Dirección de Envío
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <Input
                                                label="Calle y Número"
                                                value={shippingAddress.street}
                                                onChange={(e) =>
                                                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                                                }
                                                required
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                            />
                                        </div>
                                        <Input
                                            label="Ciudad"
                                            value={shippingAddress.city}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, city: e.target.value })
                                            }
                                            required
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />
                                        <Input
                                            label="Estado"
                                            value={shippingAddress.state}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, state: e.target.value })
                                            }
                                            required
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />
                                        <Input
                                            label="Código Postal"
                                            value={shippingAddress.zipCode}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                                            }
                                            required
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />
                                        <Input
                                            label="País"
                                            value={shippingAddress.country}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, country: e.target.value })
                                            }
                                            required
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                                            <div className="p-2 rounded-lg mr-3 bg-gradient-to-br from-blue-500 to-blue-600">
                                                <CreditCard className="h-6 w-6 text-white" />
                                            </div>
                                            Dirección de Facturación
                                        </h2>
                                        <label className="flex items-center cursor-pointer px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                            <input
                                                type="checkbox"
                                                checked={sameAsShipping}
                                                onChange={(e) => setSameAsShipping(e.target.checked)}
                                                className="mr-2 w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-emerald-500"
                                                style={{ accentColor: '#10b981' }}
                                            />
                                            <span className="text-sm font-medium" style={{ color: '#022f2e' }}>Igual que envío</span>
                                        </label>
                                    </div>

                                    {!sameAsShipping && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <Input
                                                    label="Calle y Número"
                                                    value={billingAddress.street}
                                                    onChange={(e) =>
                                                        setBillingAddress({ ...billingAddress, street: e.target.value })
                                                    }
                                                    required
                                                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                                />
                                            </div>
                                            <Input
                                                label="Ciudad"
                                                value={billingAddress.city}
                                                onChange={(e) =>
                                                    setBillingAddress({ ...billingAddress, city: e.target.value })
                                                }
                                                required
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                            />
                                            <Input
                                                label="Estado"
                                                value={billingAddress.state}
                                                onChange={(e) =>
                                                    setBillingAddress({ ...billingAddress, state: e.target.value })
                                                }
                                                required
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                            />
                                            <Input
                                                label="Código Postal"
                                                value={billingAddress.zipCode}
                                                onChange={(e) =>
                                                    setBillingAddress({ ...billingAddress, zipCode: e.target.value })
                                                }
                                                required
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                            />
                                            <Input
                                                label="País"
                                                value={billingAddress.country}
                                                onChange={(e) =>
                                                    setBillingAddress({ ...billingAddress, country: e.target.value })
                                                }
                                                required
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Payment & Notes */}
                                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#022f2e' }}>Información Adicional</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-3" style={{ color: '#022f2e' }}>
                                                Método de Pago
                                            </label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 transition-all duration-300"
                                            >
                                                <option value="credit_card">Tarjeta de Crédito</option>
                                                <option value="debit_card">Tarjeta de Débito</option>
                                                <option value="cash">Efectivo</option>
                                                <option value="transfer">Transferencia</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-3" style={{ color: '#022f2e' }}>
                                                Notas del Pedido (Opcional)
                                            </label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 transition-all duration-300 resize-none"
                                                placeholder="Instrucciones especiales de entrega..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg border-2 p-6 sticky top-24" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#022f2e' }}>Resumen del Pedido</h2>

                                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm p-3 rounded-lg bg-gray-50">
                                                <span className="text-gray-700 font-medium flex-1">
                                                    {item.product.name} <span className="text-gray-500">x {item.quantity}</span>
                                                </span>
                                                <span className="font-bold" style={{ color: '#022f2e' }}>
                                                    {formatPrice(item.itemTotal)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t-2 border-gray-100 pt-6 space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">{formatPrice(cart.total)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Envío</span>
                                            <span className="text-emerald-600 font-bold">Gratis</span>
                                        </div>
                                        <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-gray-100">
                                            <span style={{ color: '#022f2e' }}>Total</span>
                                            <span style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                {formatPrice(cart.total)}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-14 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-4"
                                        isLoading={loading}
                                        disabled={loading}
                                        style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                    >
                                        {!loading && <CheckCircle className="mr-2 h-5 w-5" />}
                                        Confirmar Pedido
                                    </Button>

                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                        <Shield className="h-4 w-4 text-emerald-600" />
                                        <span>Compra 100% segura y protegida</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}