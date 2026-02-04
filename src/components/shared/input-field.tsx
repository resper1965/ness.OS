'use client';

import { forwardRef } from 'react';

const inputBaseClass =
  'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-ness focus:outline-none focus:ring-1 focus:ring-ness disabled:cursor-not-allowed disabled:opacity-60';

export type InputFieldProps = {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  /** Para select, textarea: passar children ou asProps. Input padrão usa ...props. */
  as?: 'input' | 'select' | 'textarea';
  children?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>;

/**
 * Campo de formulário padronizado: label (htmlFor/id), input/select/textarea, helper e erro.
 * Acessibilidade: label associado; erro exibido abaixo; estado disabled visível.
 */
export const InputField = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, InputFieldProps>(
  (
    {
      id,
      label,
      type = 'text',
      name,
      placeholder,
      helper,
      error,
      disabled,
      required,
      className = '',
      as = 'input',
      children,
      ...props
    },
    ref
  ) => {
    const inputEl = (
      <>
        {as === 'select' && (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            id={id}
            name={name}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={helper ? `${id}-helper` : error ? `${id}-error` : undefined}
            className={inputBaseClass + (error ? ' border-red-500' : '') + (className ? ` ${className}` : '')}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
        )}
        {as === 'textarea' && (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={helper ? `${id}-helper` : error ? `${id}-error` : undefined}
            className={inputBaseClass + (error ? ' border-red-500' : '') + (className ? ` ${className}` : '')}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        )}
        {as === 'input' && (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={helper ? `${id}-helper` : error ? `${id}-error` : undefined}
            className={inputBaseClass + (error ? ' border-red-500' : '') + (className ? ` ${className}` : '')}
            {...props}
          />
        )}
      </>
    );

    return (
      <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400" aria-hidden> *</span>}
        </label>
        {inputEl}
        {helper && (
          <p id={`${id}-helper`} className="text-xs text-slate-500">
            {helper}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
