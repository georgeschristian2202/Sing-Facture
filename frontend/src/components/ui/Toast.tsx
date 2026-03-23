import { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { SING_COLORS } from '../../config/colors';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const TOAST_STYLES = {
  success: { bg: SING_COLORS.status.success, icon: Check },
  error: { bg: SING_COLORS.status.error, icon: AlertCircle },
  warning: { bg: SING_COLORS.status.warning, icon: AlertCircle },
  info: { bg: SING_COLORS.status.info, icon: Info }
};

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { bg, icon: Icon } = TOAST_STYLES[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        padding: '16px 20px',
        backgroundColor: bg,
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 2000,
        transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-out',
        minWidth: '300px'
      }}
    >
      <Icon size={20} />
      <span style={{ fontWeight: '500', flex: 1 }}>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Fermer"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
}
