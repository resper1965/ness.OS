/**
 * Estado vazio padronizado. Mensagem + ação opcional.
 */
export function EmptyState({
  message,
  description,
  action,
}: {
  message: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-4 py-12 text-center">
      <p className="text-slate-400">{message}</p>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
