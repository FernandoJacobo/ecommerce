import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Para enviar cookies (refresh token)
});

// Interceptor para agregar token en cada petición
api.interceptors.request.use(
    (config) => {
        // Obtener token del localStorage
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores y refresh token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Si el error es 401 y no hemos reintentado
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Intentar renovar el token
                const { data } = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = data.data.accessToken;

                // Guardar nuevo token
                localStorage.setItem('accessToken', newToken);

                // Reintentar la petición original con el nuevo token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                // Si falla el refresh, limpiar tokens y redirigir a login
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Helper para manejar errores de API
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || 'Error desconocido';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Error desconocido';
}

export default api;