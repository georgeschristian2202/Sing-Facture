import { SING_COLORS } from '../../config/colors';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: LucideIcon;
  padding?: string;
  hover?: boolean;
}

export function Card({ children, title, icon: Icon, padding = '24px', hover = false }: CardProps) {
  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: `1px solid ${SING_COLORS.neutral.gray[200]}`,
        padding,
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {title && (
        <div style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {Icon && <Icon size={20} color={SING_COLORS.primary.main} />}
          <h4 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: SING_COLORS.neutral.gray[900]
          }}>
            {title}
          </h4>
        </div>
      )}
      {children}
    </div>
  );
}
