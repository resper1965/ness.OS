/** Header fixo da página. Mesma altura que o header da sidebar (h-14). */

export const APP_HEADER_HEIGHT = 'h-14';

type AppPageHeaderProps = {
  title: string;
  subtitle?: React.ReactNode;
  /** Botões/links à direita, ex: Link "Novo caso" */
  actions?: React.ReactNode;
};

export function AppPageHeader({ title, subtitle, actions }: AppPageHeaderProps) {
  return (
    <header
      className={`${APP_HEADER_HEIGHT} sticky top-0 z-10 -mx-6 -mt-6 mb-6 flex min-h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80`}
    >
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
