import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Target, Users, Award, Heart, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>

                    <div className="container mx-auto px-4 py-20 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-6">
                            <Heart className="h-4 w-4 text-emerald-300" />
                            <span className="text-sm font-medium text-emerald-100">Nuestra historia</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Sobre Nosotros
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Una empresa comprometida con ofrecer los mejores productos y el mejor servicio a nuestros clientes
                        </p>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 -mb-px">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white" />
                        </svg>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg border-2 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                <div className="p-3 rounded-xl inline-block mb-6" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Target className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4" style={{ color: '#022f2e' }}>Nuestra Misión</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Proporcionar a nuestros clientes productos de la más alta calidad al mejor precio, con un servicio excepcional que supere sus expectativas en cada compra.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border-2 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                                <div className="p-3 rounded-xl inline-block mb-6 bg-gradient-to-br from-blue-500 to-blue-600">
                                    <Award className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4" style={{ color: '#022f2e' }}>Nuestra Visión</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Ser la tienda en línea líder en México, reconocida por nuestra excelencia en servicio al cliente, variedad de productos y compromiso con la satisfacción del cliente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#022f2e' }}>
                            Nuestros Valores
                        </h2>
                        <p className="text-center text-gray-600 mb-12 text-lg">Los principios que guían nuestro trabajo</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                                    <Heart className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="font-bold text-xl mb-3" style={{ color: '#022f2e' }}>Compromiso</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Dedicados a la satisfacción total de nuestros clientes
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Award className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="font-bold text-xl mb-3" style={{ color: '#022f2e' }}>Calidad</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Solo ofrecemos productos de la más alta calidad
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110 bg-gradient-to-br from-purple-500 to-purple-600">
                                    <Users className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="font-bold text-xl mb-3" style={{ color: '#022f2e' }}>Servicio</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Atención personalizada y soporte constante
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110 bg-gradient-to-br from-orange-500 to-orange-600">
                                    <Zap className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="font-bold text-xl mb-3" style={{ color: '#022f2e' }}>Innovación</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Siempre buscando nuevas formas de mejorar
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#022f2e' }}>
                            Nuestros Números
                        </h2>
                        <p className="text-center text-gray-600 mb-12 text-lg">El respaldo de nuestra experiencia</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <p className="text-5xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5+</p>
                                <p className="text-gray-600 font-semibold">Años de Experiencia</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <p className="text-5xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>50K+</p>
                                <p className="text-gray-600 font-semibold">Clientes Felices</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <p className="text-5xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10K+</p>
                                <p className="text-gray-600 font-semibold">Productos</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <p className="text-5xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4.8/5</p>
                                <p className="text-gray-600 font-semibold">Calificación</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#022f2e' }}>
                            Nuestro Equipo
                        </h2>
                        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
                            Un equipo apasionado y dedicado trabajando para ofrecerte la mejor experiencia de compra
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[
                                { name: 'Fernando García', role: 'CEO & Fundador', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                                { name: 'María López', role: 'Directora de Operaciones', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
                                { name: 'Carlos Méndez', role: 'Gerente de Tecnología', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
                            ].map((member, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                    <div className="p-8 text-center">
                                        <div className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold" style={{ background: member.gradient }}>
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <h3 className="font-bold text-xl mb-2" style={{ color: '#022f2e' }}>{member.name}</h3>
                                        <p className="text-gray-600 font-medium">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>

                    <div className="container mx-auto px-4 py-20 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-6">
                            <Sparkles className="h-4 w-4 text-emerald-300" />
                            <span className="text-sm font-medium text-emerald-100">Únete a nosotros</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            ¿Listo para empezar?
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Únete a miles de clientes satisfechos y disfruta de una experiencia de compra única
                        </p>

                        <Link href="/register">
                            <button className="px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                <TrendingUp className="inline-block mr-2 h-6 w-6" />
                                Crear Cuenta Gratis
                            </button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}