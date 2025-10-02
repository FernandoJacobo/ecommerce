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
import { CreditCard, MapPin, ShoppingBag } from 'lucide-react';
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
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 bg-gray-50">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-md mx-auto text-center">
                            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                No hay productos en tu carrito
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Agrega productos antes de proceder al pago
                            </p>
                            <Button variant="primary" onClick={() => router.push('/products')}>
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
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Shipping Address */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <MapPin className="h-5 w-5 mr-2" />
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
                                            />
                                        </div>
                                        <Input
                                            label="Ciudad"
                                            value={shippingAddress.city}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, city: e.target.value })
                                            }
                                            required
                                        />
                                        <Input
                                            label="Estado"
                                            value={shippingAddress.state}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, state: e.target.value })
                                            }
                                            required
                                        />
                                        <Input
                                            label="Código Postal"
                                            value={shippingAddress.zipCode}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                                            }
                                            required
                                        />
                                        <Input
                                            label="País"
                                            value={shippingAddress.country}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, country: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold flex items-center">
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            Dirección de Facturación
                                        </h2>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={sameAsShipping}
                                                onChange={(e) => setSameAsShipping(e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm">Igual que envío</span>
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
                                                />
                                            </div>
                                            <Input
                                                label="Ciudad"
                                                value={billingAddress.city}
                                                onChange={(e) =>
                                                    setBillingAddress({ ...billingAddress, city: e.target.value })
                                                }
                                                required
                                            />
                                            <Input
                                                label="Estado"
                                                value={billingAddress.state}
                                                onChange={(e) =>
                                                    setBillingAddress({ ...billingAddress, state: e.target.value })
                                                }
                                                required
                                            />
                                            <Input
                                                label="Código Postal"
                                                value={billingAddress.zipCode}
                                                onChange={(e) =>
                                                    setBillingAddress({ ...billingAddress, zipCode: e.target.value })
                                                }
                                                required
                                            />
                                            <Input
                                                label="País"
                                                value={billingAddress.country}
                                                onChange={(e) =>
                                                    setBillingAddress({ ...billingAddress, country: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Payment & Notes */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold mb-4">Información Adicional</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Método de Pago
                                            </label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            >
                                                <option value="credit_card">Tarjeta de Crédito</option>
                                                <option value="debit_card">Tarjeta de Débito</option>
                                                <option value="cash">Efectivo</option>
                                                <option value="transfer">Transferencia</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Notas del Pedido (Opcional)
                                            </label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Instrucciones especiales de entrega..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                                    <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

                                    <div className="space-y-3 mb-6">
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    {item.product.name} x {item.quantity}
                                                </span>
                                                <span className="font-medium">
                                                    {formatPrice(item.itemTotal)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 space-y-2 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(cart.total)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Envío</span>
                                            <span>Gratis</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary-600">
                                                {formatPrice(cart.total)}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        isLoading={loading}
                                    >
                                        Confirmar Pedido
                                    </Button>
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