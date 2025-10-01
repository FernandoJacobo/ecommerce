'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
    return (
        <HotToaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#fff',
                    color: '#363636',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
                success: {
                    iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
}