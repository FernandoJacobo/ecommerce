'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api, { getErrorMessage } from '@/lib/api';
import { Category } from '@/types';
import { FolderOpen, Package, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ data: { categories: Category[] } }>('/categories');
            setCategories(response.data.data.categories);
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
                {/* Hero Section */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    <div className="container mx-auto px-4 py-16 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-6">
                                <FolderOpen className="h-4 w-4 text-emerald-300" />
                                <span className="text-sm font-medium text-emerald-100">Organizado para ti</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                                Explora por Categorías
                            </h1>
                            <p className="text-xl text-gray-300">
                                Encuentra fácilmente lo que buscas navegando por nuestras categorías
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 -mb-px">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="container mx-auto px-4 py-12">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spinner size="lg" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="max-w-lg mx-auto text-center py-16">
                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                                <FolderOpen className="h-16 w-16 text-gray-400" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4" style={{ color: '#022f2e' }}>
                                No hay categorías disponibles
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Vuelve más tarde para ver nuestras categorías organizadas
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 p-4 rounded-xl bg-white shadow-sm border-2 border-emerald-100">
                                <h2 className="text-2xl font-bold" style={{ color: '#022f2e' }}>
                                    Todas las Categorías ({categories.length})
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/products?categoryId=${category.id}`}
                                    >
                                        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-transparent hover:border-emerald-200 h-full hover:scale-105">
                                            <div className="p-6">
                                                {/* Icon */}
                                                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                                    <Package className="h-8 w-8 text-white" />
                                                </div>

                                                {/* Name */}
                                                <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 transition-colors duration-300" style={{ color: '#022f2e' }}>
                                                    {category.name}
                                                </h3>

                                                {/* Description */}
                                                {category.description && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                        {category.description}
                                                    </p>
                                                )}

                                                {/* Product Count */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-3xl font-bold" style={{ 
                                                            background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', 
                                                            WebkitBackgroundClip: 'text', 
                                                            WebkitTextFillColor: 'transparent' 
                                                        }}>
                                                            {category.productCount || 0}
                                                        </span>
                                                        <span className="text-sm text-gray-600 font-medium">
                                                            {category.productCount === 1 ? 'Producto' : 'Productos'}
                                                        </span>
                                                    </div>
                                                    <ArrowRight className="h-5 w-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* CTA Section */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    <div className="container mx-auto px-4 py-16 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-6">
                            <Sparkles className="h-4 w-4 text-emerald-300" />
                            <span className="text-sm font-medium text-emerald-100">¿Necesitas ayuda?</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                            ¿No encuentras lo que buscas?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Explora todos nuestros productos o contáctanos para ayudarte a encontrar lo que necesitas
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/products">
                                <button className="px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Package className="inline-block mr-2 h-5 w-5" />
                                    Ver Todos los Productos
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                    Contáctanos
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}