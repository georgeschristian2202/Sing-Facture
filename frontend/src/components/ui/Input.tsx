import { SING_COLORS } from '../../config/colors';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, ...props }: InputProps) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '10px 12px',
        border: `2px solid ${error ? SING_COLORS.status.error : SING_COLORS.neutral.gray[300]}`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s',
        ...props.style
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = SING_COLORS.primary.main;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${SING_COLORS.primary.main}20`;
        }
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? SING_COLORS.status.error : SING_COLORS.neutral.gray[300];
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      style={{
        width: '100%',
        padding: '10px 12px',
        border: `2px solid ${error ? SING_COLORS.status.error : SING_COLORS.neutral.gray[300]}`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: 'white',
        cursor: 'pointer',
        ...props.style
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = SING_COLORS.primary.main;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${SING_COLORS.primary.main}20`;
        }
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? SING_COLORS.status.error : SING_COLORS.neutral.gray[300];
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%',
        padding: '10px 12px',
        border: `2px solid ${error ? SING_COLORS.status.error : SING_COLORS.neutral.gray[300]}`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        resize: 'vertical',
        minHeight: '80px',
        ...props.style
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = SING_COLORS.primary.main;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${SING_COLORS.primary.main}20`;
        }
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? SING_COLORS.status.error : SING_COLORS.neutral.gray[300];
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
}
