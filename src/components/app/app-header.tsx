'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/app/sidebar-context';
import { APP_HEADER_HEIGHT_PX } from '@/lib/header-constants';
import { navModules, getAllItems } from '@/lib/nav-config';

function getBreadcrumb(pathname: string): { module: string; label: string } | null {
  if (!pathname?.startsWith('/app')) return null;
  for (const mod of navModules) {
    const items = getAllItems(mod);
    for (const item of items) {
      if (pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href + '/'))) {
        return { module: mod.title, label: item.label };
      }
    }
  }
  if (pathname === '/app') return { module: 'Início', label: 'Dashboard' };
  return null;
}

/**
 * Header global da app (estilo Bundui): SidebarTrigger + breadcrumb/título da área.
 */
export function AppHeader() {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname ?? '');

  return (
    <header
      className="flex shrink-0 items-center gap-4 border-b border-slate-700 bg-slate-900/50 px-6"
      style={{ height: APP_HEADER_HEIGHT_PX, minHeight: APP_HEADER_HEIGHT_PX }}
    >
      <SidebarTrigger />
      {breadcrumb && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>{breadcrumb.module}</span>
          <span className="text-slate-500">/</span>
          <span className="font-medium text-slate-200">{breadcrumb.label}</span>
        </div>
      )}
    </header>
  );
}
