/**
 * Wrapper para conteúdo da página com espaçamento vertical consistente.
 * Gap entre seções: 32px (space-y-8) — 8pt grid.
 */
export function PageContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`min-w-0 space-y-8 ${className}`}>{children}</div>;
}
