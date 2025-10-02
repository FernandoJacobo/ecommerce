'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, ArrowRight, Sparkles, Package } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login({ email, password });
        } catch (error) {
            // El error ya se maneja en el AuthContext con toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold" style={{ color: '#022f2e' }}>E-commerce</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-3" style={{ color: '#022f2e' }}>
                            Bienvenido de vuelta
                        </h2>
                        <p className="text-gray-600">
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                    style={{ accentColor: '#10b981' }}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                    Recordarme
                                </label>
                            </div>

                            <Link href="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-300">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-12 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            isLoading={loading}
                            disabled={loading}
                        >
                            {!loading && (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">¿No tienes cuenta?</span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <Link href="/register">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full h-12 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105"
                            style={{
                                borderColor: '#10b981',
                                color: '#022f2e'
                            }}
                        >
                            <Sparkles className="mr-2 h-5 w-5 text-emerald-500" />
                            Crear cuenta nueva
                        </Button>
                    </Link>

                    {/* Back to Home */}
                    <div className="text-center pt-4">
                        <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300 inline-flex items-center">
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-8">
                        <Sparkles className="h-4 w-4 text-emerald-300" />
                        <span className="text-sm font-medium text-emerald-100">Compra con confianza</span>
                    </div>

                    <h3 className="text-4xl font-bold text-white mb-6 max-w-md">
                        Tu tienda online favorita
                    </h3>

                    <p className="text-xl text-gray-300 mb-8 max-w-md leading-relaxed">
                        Accede a miles de productos, ofertas exclusivas y envíos rápidos
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-1 gap-4 max-w-md w-full">
                        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-emerald-400/20 text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Gran variedad</h4>
                                    <p className="text-sm text-gray-400">Miles de productos disponibles</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-emerald-400/20 text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Ofertas exclusivas</h4>
                                    <p className="text-sm text-gray-400">Descuentos para miembros</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}></div>
            </div>
        </div>
    );
}