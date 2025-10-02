'use client';

import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Eye, Sparkles, Package } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Badge from '../ui/Badge';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        setAdding(true);
        try {
            await addToCart(product.id, 1);
        } catch (error) {
            // Error manejado en el context
        } finally {
            setAdding(false);
        }
    };

    const mainImage = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/300x300?text=Sin+Imagen';

    return (
        <div
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-transparent hover:border-emerald-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            }}
        >
            {/* Image */}
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
                    />

                    {/* Overlay gradient on hover */}
                    <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                            background: 'linear-gradient(180deg, transparent 0%, rgba(2, 47, 46, 0.1) 100%)',
                            opacity: isHovered ? 1 : 0
                        }}
                    />

                    {/* Stock badges */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="px-6 py-3 rounded-xl text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                                Agotado
                            </div>
                        </div>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute top-3 right-3">
                            <div className="px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-bold flex items-center gap-1 animate-pulse" style={{ background: 'rgba(251, 191, 36, 0.9)', borderColor: 'rgba(245, 158, 11, 0.5)', color: '#78350f' }}>
                                <Sparkles className="h-3 w-3" />
                                ¡Solo {product.stock}!
                            </div>
                        </div>
                    )}

                    {/* Quick view badge on hover */}
                    {isHovered && product.stock > 0 && (
                        <div className="absolute top-3 left-3 animate-fade-in">
                            <div className="px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-semibold text-white" style={{ background: 'rgba(2, 47, 46, 0.9)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                Vista rápida
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-5">
                {/* Category */}
                {product.category && (
                    <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 border border-emerald-200" style={{ color: '#022f2e' }}>
                            <Package className="h-3 w-3 mr-1" />
                            {product.category.name}
                        </span>
                    </div>
                )}

                {/* Title */}
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-emerald-600" style={{ color: '#022f2e' }}>
                        {product.name}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                </p>

                {/* Price & Actions */}
                <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Precio</p>
                        <p className="text-2xl font-bold bg-clip-text text-transparent" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link href={`/products/${product.id}`}>
                            <button className="p-2.5 rounded-lg border-2 border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50 transition-all duration-300 hover:scale-110 group/btn">
                                <Eye className="h-5 w-5 text-gray-600 group-hover/btn:text-emerald-600 transition-colors duration-300" />
                            </button>
                        </Link>

                        {product.stock > 0 && (
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="p-2.5 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                style={{ background: adding ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            >
                                {adding ? (
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <ShoppingCart className="h-5 w-5" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* SKU - subtle */}
                <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400 font-mono">SKU: {product.sku}</p>
                </div>
            </div>
        </div>
    );
}