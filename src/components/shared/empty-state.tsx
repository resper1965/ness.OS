import type { LucideIcon } from 'lucide-react';

/**
 * Estado vazio padronizado (inspirado em clone empty-states).
 * Suporta: ícone opcional, título, mensagem/descrição, ação (CTA).
 */
export function EmptyState({
  message,
  title,
  description,
  icon: Icon,
  action,
  className,
}: {
  message: string;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className ?? ''}`}>
      {Icon && (
        <Icon className="mx-auto h-14 w-14 text-slate-500" aria-hidden />
      )}
      {title && (
        <h2 className="mt-4 text-lg font-semibold text-slate-200">{title}</h2>
      )}
      <p className={title ? 'mt-1 text-slate-400' : 'text-slate-400'}>{message}</p>
      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
