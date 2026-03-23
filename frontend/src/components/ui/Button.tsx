import { SING_COLORS } from '../../config/colors';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const VARIANTS = {
  primary: {
    backgroundColor: SING_COLORS.primary.main,
    color: 'white',
    border: 'none',
    hover: {
      backgroundColor: SING_COLORS.primary.dark,
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${SING_COLORS.primary.main}40`
    }
  },
  secondary: {
    backgroundColor: SING_COLORS.secondary.main,
    color: SING_COLORS.neutral.gray[900],
    border: 'none',
    hover: {
      backgroundColor: SING_COLORS.secondary.dark,
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${SING_COLORS.secondary.main}40`
    }
  },
  accent: {
    backgroundColor: SING_COLORS.accent.main,
    color: 'white',
    border: 'none',
    hover: {
      backgroundColor: SING_COLORS.accent.dark,
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${SING_COLORS.accent.main}40`
    }
  },
  danger: {
    backgroundColor: SING_COLORS.status.error,
    color: 'white',
    border: 'none',
    hover: {
      backgroundColor: '#DC2626',
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${SING_COLORS.status.error}40`
    }
  },
  ghost: {
    backgroundColor: 'transparent',
    color: SING_COLORS.neutral.gray[700],
    border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
    hover: {
      backgroundColor: SING_COLORS.neutral.gray[100],
      borderColor: SING_COLORS.neutral.gray[400]
    }
  }
};

const SIZES = {
  sm: { padding: '8px 16px', fontSize: '13px', iconSize: 16 },
  md: { padding: '10px 20px', fontSize: '14px', iconSize: 18 },
  lg: { padding: '12px 24px', fontSize: '16px', iconSize: 20 }
};

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  disabled = false,
  type = 'button',
  fullWidth = false
}: ButtonProps) {
  const variantStyle = VARIANTS[variant];
  const sizeStyle = SIZES[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyle,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: '500',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : 'auto',
        minHeight: '44px'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, variantStyle.hover);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.backgroundColor = variantStyle.backgroundColor;
          if (variant === 'ghost') {
            e.currentTarget.style.borderColor = SING_COLORS.neutral.gray[300];
          }
        }
      }}
    >
      {Icon && <Icon size={sizeStyle.iconSize} />}
      {children}
    </button>
  );
}
