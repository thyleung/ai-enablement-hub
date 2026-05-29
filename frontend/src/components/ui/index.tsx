import React from 'react';

// --- Button ------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'default' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}

// --- Input -------------------------------------------------------------------

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, hint, error, required, id, className = '', ...props }, ref) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={inputId}>
          {label}
          {required && <span className="required-mark" aria-label="required">*</span>}
        </label>
        {hint && <span className="form-hint" id={`${inputId}-hint`}>{hint}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`input${error ? ' error' : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && (
          <span className="form-error" role="alert">{error}</span>
        )}
      </div>
    );
  }
);

// --- TextArea ----------------------------------------------------------------

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, hint, error, required, id, className = '', ...props }, ref) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={inputId}>
          {label}
          {required && <span className="required-mark" aria-label="required">*</span>}
        </label>
        {hint && <span className="form-hint" id={`${inputId}-hint`}>{hint}</span>}
        <textarea
          ref={ref}
          id={inputId}
          className={`textarea${error ? ' error' : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && (
          <span className="form-error" role="alert">{error}</span>
        )}
      </div>
    );
  }
);

// --- Select ------------------------------------------------------------------

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, hint, error, required, options, placeholder, id, className = '', ...props }, ref) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={inputId}>
          {label}
          {required && <span className="required-mark" aria-label="required">*</span>}
        </label>
        {hint && <span className="form-hint" id={`${inputId}-hint`}>{hint}</span>}
        <select
          ref={ref}
          id={inputId}
          className={`select${error ? ' error' : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && (
          <span className="form-error" role="alert">{error}</span>
        )}
      </div>
    );
  }
);

// --- Badge -------------------------------------------------------------------

type BadgeType = 'status' | 'sensitivity';

interface BadgeProps {
  value: string;
  type?: BadgeType;
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  sent_to_jira: 'Sent to Jira',
  approved: 'Approved',
  declined: 'Declined',
};

const SENSITIVITY_LABELS: Record<string, string> = {
  public: 'Public',
  internal: 'Internal',
  confidential: 'Confidential',
  restricted: 'Restricted',
  '': '-',
};

export function Badge({ value, type = 'status' }: BadgeProps) {
  if (type === 'status') {
    return <span className={`badge badge-${value}`}>{STATUS_LABELS[value] ?? value}</span>;
  }
  const cls = value ? `badge-sensitivity-${value}` : 'badge-sensitivity-empty';
  return <span className={`badge ${cls}`}>{SENSITIVITY_LABELS[value] ?? value}</span>;
}

// --- LoadingSpinner ----------------------------------------------------------

interface SpinnerProps {
  size?: 'default' | 'sm';
  label?: string;
}

export function LoadingSpinner({ size = 'default', label = 'Loading' }: SpinnerProps) {
  return (
    <span
      className={`spinner${size === 'sm' ? ' spinner-sm' : ''}`}
      role="status"
      aria-label={label}
    />
  );
}
