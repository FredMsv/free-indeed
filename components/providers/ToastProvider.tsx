"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss après 5 secondes
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Container des Toasts (Fixé en haut au centre) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300
              ${toast.type === 'success' ? 'bg-white border-success/20 text-gray-900' : ''}
              ${toast.type === 'error' ? 'bg-white border-error/20 text-gray-900' : ''}
              ${toast.type === 'warning' ? 'bg-white border-warning/20 text-gray-900' : ''}
              ${toast.type === 'info' ? 'bg-white border-blue-100 text-gray-900' : ''}
            `}
          >
            {/* Icône selon le type */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${toast.type === 'success' ? 'bg-success/10 text-success' : ''}
              ${toast.type === 'error' ? 'bg-error/10 text-error' : ''}
              ${toast.type === 'warning' ? 'bg-warning/10 text-warning' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 text-blue-500' : ''}
            `}>
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'warning' && <AlertTriangle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>

            <p className="text-sm font-medium flex-1">{toast.message}</p>

            <button 
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook personnalisé pour utiliser le toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    success: (msg: string) => context.addToast('success', msg),
    error: (msg: string) => context.addToast('error', msg),
    warning: (msg: string) => context.addToast('warning', msg),
    info: (msg: string) => context.addToast('info', msg),
  };
}