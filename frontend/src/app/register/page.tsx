'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, User, ArrowRight, Sparkles, Package, Shield, Zap } from 'lucide-react';

export default function RegisterPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es requerido';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo electrónico inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });
        } catch (error) {
            // El error ya se maneja en el AuthContext con toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-8">
                        <Sparkles className="h-4 w-4 text-emerald-300" />
                        <span className="text-sm font-medium text-emerald-100">¡Únete a nuestra comunidad!</span>
                    </div>

                    <h3 className="text-4xl font-bold text-white mb-6 max-w-md">
                        Comienza tu experiencia de compra
                    </h3>
                    
                    <p className="text-xl text-gray-300 mb-12 max-w-md leading-relaxed">
                        Regístrate ahora y obtén acceso a beneficios exclusivos
                    </p>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 gap-4 max-w-md w-full">
                        <div className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-emerald-400/20 text-left transition-all duration-300 hover:bg-white/10 hover:scale-105">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">10% de descuento</h4>
                                    <p className="text-sm text-gray-400">En tu primera compra</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-emerald-400/20 text-left transition-all duration-300 hover:bg-white/10 hover:scale-105">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Envío gratis</h4>
                                    <p className="text-sm text-gray-400">En compras mayores a $500</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-emerald-400/20 text-left transition-all duration-300 hover:bg-white/10 hover:scale-105">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Compra segura</h4>
                                    <p className="text-sm text-gray-400">Protección en cada transacción</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}></div>
            </div>

            {/* Right Side - Form */}
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
                            Crear tu cuenta
                        </h2>
                        <p className="text-gray-600">
                            Completa tus datos para comenzar
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                        Nombre
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            placeholder="Juan"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            error={errors.firstName}
                                            required
                                            className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                        Apellido
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            placeholder="Pérez"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            error={errors.lastName}
                                            required
                                            className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        required
                                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={errors.password}
                                        required
                                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2" style={{ color: '#022f2e' }}>
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        error={errors.confirmPassword}
                                        required
                                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 mt-1 rounded border-gray-300 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                style={{ accentColor: '#10b981' }}
                            />
                            <label htmlFor="terms" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                                Acepto los{' '}
                                <Link href="/terms" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                    términos y condiciones
                                </Link>
                                {' '}y la{' '}
                                <Link href="/privacy" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                    política de privacidad
                                </Link>
                            </label>
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
                                    Crear mi cuenta
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
                            <span className="px-4 bg-white text-gray-500 font-medium">¿Ya tienes cuenta?</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link href="/login">
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="w-full h-12 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105"
                            style={{ 
                                borderColor: '#10b981',
                                color: '#022f2e'
                            }}
                        >
                            Iniciar sesión
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
        </div>
    );
}