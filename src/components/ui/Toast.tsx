import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastStyles = () => {
        const baseStyles = "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300";
        
        if (!visible) {
            return `${baseStyles} opacity-0 translate-y-[-20px]`;
        }

        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white`;
            case 'error':
                return `${baseStyles} bg-red-500 text-white`;
            case 'info':
            default:
                return `${baseStyles} bg-blue-500 text-white`;
        }
    };

    return (
        <div className={getToastStyles()}>
            <div className="flex items-center">
                <span className="mr-2">
                    {type === 'success' && '✅'}
                    {type === 'error' && '❌'}
                    {type === 'info' && 'ℹ️'}
                </span>
                {message}
            </div>
        </div>
    );
}
