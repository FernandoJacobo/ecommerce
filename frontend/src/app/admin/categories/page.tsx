'use client';

import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { Category } from '@/types';
import {
    FolderOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Package,
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ data: { categories: Category[] } }>('/categories');
            setCategories(response.data.data.categories);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, formData);
                toast.success('Categoría actualizada exitosamente');
            } else {
                await api.post('/categories', formData);
                toast.success('Categoría creada exitosamente');
            }

            handleCloseModal();
            loadCategories();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return;

        setDeletingId(id);
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Categoría eliminada exitosamente');
            loadCategories();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setDeletingId(null);
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: '#022f2e' }}>
                        Gestión de Categorías
                    </h1>
                    <p className="text-gray-600 text-lg">Organiza tus productos por categorías</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="mt-4 md:mt-0 h-12 px-6 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Categoría
                </Button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar categorías por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-purple-400"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                        <FolderOpen className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#022f2e' }}>
                        {search ? 'No se encontraron categorías' : 'No hay categorías'}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                        {search ? 'Intenta con otro término de búsqueda' : 'Comienza creando tu primera categoría para organizar productos'}
                    </p>
                    {!search && (
                        <Button
                            onClick={() => handleOpenModal()}
                            className="font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Crear Categoría
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                                    <FolderOpen className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(category)}
                                        className="p-2.5 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-300 hover:scale-110"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        disabled={deletingId === category.id}
                                        className="p-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                    >
                                        {deletingId === category.id ? (
                                            <Spinner size="sm" />
                                        ) : (
                                            <Trash2 className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2" style={{ color: '#022f2e' }}>
                                {category.name}
                            </h3>

                            {category.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                    {category.description}
                                </p>
                            )}

                            <div className="flex items-center gap-2 pt-4 border-t-2 border-gray-100">
                                <div className="p-1.5 rounded-lg bg-purple-100">
                                    <Package className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="text-sm font-bold" style={{ color: '#022f2e' }}>
                                    {category.productCount || 0} producto{category.productCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseModal} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                            <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                                    </h2>
                                    <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#022f2e' }}>
                                            Nombre de la Categoría *
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="Ej: Electrónica, Ropa, Hogar..."
                                            className="h-12 rounded-xl border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: '#022f2e' }}>
                                            Descripción (Opcional)
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            placeholder="Describe brevemente esta categoría..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors resize-none"
                                        />
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
                                        style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                                    >
                                        {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
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