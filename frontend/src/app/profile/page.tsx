'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api, { getErrorMessage } from '@/lib/api';
import { User as UserIcon, Mail, Lock, Save, Package, ShoppingCart, LayoutDashboard, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || !user) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) return;

        setLoading(true);

        try {
            await api.put(`/users/${user.id}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            });

            toast.success('Perfil actualizado exitosamente. Por favor, vuelve a iniciar sesión para ver los cambios.');
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
            toast.error('La contraseña debe contener mayúsculas, minúsculas y números');
            return;
        }

        setPasswordLoading(true);

        try {
            await api.put(`/users/${user.id}`, {
                password: passwordData.newPassword,
            });

            toast.success('Contraseña actualizada exitosamente');

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message);
        } finally {
            setPasswordLoading(false);
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
                                <UserIcon className="h-4 w-4 text-emerald-300" />
                                <span className="text-sm font-medium text-emerald-100">Configuración personal</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mi Perfil</h1>
                            <p className="text-gray-300 text-lg">Gestiona tu información personal y configuraciones</p>
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
                        {/* User Info Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg border-2 p-8 text-center" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <UserIcon className="h-14 w-14 text-white" />
                                </div>

                                <h2 className="text-2xl font-bold mb-2" style={{ color: '#022f2e' }}>
                                    {user.firstName} {user.lastName}
                                </h2>

                                <p className="text-gray-600 mb-4 break-all">{user.email}</p>

                                <div className="inline-block px-4 py-2 rounded-xl text-sm font-bold" style={{
                                    background: user.role === 'ADMIN' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white'
                                }}>
                                    {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                                </div>

                                <div className="mt-6 pt-6 border-t-2 border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Miembro desde</p>
                                    <p className="font-bold" style={{ color: '#022f2e' }}>
                                        {new Date(user.createdAt).toLocaleDateString('es-MX', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mt-6 overflow-hidden">
                                <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                    <h3 className="font-bold text-lg" style={{ color: '#022f2e' }}>Accesos Rápidos</h3>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2">
                                        <Link
                                            href="/orders"
                                            className="flex items-center px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
                                        >
                                            <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                                <Package className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="font-semibold" style={{ color: '#022f2e' }}>Mis Órdenes</span>
                                        </Link>
                                        <Link
                                            href="/cart"
                                            className="flex items-center px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                                        >
                                            <div className="p-2 rounded-lg mr-3 bg-gradient-to-br from-blue-500 to-blue-600">
                                                <ShoppingCart className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="font-semibold" style={{ color: '#022f2e' }}>Mi Carrito</span>
                                        </Link>
                                        {user.role === 'ADMIN' && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center px-4 py-3 rounded-xl hover:bg-purple-50 transition-all duration-300 hover:scale-105"
                                            >
                                                <div className="p-2 rounded-lg mr-3 bg-gradient-to-br from-purple-500 to-purple-600">
                                                    <LayoutDashboard className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="font-semibold" style={{ color: '#022f2e' }}>Dashboard Admin</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Info Form */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                                <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                    <h2 className="text-2xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                                        <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                            <UserIcon className="h-6 w-6 text-white" />
                                        </div>
                                        Información Personal
                                    </h2>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Nombre"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                placeholder="Tu nombre"
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                            />

                                            <Input
                                                label="Apellido"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                placeholder="Tu apellido"
                                                className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                            />
                                        </div>

                                        <Input
                                            label="Correo Electrónico"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            helperText="Este correo se usa para iniciar sesión"
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />

                                        <div className="flex items-start gap-3 p-4 rounded-xl border-2" style={{ background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                                            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-amber-900 mb-1">Nota importante</p>
                                                <p className="text-sm text-amber-800">
                                                    Después de actualizar tu información, es recomendable cerrar sesión y volver a iniciar para ver los cambios reflejados.
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full md:w-auto h-12 px-8 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                            isLoading={loading}
                                            disabled={loading}
                                            style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                        >
                                            {!loading && <Save className="h-5 w-5 mr-2" />}
                                            Guardar Cambios
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* Change Password Form */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                                <div className="p-6 border-b-2 border-gray-100" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                                    <h2 className="text-2xl font-bold flex items-center" style={{ color: '#022f2e' }}>
                                        <div className="p-2 rounded-lg mr-3 bg-gradient-to-br from-blue-500 to-blue-600">
                                            <Lock className="h-6 w-6 text-white" />
                                        </div>
                                        Cambiar Contraseña
                                    </h2>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        <Input
                                            label="Contraseña Actual"
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Tu contraseña actual"
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />

                                        <Input
                                            label="Nueva Contraseña"
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Mínimo 8 caracteres"
                                            helperText="Debe incluir mayúsculas, minúsculas y números"
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />

                                        <Input
                                            label="Confirmar Nueva Contraseña"
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Repite tu nueva contraseña"
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full md:w-auto h-12 px-8 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                            isLoading={passwordLoading}
                                            disabled={passwordLoading}
                                            style={{ background: passwordLoading ? '#6b7280' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                                        >
                                            {!passwordLoading && <Lock className="h-5 w-5 mr-2" />}
                                            Actualizar Contraseña
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 overflow-hidden" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                                <div className="p-6 border-b-2" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                    <h2 className="text-2xl font-bold text-red-600 flex items-center">
                                        <Shield className="h-6 w-6 mr-3" />
                                        Zona de Peligro
                                    </h2>
                                </div>
                                <div className="p-8">
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                                                toast.error('Esta funcionalidad requiere confirmación adicional por seguridad.');
                                            }
                                        }}
                                        className="h-12 px-8 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                                    >
                                        <AlertTriangle className="h-5 w-5 mr-2" />
                                        Eliminar Mi Cuenta
                                    </Button>
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