'use client';

import { useState, FormEvent } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send, Clock, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            toast.error('Error al enviar el mensaje. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #034442 100%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>

                    <div className="container mx-auto px-4 py-16 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 mb-6">
                            <MessageCircle className="h-4 w-4 text-emerald-300" />
                            <span className="text-sm font-medium text-emerald-100">Estamos aquí para ti</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Contáctanos</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
                        </p>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 -mb-px">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold mb-6" style={{ color: '#022f2e' }}>Información de Contacto</h2>

                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                        <Mail className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2" style={{ color: '#022f2e' }}>Email</h3>
                                        <p className="text-gray-600 font-medium">contacto@ecommerce.com</p>
                                        <p className="text-gray-600 font-medium">soporte@ecommerce.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
                                        <Phone className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2" style={{ color: '#022f2e' }}>Teléfono</h3>
                                        <p className="text-gray-600 font-medium">+52 33 1234 5678</p>
                                        <p className="text-gray-600 font-medium">+52 33 8765 4321</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-600">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2" style={{ color: '#022f2e' }}>Dirección</h3>
                                        <p className="text-gray-600 font-medium leading-relaxed">
                                            Av. Revolución 1234<br />
                                            Col. Centro<br />
                                            Guadalajara, Jalisco<br />
                                            C.P. 44100, México
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-500 to-orange-600">
                                        <Clock className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2" style={{ color: '#022f2e' }}>Horario de Atención</h3>
                                        <p className="text-gray-600 font-medium leading-relaxed">
                                            Lunes a Viernes: 9:00 AM - 7:00 PM<br />
                                            Sábados: 10:00 AM - 3:00 PM<br />
                                            Domingos: Cerrado
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                                <h2 className="text-3xl font-bold mb-6" style={{ color: '#022f2e' }}>Envíanos un Mensaje</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Nombre Completo"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Tu nombre"
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />

                                        <Input
                                            label="Correo Electrónico"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="tu@email.com"
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Teléfono"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="33 1234 5678"
                                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-emerald-400 transition-all duration-300"
                                        />

                                        <div>
                                            <label className="block text-sm font-bold mb-3" style={{ color: '#022f2e' }}>
                                                Asunto <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 transition-all duration-300"
                                            >
                                                <option value="">Selecciona un asunto</option>
                                                <option value="general">Consulta General</option>
                                                <option value="support">Soporte Técnico</option>
                                                <option value="sales">Ventas</option>
                                                <option value="complaint">Queja o Reclamo</option>
                                                <option value="suggestion">Sugerencia</option>
                                                <option value="other">Otro</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-3" style={{ color: '#022f2e' }}>
                                            Mensaje <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder="Escribe tu mensaje aquí..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 transition-all duration-300 resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-14 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        isLoading={loading}
                                        disabled={loading}
                                        style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                    >
                                        {!loading && <Send className="h-5 w-5 mr-2" />}
                                        Enviar Mensaje
                                    </Button>
                                </form>
                            </div>

                            {/* FAQ Section */}
                            <div className="mt-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center" style={{ color: '#022f2e' }}>
                                    <HelpCircle className="h-8 w-8 mr-3 text-emerald-600" />
                                    Preguntas Frecuentes
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                        <h3 className="font-bold text-lg mb-3" style={{ color: '#022f2e' }}>¿Cuánto tiempo tarda el envío?</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Los envíos dentro del área metropolitana tardan de 24 a 48 horas.
                                            Para otras ciudades, de 3 a 5 días hábiles.
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                        <h3 className="font-bold text-lg mb-3" style={{ color: '#022f2e' }}>¿Cuál es la política de devoluciones?</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Aceptamos devoluciones dentro de los primeros 30 días posteriores
                                            a la compra, siempre que el producto esté en su empaque original.
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                        <h3 className="font-bold text-lg mb-3" style={{ color: '#022f2e' }}>¿Qué métodos de pago aceptan?</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Aceptamos tarjetas de crédito, débito, transferencias bancarias
                                            y pagos en efectivo en tiendas de conveniencia.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="relative h-96 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #022f2e 0%, #10b981 100%)' }}>
                                <MapPin className="h-12 w-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2" style={{ color: '#022f2e' }}>Nuestra Ubicación</h3>
                            <p className="text-gray-600 text-lg mb-2">Guadalajara, Jalisco, México</p>
                            <p className="text-sm text-gray-500">
                                (Aquí podrías integrar Google Maps)
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}