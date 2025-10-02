import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
            <Header />

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-6">Lo sentimos, la página que buscas no existe.</p>
                <Link href="/">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Volver al inicio
                    </button>
                </Link>
            </div>

            <Footer />
        </div>
    );
}
