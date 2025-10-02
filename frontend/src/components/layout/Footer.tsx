import Link from 'next/link';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
            {/* Patrón de fondo decorativo */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Section - Más destacada */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">E-commerce</span>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Tu tienda online de confianza. Encuentra los mejores productos con la mejor calidad y precios increíbles.
                        </p>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <h4 className="text-white font-semibold mb-3">Suscríbete a nuestro newsletter</h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-emerald-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all duration-300"
                                />
                                <button className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <ArrowRight className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Enlaces Rápidos
                            <span className="absolute bottom-0 left-0 w-12 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center group">
                                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center group">
                                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Categorías
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center group">
                                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center group">
                                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Soporte
                            <span className="absolute bottom-0 left-0 w-12 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center group">
                                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center group">
                                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Envíos
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center group">
                                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center group">
                                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Términos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact con cards */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Contacto
                            <span className="absolute bottom-0 left-0 w-12 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}></span>
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="mailto:contacto@ecommerce.com" className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group">
                                    <div className="p-2 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-all duration-300">
                                        <Mail className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">contacto@ecommerce.com</span>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+523312345678" className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group">
                                    <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-all duration-300">
                                        <Phone className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">+52 33 1234 5678</span>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                                    <div className="p-2 rounded-lg bg-cyan-500/20">
                                        <MapPin className="h-4 w-4 text-cyan-400" />
                                    </div>
                                    <span className="text-sm text-gray-300">Guadalajara, Jalisco, México</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Media & Copyright */}
                <div className="border-t border-emerald-800/30 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm font-medium">Síguenos:</span>
                            <div className="flex gap-3">
                                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-transparent hover:border-emerald-400/30 transition-all duration-300 group">

                                </a>
                                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-transparent hover:border-blue-400/30 transition-all duration-300 group">

                                </a>
                                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-pink-500/20 border border-transparent hover:border-pink-400/30 transition-all duration-300 group">

                                </a>
                                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-transparent hover:border-cyan-400/30 transition-all duration-300 group">

                                </a>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-gray-400 text-sm text-center md:text-right">
                            <p>
                                &copy; {currentYear} <span className="font-semibold text-emerald-400">E-commerce</span>. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}