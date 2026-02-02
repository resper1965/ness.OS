'use client';

import { UserRoleBadge } from '@/components/app/user-role-badge';

import { APP_HEADER_HEIGHT_PX } from '@/lib/header-constants';

export { APP_HEADER_HEIGHT_PX };
export const APP_HEADER_HEIGHT = 'h-14';

type AppPageHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Botões/links à direita, ex: Link "Novo caso" */
  actions?: React.ReactNode;
};

export function AppPageHeader({ title, subtitle, actions }: AppPageHeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 -mx-6 -mt-6 mb-2 flex h-14 shrink-0 items-center justify-between overflow-hidden border-b border-slate-700 bg-slate-900/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80"
      style={{ height: `${APP_HEADER_HEIGHT_PX}px`, minHeight: `${APP_HEADER_HEIGHT_PX}px`, maxHeight: `${APP_HEADER_HEIGHT_PX}px` }}
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <h1 className="truncate text-lg font-bold leading-tight text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 truncate text-xs leading-tight text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {actions}
        <UserRoleBadge />
      </div>
    </header>
  );
}
