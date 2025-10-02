import Link from 'next/link';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShoppingBag, Truck, Shield, HeadphonesIcon, Sparkles, Zap, Award } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 50%, #022f2e 100%)' }}>
            <Header />

            <main className="flex-1">
                {/* Hero Section con gradiente y efectos modernos */}
                <section className="relative overflow-hidden">
                    {/* Efectos de fondo animados */}
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)' }}></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

                    <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
                        <div className="w-full text-center">
                            {/* Badge moderno */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-8 animate-pulse">
                                <Sparkles className="h-4 w-4 text-emerald-300" />
                                <span className="text-sm font-medium text-emerald-100">10% de descuento en tu primera compra</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                <span className="text-white">Tu tienda online</span>
                                <br />
                                <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                    del futuro
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
                                Descubre una nueva forma de comprar. Los mejores productos con tecnología de vanguardia y envíos ultrarrápidos.
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/products">
                                    <Button size="lg" className="font-semibold px-8 py-6 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 20px 60px -15px rgba(16, 185, 129, 0.5)' }}>
                                        <ShoppingBag className="mr-2 h-5 w-5" />
                                        Explorar Productos
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="lg" className="bg-white/10 backdrop-blur-md border-2 border-emerald-400/30 text-white hover:bg-white/20 px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:border-emerald-400/50">
                                        Comenzar Gratis
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Wave separator */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </section>

                {/* Features con glassmorphism */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                ¿Por qué elegirnos?
                            </h2>
                            <p className="text-gray-600 text-lg">La mejor experiencia de compra online</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="group p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-emerald-200" style={{ boxShadow: '0 4px 6px -1px rgba(2, 47, 46, 0.1), 0 2px 4px -1px rgba(2, 47, 46, 0.06)' }}>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #059669 100%)' }}>
                                    <ShoppingBag className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: '#022f2e' }}>Gran Variedad</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Miles de productos disponibles en múltiples categorías para ti
                                </p>
                            </div>

                            <div className="group p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-blue-200" style={{ boxShadow: '0 4px 6px -1px rgba(2, 47, 46, 0.1), 0 2px 4px -1px rgba(2, 47, 46, 0.06)' }}>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                                    <Zap className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: '#022f2e' }}>Envío Ultra Rápido</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Entrega express en 24-48 horas en área metropolitana
                                </p>
                            </div>

                            <div className="group p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-cyan-200" style={{ boxShadow: '0 4px 6px -1px rgba(2, 47, 46, 0.1), 0 2px 4px -1px rgba(2, 47, 46, 0.06)' }}>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: '#022f2e' }}>Súper Seguro</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Protección total de datos con encriptación de última generación
                                </p>
                            </div>

                            <div className="group p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-emerald-200" style={{ boxShadow: '0 4px 6px -1px rgba(2, 47, 46, 0.1), 0 2px 4px -1px rgba(2, 47, 46, 0.06)' }}>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <HeadphonesIcon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: '#022f2e' }}>Soporte 24/7</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Asistencia inmediata cuando lo necesites, siempre disponible
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats con diseño moderno */}
                <section className="py-20" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)' }}>
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-emerald-200">
                                <div className="text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>10K+</div>
                                <div className="text-gray-600 font-medium">Productos</div>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
                                <div className="text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>50K+</div>
                                <div className="text-gray-600 font-medium">Clientes Felices</div>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-cyan-200">
                                <div className="text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>100K+</div>
                                <div className="text-gray-600 font-medium">Órdenes Entregadas</div>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-emerald-200">
                                <div className="text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>4.8/5</div>
                                <div className="text-gray-600 font-medium">Calificación</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section mejorado */}
                <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 50%, #10b981 100%)' }}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 mb-6">
                            <Award className="h-5 w-5 text-emerald-200" />
                            <span className="text-sm font-semibold text-white">Oferta especial por tiempo limitado</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            ¿Listo para la mejor experiencia?
                        </h2>
                        <p className="text-xl mb-10 text-emerald-100 max-w-2xl mx-auto">
                            Únete a miles de clientes satisfechos y obtén un <span className="font-bold text-emerald-300">10% de descuento</span> en tu primera compra
                        </p>
                        <Link href="/register">
                            <Button size="lg" className="bg-white font-bold px-10 py-6 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300" style={{ color: '#022f2e', boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.25)' }}>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Crear mi cuenta gratis
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}