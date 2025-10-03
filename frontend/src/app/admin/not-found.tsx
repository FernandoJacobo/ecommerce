import Link from "next/link";
import { Home, Search, Package, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            <main className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="text-center max-w-2xl">
                    {/* 404 Number */}
                    <div className="mb-8">
                        <h1 className="text-9xl md:text-[12rem] font-bold leading-none" style={{
                            background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            404
                        </h1>
                    </div>

                    {/* Icon */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mx-auto" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                            <Search className="h-16 w-16 text-gray-400" />
                        </div>
                    </div>

                    {/* Message */}
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#022f2e' }}>
                        Página no encontrada
                    </h2>
                    <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                        Lo sentimos, la página que buscas no existe o ha sido movida.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/admin">
                            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                <Home className="h-5 w-5" />
                                Volver al Inicio
                            </button>
                        </Link>
                        <Link href="/admin/products">
                            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border-2 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 bg-white hover:bg-gray-50" style={{
                                borderColor: '#10b981',
                                color: '#022f2e'
                            }}>
                                <Package className="h-5 w-5" />
                                Ver Productos
                            </button>
                        </Link>
                    </div>

                    {/* Suggestions */}
                    <div className="mt-16 p-6 rounded-2xl bg-white shadow-lg border-2 border-gray-100">
                        <h3 className="text-lg font-bold mb-4" style={{ color: '#022f2e' }}>
                            ¿Qué puedes hacer?
                        </h3>
                        <ul className="space-y-3 text-left">
                            <li className="flex items-start gap-3">
                                <div className="p-1 rounded-lg mt-0.5" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <ArrowLeft className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-gray-700">Usa el botón de retroceso de tu navegador</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="p-1 rounded-lg mt-0.5" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-gray-700">Busca el producto que necesitas en nuestra tienda</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="p-1 rounded-lg mt-0.5" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Home className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-gray-700">Regresa al inicio y navega desde allí</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}