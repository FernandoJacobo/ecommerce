'use client';

import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '@/lib/api';
import { User } from '@/types';
import { Users as UsersIcon, Search, Shield, User as UserIcon, Edit, Trash2, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'USER' as 'USER' | 'ADMIN',
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ data: { users: User[] } }>('/users');
            setUsers(response.data.data.users);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            });
        } else {
            setEditingUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                role: 'USER',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingUser) {
                await api.put(`/users/${editingUser.id}`, formData);
                toast.success('Usuario actualizado exitosamente');
            }
            handleCloseModal();
            loadUsers();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        setDeletingId(id);
        try {
            await api.delete(`/users/${id}`);
            toast.success('Usuario eliminado exitosamente');
            loadUsers();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setDeletingId(null);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const userCount = users.filter((u) => u.role === 'USER').length;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#022f2e' }}>
                    Gestión de Usuarios
                </h1>
                <p className="text-gray-600 text-lg">Administra los usuarios del sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Administradores</p>
                            <p className="text-3xl font-bold" style={{ color: '#022f2e' }}>{adminCount}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}>
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Usuarios</p>
                            <p className="text-3xl font-bold" style={{ color: '#022f2e' }}>{userCount}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                            <UserIcon className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                    >
                        <option value="">Todos los roles</option>
                        <option value="ADMIN">Administradores</option>
                        <option value="USER">Usuarios</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100">
                    <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#022f2e' }}>
                        No hay usuarios
                    </h3>
                    <p className="text-gray-600">No se encontraron usuarios con los filtros aplicados</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}>
                                <tr>
                                    <th className="text-left p-4 text-white font-bold">Avatar</th>
                                    <th className="text-left p-4 text-white font-bold">Nombre</th>
                                    <th className="text-left p-4 text-white font-bold">Email</th>
                                    <th className="text-left p-4 text-white font-bold">Rol</th>
                                    <th className="text-left p-4 text-white font-bold">Fecha Registro</th>
                                    <th className="text-left p-4 text-white font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                    >
                                        <td className="p-4">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                                style={{
                                                    background:
                                                        user.role === 'ADMIN'
                                                            ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                                                            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                }}
                                            >
                                                {user.firstName.charAt(0)}
                                                {user.lastName.charAt(0)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold" style={{ color: '#022f2e' }}>
                                                {user.firstName} {user.lastName}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{user.email}</td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'ADMIN'
                                                        ? 'bg-pink-100 text-pink-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}
                                            >
                                                {user.role === 'ADMIN' ? (
                                                    <>
                                                        <Shield className="h-4 w-4" />
                                                        Administrador
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserIcon className="h-4 w-4" />
                                                        Usuario
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(user.createdAt).toLocaleDateString('es-MX')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-300 hover:scale-110"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={deletingId === user.id}
                                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                                >
                                                    {deletingId === user.id ? (
                                                        <Spinner size="sm" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
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
            )}

            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseModal} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                            <div
                                className="p-6 border-b-2 border-gray-100"
                                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">Editar Usuario</h2>
                                    <button onClick={handleCloseModal} className="text-white hover:text-gray-300">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                                Nombre *
                                            </label>
                                            <Input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                                Apellido *
                                            </label>
                                            <Input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                            Email *
                                        </label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                            Rol *
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' })}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                                        >
                                            <option value="USER">Usuario</option>
                                            <option value="ADMIN">Administrador</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 font-semibold text-white"
                                        style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}
                                    >
                                        Actualizar
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