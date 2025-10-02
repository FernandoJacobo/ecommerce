'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Truck, RotateCcw, Sparkles, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';

export default function CartPage() {
    const { isAuthenticated } = useAuth();
    const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

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
                                Tu carrito está vacío
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                Explora nuestra colección y agrega productos increíbles a tu carrito
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
                    </div>
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
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Mi Carrito</h1>
                                <p className="text-gray-300">Revisa tus productos antes de finalizar</p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30">
                                <Sparkles className="h-4 w-4 text-emerald-300" />
                                <span className="text-sm font-medium text-emerald-100">{cart.itemCount} producto{cart.itemCount !== 1 ? 's' : ''}</span>
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
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                    <h2 className="font-bold text-lg" style={{ color: '#022f2e' }}>
                                        Productos en tu carrito
                                    </h2>
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Estás seguro de limpiar el carrito?')) {
                                                clearCart();
                                            }
                                        }}
                                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Limpiar carrito
                                    </button>
                                </div>

                                {/* Items */}
                                <div className="divide-y divide-gray-100">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors duration-300">
                                            {/* Image */}
                                            <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                                <img
                                                    src={item.product.images[0] || 'https://via.placeholder.com/100'}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg mb-2" style={{ color: '#022f2e' }}>
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-3 font-mono">
                                                    SKU: {item.product.sku}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                        {formatPrice(item.product.price)}
                                                    </p>
                                                    {item.product.stock < 10 && (
                                                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                                            Solo {item.product.stock} disponibles
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex flex-col items-end justify-between">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-110"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        disabled={item.quantity <= 1}
                                                        className="p-2 rounded-lg border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>

                                                    <span className="w-12 text-center font-bold text-lg" style={{ color: '#022f2e' }}>
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.product.stock}
                                                        className="p-2 rounded-lg border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                                                    <p className="text-lg font-bold" style={{ color: '#022f2e' }}>
                                                        {formatPrice(item.itemTotal)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg border-2 p-6 sticky top-24" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                <h2 className="text-2xl font-bold mb-6" style={{ color: '#022f2e' }}>
                                    Resumen del Pedido
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cart.itemCount} productos)</span>
                                        <span className="font-semibold">{formatPrice(cart.total)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span className="text-emerald-600 font-semibold">Gratis</span>
                                    </div>
                                    <div className="border-t-2 border-gray-100 pt-4 flex justify-between text-xl font-bold">
                                        <span style={{ color: '#022f2e' }}>Total</span>
                                        <span style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            {formatPrice(cart.total)}
                                        </span>
                                    </div>
                                </div>

                                <Link href="/checkout">
                                    <Button 
                                        size="lg" 
                                        className="w-full mb-3 h-14 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                    >
                                        Proceder al Pago
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </Button>
                                </Link>

                                <Link href="/products">
                                    <Button 
                                        variant="outline" 
                                        size="lg" 
                                        className="w-full h-12 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105"
                                        style={{ borderColor: '#10b981', color: '#022f2e' }}
                                    >
                                        Continuar Comprando
                                    </Button>
                                </Link>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t-2 border-gray-100">
                                    <h3 className="font-bold mb-4 text-sm" style={{ color: '#022f2e' }}>Beneficios de tu compra</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                            <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                                <Truck className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: '#022f2e' }}>Envío gratis</p>
                                                <p className="text-xs text-gray-600">En pedidos mayores a $500</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                                <Shield className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: '#022f2e' }}>Pago seguro</p>
                                                <p className="text-xs text-gray-600">100% protegido</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600">
                                                <RotateCcw className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: '#022f2e' }}>Devoluciones</p>
                                                <p className="text-xs text-gray-600">Hasta 30 días</p>
                                            </div>
                                        </div>
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