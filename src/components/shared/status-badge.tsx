type Variant = 'default' | 'success' | 'warning' | 'error' | 'info';

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'bg-slate-600/50 text-slate-300',
  success: 'bg-emerald-600/30 text-emerald-300',
  warning: 'bg-amber-600/30 text-amber-300',
  error: 'bg-red-600/30 text-red-300',
  info: 'bg-sky-600/30 text-sky-300',
};

/** Mapeamento comum de status → variant */
const STATUS_VARIANT: Record<string, Variant> = {
  new: 'info',
  qualified: 'info',
  proposal: 'warning',
  won: 'success',
  lost: 'error',
  open: 'success',
  closed: 'default',
  aberta: 'success',
  fechada: 'default',
  resolvido: 'success',
  pendente: 'warning',
  ok: 'success',
  gap: 'error',
  pending: 'warning',
};

type Props = {
  status: string;
  variant?: Variant;
  className?: string;
};

export function StatusBadge({ status, variant, className = '' }: Props) {
  const v = variant ?? STATUS_VARIANT[status.toLowerCase()] ?? 'default';
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${VARIANT_CLASSES[v]} ${className}`}
    >
      {label}
    </span>
  );
}
