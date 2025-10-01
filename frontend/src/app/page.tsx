import Link from 'next/link';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShoppingBag, Truck, Shield, HeadphonesIcon } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                    <div className="container mx-auto px-4 py-20">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Tu tienda online favorita
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-primary-100">
                                Encuentra los mejores productos con la mejor calidad y precios increíbles
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/products">
                                    <Button size="lg" variant="secondary">
                                        Ver Productos
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                                        Crear Cuenta
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                                    <ShoppingBag className="h-8 w-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Gran Variedad</h3>
                                <p className="text-gray-600">
                                    Miles de productos disponibles en múltiples categorías
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <Truck className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
                                <p className="text-gray-600">
                                    Entrega en 24-48 horas en área metropolitana
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                                    <Shield className="h-8 w-8 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
                                <p className="text-gray-600">
                                    Tus datos están protegidos con la mejor tecnología
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                                    <HeadphonesIcon className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
                                <p className="text-gray-600">
                                    Nuestro equipo está listo para ayudarte
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-primary-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            ¿Listo para empezar?
                        </h2>
                        <p className="text-xl mb-8 text-primary-100">
                            Regístrate ahora y obtén un 10% de descuento en tu primera compra
                        </p>
                        <Link href="/register">
                            <Button size="lg" variant="secondary">
                                Crear mi cuenta gratis
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
                                <div className="text-gray-600">Productos</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
                                <div className="text-gray-600">Clientes Felices</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary-600 mb-2">100K+</div>
                                <div className="text-gray-600">Órdenes Entregadas</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary-600 mb-2">4.8/5</div>
                                <div className="text-gray-600">Calificación</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}