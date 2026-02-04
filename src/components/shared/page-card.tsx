/**
 * Card/seção com borda consistente. Usado para tabelas, formulários, listas.
 */
export function PageCard({
  children,
  className = '',
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-700 ${className}`}>
      {title && (
        <div className="flex min-h-[52px] items-center border-b border-slate-700 bg-slate-800/50 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}
