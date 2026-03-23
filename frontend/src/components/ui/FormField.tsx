import { SING_COLORS } from '../../config/colors';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ id, label, required, error, hint, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label 
        htmlFor={id}
        style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px', 
          fontWeight: '500',
          color: error ? SING_COLORS.status.error : SING_COLORS.neutral.gray[900]
        }}
      >
        {label}
        {required && (
          <span 
            style={{ color: SING_COLORS.status.error, marginLeft: '4px' }}
            aria-label="requis"
          >
            *
          </span>
        )}
      </label>
      
      {children}
      
      {error && (
        <div 
          role="alert"
          aria-live="polite"
          id={`${id}-error`}
          style={{
            marginTop: '6px',
            padding: '8px 12px',
            backgroundColor: '#FEE2E2',
            border: `1px solid ${SING_COLORS.status.error}`,
            borderRadius: '6px',
            fontSize: '13px',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      {hint && !error && (
        <div style={{
          marginTop: '6px',
          fontSize: '12px',
          color: SING_COLORS.neutral.gray[600],
          fontStyle: 'italic'
        }}>
          {hint}
        </div>
      )}
    </div>
  );
}
