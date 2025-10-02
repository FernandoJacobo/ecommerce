'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api, { getErrorMessage } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Minus, Plus, Package, CheckCircle, XCircle, ArrowLeft, Sparkles, Shield, Truck, Award } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadProduct();
    }, [params.id]);

    const loadProduct = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ data: { product: Product } }>(`/products/${params.id}`);
            setProduct(response.data.data.product);
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
            router.push('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!product) return;

        setAdding(true);
        try {
            await addToCart(product.id, quantity);
            setQuantity(1);
        } catch (error) {
            // Error manejado en el context
        } finally {
            setAdding(false);
        }
    };

    const incrementQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

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

    if (!product) {
        return null;
    }

    const inStock = product.stock > 0;
    const lowStock = product.stock > 0 && product.stock < 10;

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            <Header />

            <main className="flex-1">
                {/* Hero Header */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    <div className="container mx-auto px-4 py-8 relative z-10">
                        <Link href="/products">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                                <ArrowLeft className="h-4 w-4" />
                                Volver a Productos
                            </button>
                        </Link>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 -mb-px">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Images Section */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden p-6">
                                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                                    <img
                                        src={product.images[selectedImage] || 'https://via.placeholder.com/600x600?text=Sin+Imagen'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-xl overflow-hidden border-3 transition-all duration-300 hover:scale-105 ${
                                                selectedImage === index
                                                    ? 'border-emerald-500 shadow-lg'
                                                    : 'border-gray-200 hover:border-emerald-300'
                                            }`}
                                            style={{ borderWidth: '3px' }}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Category */}
                            {product.category && (
                                <Link href={`/products?categoryId=${product.category.id}`}>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-all duration-300 hover:scale-105 cursor-pointer" style={{ 
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        borderColor: 'rgba(16, 185, 129, 0.3)',
                                        color: '#022f2e'
                                    }}>
                                        <Package className="h-4 w-4" />
                                        {product.category.name}
                                    </div>
                                </Link>
                            )}

                            {/* Title */}
                            <div>
                                <h1 className="text-4xl font-bold mb-3" style={{ color: '#022f2e' }}>
                                    {product.name}
                                </h1>
                                <p className="text-sm text-gray-500 font-mono">SKU: {product.sku}</p>
                            </div>

                            {/* Price */}
                            <div className="p-6 rounded-2xl border-2" style={{ 
                                background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
                                borderColor: 'rgba(16, 185, 129, 0.2)'
                            }}>
                                <p className="text-sm text-gray-600 mb-2">Precio</p>
                                <p className="text-5xl font-bold" style={{ 
                                    background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', 
                                    WebkitBackgroundClip: 'text', 
                                    WebkitTextFillColor: 'transparent' 
                                }}>
                                    {formatPrice(product.price)}
                                </p>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-3 p-4 rounded-xl border-2" style={{
                                backgroundColor: inStock ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                                borderColor: inStock ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                            }}>
                                {inStock ? (
                                    <>
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                                        <span className="font-bold text-emerald-700">
                                            En stock ({product.stock} disponibles)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-6 w-6 text-red-600" />
                                        <span className="font-bold text-red-700">
                                            Agotado
                                        </span>
                                    </>
                                )}
                            </div>

                            {lowStock && (
                                <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-md border-2 animate-pulse" style={{ 
                                    background: 'rgba(251, 191, 36, 0.15)',
                                    borderColor: 'rgba(245, 158, 11, 0.3)'
                                }}>
                                    <Sparkles className="h-5 w-5 text-amber-600" />
                                    <p className="text-amber-800 font-bold">
                                        ¡Solo quedan {product.stock} unidades!
                                    </p>
                                </div>
                            )}

                            {/* Description */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                                <h2 className="text-xl font-bold mb-4" style={{ color: '#022f2e' }}>Descripción</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity Selector & Add to Cart */}
                            {inStock && (
                                <div className="bg-white rounded-2xl shadow-lg border-2 p-6" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                    <div className="space-y-6">
                                        {/* Quantity */}
                                        <div>
                                            <label className="block text-sm font-bold mb-3" style={{ color: '#022f2e' }}>
                                                Cantidad
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={decrementQuantity}
                                                    disabled={quantity <= 1}
                                                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
                                                >
                                                    <Minus className="h-5 w-5" />
                                                </button>

                                                <span className="text-3xl font-bold w-20 text-center" style={{ color: '#022f2e' }}>
                                                    {quantity}
                                                </span>

                                                <button
                                                    onClick={incrementQuantity}
                                                    disabled={quantity >= product.stock}
                                                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>

                                                <span className="text-gray-600 font-medium">
                                                    de {product.stock} disponibles
                                                </span>
                                            </div>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                                            <span className="text-lg text-gray-600 font-semibold">Subtotal:</span>
                                            <span className="text-3xl font-bold" style={{ 
                                                background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', 
                                                WebkitBackgroundClip: 'text', 
                                                WebkitTextFillColor: 'transparent' 
                                            }}>
                                                {formatPrice(product.price * quantity)}
                                            </span>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <Button
                                            size="lg"
                                            className="w-full h-14 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                            onClick={handleAddToCart}
                                            isLoading={adding}
                                            disabled={adding}
                                            style={{ background: adding ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                        >
                                            {!adding && <ShoppingCart className="h-5 w-5 mr-2" />}
                                            Agregar al Carrito
                                        </Button>

                                        {!isAuthenticated && (
                                            <p className="text-sm text-gray-600 text-center">
                                                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                                                    Inicia sesión
                                                </Link>{' '}
                                                para agregar al carrito
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Product Features */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                                <h3 className="text-xl font-bold mb-6" style={{ color: '#022f2e' }}>Beneficios de tu compra</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                        <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                            <Truck className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1" style={{ color: '#022f2e' }}>Envío Rápido</p>
                                            <p className="text-sm text-gray-600">
                                                Entrega en 24-48 horas en área metropolitana
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                            <Award className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1" style={{ color: '#022f2e' }}>Garantía de Calidad</p>
                                            <p className="text-sm text-gray-600">
                                                Productos verificados y con garantía del fabricante
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-50 border border-purple-200">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                                            <Shield className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1" style={{ color: '#022f2e' }}>Compra Segura</p>
                                            <p className="text-sm text-gray-600">
                                                Pago 100% seguro con encriptación SSL
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    <div className="mt-16 p-8 rounded-2xl bg-white shadow-lg border-2 border-gray-100">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: '#022f2e' }}>Productos Relacionados</h2>
                        <p className="text-gray-600 text-lg">
                            Explora más productos de la categoría{' '}
                            {product.category && (
                                <Link
                                    href={`/products?categoryId=${product.category.id}`}
                                    className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                                >
                                    {product.category.name}
                                </Link>
                            )}
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}