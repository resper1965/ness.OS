/**
 * Wrapper para conteúdo da página com espaçamento vertical consistente.
 * Gap entre seções: 24px (space-y-6).
 */
export function PageContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
}
