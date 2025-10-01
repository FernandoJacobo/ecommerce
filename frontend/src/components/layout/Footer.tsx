import Link from 'next/link';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Package className="h-8 w-8 text-primary-500" />
                            <span className="text-xl font-bold text-white">E-commerce</span>
                        </div>
                        <p className="text-sm">
                            Tu tienda online de confianza. Encuentra los mejores productos al mejor precio.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="hover:text-primary-400 transition-colors">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="hover:text-primary-400 transition-colors">
                                    Categorías
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary-400 transition-colors">
                                    Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Atención al Cliente</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/faq" className="hover:text-primary-400 transition-colors">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="hover:text-primary-400 transition-colors">
                                    Envíos
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="hover:text-primary-400 transition-colors">
                                    Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary-400 transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm">contacto@ecommerce.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span className="text-sm">+52 33 1234 5678</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">Guadalajara, Jalisco, México</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {currentYear} E-commerce. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}