'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api, { getErrorMessage } from '@/lib/api';
import { Product, Category, PaginatedResponse } from '@/types';
import { Search, Filter, X, Sparkles, TrendingUp, ArrowUpDown } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ProductCard from '@/components/product/ProductCard';
import toast from 'react-hot-toast';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Cargar categorías
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await api.get<{ data: { categories: Category[] } }>('/categories');
                setCategories(response.data.data.categories);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };
        loadCategories();
    }, []);

    // Cargar productos
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const params: Record<string, any> = {
                    page,
                    limit: 12,
                    sortBy,
                    sortOrder,
                    isActive: true,
                };

                if (search) params.search = search;
                if (selectedCategory) params.categoryId = selectedCategory;

                const response = await api.get<{ data: PaginatedResponse<Product> }>('/products', {
                    params,
                });

                setProducts(response.data.data.products);
                setTotalPages(response.data.data.pagination.totalPages);
            } catch (error) {
                const message = getErrorMessage(error);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [page, search, selectedCategory, sortBy, sortOrder]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSortBy('createdAt');
        setSortOrder('DESC');
        setPage(1);
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
                                <TrendingUp className="h-4 w-4 text-emerald-300" />
                                <span className="text-sm font-medium text-emerald-100">Productos destacados</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                                Descubre Nuestra Colección
                            </h1>
                            <p className="text-xl text-gray-300">
                                Encuentra productos de calidad con los mejores precios
                            </p>
                        </div>
                    </div>

                    {/* Wave separator */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f9fafb"/>
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar - Filtros Desktop */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="rounded-2xl shadow-lg p-6 sticky top-24 border-2" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg text-white font-bold flex items-center">
                                        <Filter className="h-5 w-5 mr-2 text-emerald-400" />
                                        Filtros
                                    </h2>
                                    {(search || selectedCategory) && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                </div>

                                {/* Búsqueda */}
                                <form onSubmit={handleSearch} className="mb-6">
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="Buscar productos..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="mb-3 bg-white/10 border-emerald-400/30 text-white placeholder-gray-400 focus:bg-white/15 focus:border-emerald-400"
                                        />
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => setSearch('')}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <Button type="submit" size="sm" className="w-full font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                        <Search className="h-4 w-4 mr-2" />
                                        Buscar
                                    </Button>
                                </form>

                                {/* Categorías */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 text-white flex items-center">
                                        <Sparkles className="h-4 w-4 mr-2 text-emerald-400" />
                                        Categorías
                                    </h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('');
                                                setPage(1);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-300 font-medium
                                                ${selectedCategory === ''
                                                    ? 'bg-white text-gray-900 shadow-lg scale-105'
                                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            Todas las categorías
                                        </button>
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    setSelectedCategory(category.id);
                                                    setPage(1);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-300
                                                    ${selectedCategory === category.id
                                                        ? 'bg-white text-gray-900 font-medium shadow-lg scale-105'
                                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                <span className="flex items-center justify-between">
                                                    <span>{category.name}</span>
                                                    {category.productCount !== undefined && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                                            {category.productCount}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ordenar */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-white flex items-center">
                                        <ArrowUpDown className="h-4 w-4 mr-2 text-emerald-400" />
                                        Ordenar por
                                    </h3>
                                    <select
                                        value={`${sortBy}-${sortOrder}`}
                                        onChange={(e) => {
                                            const [newSortBy, newSortOrder] = e.target.value.split('-');
                                            setSortBy(newSortBy);
                                            setSortOrder(newSortOrder as 'ASC' | 'DESC');
                                            setPage(1);
                                        }}
                                        className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 bg-white/10 border border-emerald-400/30 text-white cursor-pointer"
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        <option className='bg-gray-900 text-white' value="createdAt-DESC">Más recientes</option>
                                        <option className='bg-gray-900 text-white' value="createdAt-ASC">Más antiguos</option>
                                        <option className='bg-gray-900 text-white' value="price-ASC">Precio: menor a mayor</option>
                                        <option className='bg-gray-900 text-white' value="price-DESC">Precio: mayor a menor</option>
                                        <option className='bg-gray-900 text-white' value="name-ASC">Nombre: A-Z</option>
                                        <option className='bg-gray-900 text-white' value="name-DESC">Nombre: Z-A</option>
                                    </select>
                                </div>
                            </div>
                        </aside>

                        {/* Mobile Filter Button */}
                        <div className="lg:hidden fixed bottom-6 right-6 z-40">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="p-4 rounded-full shadow-2xl font-semibold text-white flex items-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            >
                                <Filter className="h-5 w-5" />
                                <span>Filtros</span>
                            </button>
                        </div>

                        {/* Mobile Filters Overlay */}
                        {showFilters && (
                            <>
                                <div
                                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                                    onClick={() => setShowFilters(false)}
                                />
                                <div className="lg:hidden fixed inset-x-0 bottom-0 rounded-t-3xl shadow-2xl p-6 z-50 max-h-[80vh] overflow-y-auto" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl text-white font-bold flex items-center">
                                            <Filter className="h-6 w-6 mr-2 text-emerald-400" />
                                            Filtros
                                        </h2>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Mobile filters content (same as desktop) */}
                                    <form onSubmit={handleSearch} className="mb-6">
                                        <Input
                                            type="text"
                                            placeholder="Buscar productos..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="mb-3 bg-white/10 border-emerald-400/30 text-white placeholder-gray-400"
                                        />
                                        <Button type="submit" size="sm" className="w-full font-semibold text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                            <Search className="h-4 w-4 mr-2" />
                                            Buscar
                                        </Button>
                                    </form>

                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-3 text-white">Categorías</h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory('');
                                                    setPage(1);
                                                    setShowFilters(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-300
                                                    ${selectedCategory === '' ? 'bg-white text-gray-900 font-medium' : 'bg-white/5 text-gray-300'}`}
                                            >
                                                Todas las categorías
                                            </button>
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    onClick={() => {
                                                        setSelectedCategory(category.id);
                                                        setPage(1);
                                                        setShowFilters(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-300
                                                        ${selectedCategory === category.id ? 'bg-white text-gray-900 font-medium' : 'bg-white/5 text-gray-300'}`}
                                                >
                                                    {category.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-3 text-white">Ordenar por</h3>
                                        <select
                                            value={`${sortBy}-${sortOrder}`}
                                            onChange={(e) => {
                                                const [newSortBy, newSortOrder] = e.target.value.split('-');
                                                setSortBy(newSortBy);
                                                setSortOrder(newSortOrder as 'ASC' | 'DESC');
                                                setPage(1);
                                            }}
                                            className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-emerald-400/30 text-white"
                                        >
                                            <option className='bg-gray-900' value="createdAt-DESC">Más recientes</option>
                                            <option className='bg-gray-900' value="createdAt-ASC">Más antiguos</option>
                                            <option className='bg-gray-900' value="price-ASC">Precio: menor a mayor</option>
                                            <option className='bg-gray-900' value="price-DESC">Precio: mayor a menor</option>
                                            <option className='bg-gray-900' value="name-ASC">Nombre: A-Z</option>
                                            <option className='bg-gray-900' value="name-DESC">Nombre: Z-A</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Spinner size="lg" />
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-20 px-4">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                                        <Search className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-lg mb-2">No se encontraron productos</p>
                                    <p className="text-gray-400 text-sm">Intenta ajustar tus filtros de búsqueda</p>
                                </div>
                            ) : (
                                <>
                                    {/* Results info */}
                                    <div className="mb-6 p-4 rounded-xl bg-white">
                                        <p className="font-semibold" style={{ color: '#022f2e' }}>
                                            Mostrando {products.length} productos
                                            {search && (
                                                <span className="ml-2 px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700">
                                                    "{search}"
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Products Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-12 flex justify-center">
                                            <nav className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                    disabled={page === 1}
                                                    className="font-medium"
                                                >
                                                    Anterior
                                                </Button>

                                                <div className="flex gap-2">
                                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (page <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (page >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = page - 2 + i;
                                                        }
                                                        
                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                size="sm"
                                                                onClick={() => setPage(pageNum)}
                                                                className={`font-medium min-w-[40px] transition-all duration-300 ${
                                                                    page === pageNum 
                                                                        ? 'text-white shadow-lg scale-105' 
                                                                        : 'bg-white hover:bg-gray-50'
                                                                }`}
                                                                style={page === pageNum ? { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' } : {}}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                                    disabled={page === totalPages}
                                                    className="font-medium"
                                                >
                                                    Siguiente
                                                </Button>
                                            </nav>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}