'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Wrapper genérico para formulários de entidade (phase-3 redução de complexidade).
 * Oferece layout consistente: título opcional, área de conteúdo, loading e submit.
 * Formulários específicos (ContractForm, JobForm, etc.) usam EntityForm como container
 * ou compõem com children.
 */
export type EntityFormProps<T = unknown> = {
  /** Título da seção do formulário */
  title?: string;
  /** Conteúdo do formulário (campos, botões) */
  children: React.ReactNode;
  /** Classe do container */
  className?: string;
  /** Se true, mostra estado de loading (skeleton ou disabled) */
  loading?: boolean;
  /** Callback de submit; se não passado, children devem tratar submit internamente */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  /** Atributos nativos do form */
  formProps?: Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'className'>;
};

export function EntityForm<T = unknown>({
  title,
  children,
  className,
  loading = false,
  onSubmit,
  formProps = {},
}: EntityFormProps<T>) {
  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit?.(e);
    },
    [onSubmit]
  );

  const body = (
    <div className={loading ? 'pointer-events-none opacity-60' : undefined}>
      <div className="p-5">{children}</div>
    </div>
  );

  return (
    <div className={cn('rounded-lg border border-slate-700', className)}>
      {title && (
        <div className="flex min-h-[52px] items-center border-b border-slate-700 bg-slate-800/50 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        </div>
      )}
      {onSubmit ? (
        <form onSubmit={handleSubmit} {...formProps}>
          {body}
        </form>
      ) : (
        body
      )}
    </div>
  );
}
