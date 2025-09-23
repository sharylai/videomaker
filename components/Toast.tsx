import React, { useEffect } from 'react';
import { CheckCircleIcon } from './icons';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed bottom-5 right-5 bg-green-600 text-white py-3 px-5 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <CheckCircleIcon className="w-6 h-6" />
      <span>{message}</span>
    </div>
  );
};