'use client';

import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { Product, Category, PaginatedResponse } from '@/types';
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Image as ImageIcon,
    Eye,
    EyeOff
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
        categoryId: '',
        images: [] as string[],
        isActive: true,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [page, search]);

    const loadCategories = async () => {
        try {
            const response = await api.get<{ data: { categories: Category[] } }>('/categories');
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'DESC',
            };

            if (search) params.search = search;

            const response = await api.get<{ data: PaginatedResponse<Product> }>('/products', { params });
            setProducts(response.data.data.products);
            setTotalPages(response.data.data.pagination.totalPages);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                stock: product.stock.toString(),
                sku: product.sku,
                categoryId: product.categoryId,
                images: product.images,
                isActive: product.isActive,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                sku: '',
                categoryId: '',
                images: [],
                isActive: true,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                sku: formData.sku,
                categoryId: formData.categoryId,
                images: formData.images,
                isActive: formData.isActive,
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, data);
                toast.success('Producto actualizado exitosamente');
            } else {
                await api.post('/products', data);
                toast.success('Producto creado exitosamente');
            }

            handleCloseModal();
            loadProducts();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        setDeletingId(id);
        try {
            await api.delete(`/products/${id}`);
            toast.success('Producto eliminado exitosamente');
            loadProducts();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleActive = async (product: Product) => {
        try {
            await api.put(`/products/${product.id}`, {
                ...product,
                isActive: !product.isActive,
            });
            toast.success(`Producto ${!product.isActive ? 'activado' : 'desactivado'}`);
            loadProducts();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const addImageUrl = () => {
        const url = prompt('Ingresa la URL de la imagen:');
        if (url) {
            setFormData({ ...formData, images: [...formData.images, url] });
        }
    };

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: '#022f2e' }}>
                        Gestión de Productos
                    </h1>
                    <p className="text-gray-600 text-lg">Administra el catálogo de productos</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="mt-4 md:mt-0 h-12 px-6 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Producto
                </Button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar productos por nombre o SKU..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400"
                    />
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                        <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#022f2e' }}>
                        No hay productos
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">Comienza agregando tu primer producto al catálogo</p>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Crear Producto
                    </Button>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                                    <tr>
                                        <th className="text-left p-4 text-white font-bold">Imagen</th>
                                        <th className="text-left p-4 text-white font-bold">Producto</th>
                                        <th className="text-left p-4 text-white font-bold">Categoría</th>
                                        <th className="text-left p-4 text-white font-bold">Precio</th>
                                        <th className="text-left p-4 text-white font-bold">Stock</th>
                                        <th className="text-left p-4 text-white font-bold">Estado</th>
                                        <th className="text-left p-4 text-white font-bold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr
                                            key={product.id}
                                            className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                }`}
                                        >
                                            <td className="p-4">
                                                {product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                                                        <ImageIcon className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-base" style={{ color: '#022f2e' }}>
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-500 font-mono">SKU: {product.sku}</div>
                                            </td>
                                            <td className="p-4 text-gray-700 font-medium">{product.categoryName}</td>
                                            <td className="p-4">
                                                <span className="font-bold text-lg text-emerald-600">
                                                    ${product.price}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold ${product.stock > 10
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : product.stock > 0
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleToggleActive(product)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 ${product.isActive
                                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {product.isActive ? (
                                                        <span className="flex items-center gap-1.5">
                                                            <Eye className="h-4 w-4" />
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5">
                                                            <EyeOff className="h-4 w-4" />
                                                            Inactivo
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(product)}
                                                        className="p-2.5 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-300 hover:scale-110"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={deletingId === product.id}
                                                        className="p-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                                    >
                                                        {deletingId === product.id ? (
                                                            <Spinner size="sm" />
                                                        ) : (
                                                            <Trash2 className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="font-medium"
                                >
                                    Anterior
                                </Button>
                                <span className="px-6 py-2 rounded-lg font-bold" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)', color: '#022f2e' }}>
                                    Página {page} de {totalPages}
                                </span>
                                <Button
                                    variant="outline"
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

            {/* Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseModal} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                                    </h2>
                                    <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#022f2e' }}>
                                            Nombre del Producto *
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="h-12 rounded-xl border-2"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#022f2e' }}>
                                            Descripción *
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#022f2e' }}>
                                            Precio *
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            className="h-12 rounded-xl border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#022f2e' }}>
                                            Stock *
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                            className="h-12 rounded-xl border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#022f2e' }}>
                                            SKU *
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            required
                                            className="h-12 rounded-xl border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#022f2e' }}>
                                            Categoría *
                                        </label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            required
                                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:outline-none transition-colors"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                style={{ accentColor: '#10b981' }}
                                            />
                                            <span className="text-sm font-bold" style={{ color: '#022f2e' }}>
                                                Producto activo y visible en la tienda
                                            </span>
                                        </label>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold mb-3" style={{ color: '#022f2e' }}>
                                            Imágenes del Producto
                                        </label>
                                        <div className="space-y-3">
                                            {formData.images.map((img, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border-2 border-gray-200">
                                                    <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border-2 border-gray-300" />
                                                    <Input type="text" value={img} readOnly className="flex-1" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addImageUrl}
                                                className="w-full h-12 rounded-xl border-2 border-dashed hover:border-emerald-400"
                                            >
                                                <Plus className="h-5 w-5 mr-2" />
                                                Agregar URL de Imagen
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCloseModal}
                                        className="flex-1 h-12 rounded-xl font-semibold"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300"
                                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                    >
                                        {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}