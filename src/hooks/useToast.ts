import { useState, useCallback } from 'react';

interface ToastData {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now().toString();
        const newToast = { id, message, type };
        
        setToasts(prev => [...prev, newToast]);
        
        // Toast will be removed manually by user interaction
        // The removeToast function can be called when user interacts
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return {
        toasts,
        showToast,
        removeToast,
    };
};
