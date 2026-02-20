'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type, title }]);

    const timeout = setTimeout(() => {
      dismissToast(id);
    }, 5000);
    
    timeoutRefs.current.set(id, timeout);
  }, [dismissToast]);

  useEffect(() => {
    const refs = timeoutRefs.current;
    return () => {
      refs.forEach((timeout) => clearTimeout(timeout));
      refs.clear();
    };
  }, []);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const defaultTitles = {
    success: 'Gelukt',
    error: 'Fout',
    warning: 'Waarschuwing',
    info: 'Informatie',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div key={toast.id} className={`toast toast-${toast.type}`} role="status" aria-live="polite">
              <div className="toast-icon">
                <Icon className="w-5 h-5" />
              </div>
              <div className="toast-content">
                <div className="toast-title">{toast.title || defaultTitles[toast.type]}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button className="toast-close" onClick={() => dismissToast(toast.id)} aria-label="Sluiten">
                <X className="w-4 h-4" />
              </button>
              <div className="toast-progress" />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
