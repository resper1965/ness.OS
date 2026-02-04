'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, PanelLeft, X } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { NessBrand } from '@/components/shared/ness-brand';
import { useState } from 'react';
import { useSidebar, SidebarTrigger, SIDEBAR_COLLAPSED_PX } from '@/components/app/sidebar-context';
import { APP_HEADER_HEIGHT_PX, SIDEBAR_WIDTH_PX } from '@/lib/header-constants';
import { navModules, getAllItems, type NavModule, type NavItem } from '@/lib/nav-config';
import { cn } from '@/lib/utils';

const MENU_ITEM_PADDING = 'px-3 py-2.5';

function isItemActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.href) return true;
  if (item.href !== '/app' && pathname.startsWith(item.href + '/')) return true;
  return false;
}

function CollapsibleGroup({
  module: mod,
  isOpen,
  onToggle,
  pathname,
  onNavigate,
}: {
  module: NavModule;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
  onNavigate?: () => void;
}) {
  const isInicio = mod.id === 'inicio';

  if (isInicio) {
    const item = mod.items![0];
    return (
      <div className="space-y-1">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            'block rounded-md text-sm font-medium transition-colors',
            MENU_ITEM_PADDING,
            pathname === item.href
              ? 'bg-slate-700/50 text-white'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
          )}
        >
          {item.label}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between rounded-md text-left text-xs font-semibold uppercase tracking-wider transition-colors',
          MENU_ITEM_PADDING,
          'text-slate-500 hover:bg-slate-700/30 hover:text-slate-400'
        )}
      >
        <span>{mod.title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
      </button>
      {isOpen && (
        <div className="mt-2 space-y-3">
          {mod.areas ? (
            mod.areas.map((area) => (
              <div key={area.id}>
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  {area.title}
                </div>
                <div className="space-y-1">
                  {area.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'block rounded-md text-sm font-medium transition-colors',
                        MENU_ITEM_PADDING,
                        isItemActive(pathname, item)
                          ? 'bg-slate-700/50 text-white'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            mod.items!.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'block rounded-md text-sm font-medium transition-colors',
                  MENU_ITEM_PADDING,
                  isItemActive(pathname, item)
                    ? 'bg-slate-700/50 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/** Conteúdo da navegação (compartilhado entre sidebar expandida e drawer mobile). */
function SidebarNavContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const path = pathname ?? '';
    const open = new Set<string>();
    for (const mod of navModules) {
      if (getAllItems(mod).some((i) => isItemActive(path, i))) open.add(mod.title);
    }
    if (open.size === 0) open.add('Início');
    return open;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
      {navModules.map((mod) => (
        <CollapsibleGroup
          key={mod.id}
          module={mod}
          isOpen={openGroups.has(mod.title)}
          onToggle={() => toggleGroup(mod.title)}
          pathname={pathname ?? ''}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { open, setOpen, isMobile } = useSidebar();

  // Mobile: drawer overlay
  if (isMobile) {
    return (
      <>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              aria-hidden
              onClick={() => setOpen(false)}
            />
            <aside
              className="fixed left-0 top-0 bottom-0 z-50 flex w-72 flex-col border-r border-slate-700 bg-slate-800/95 shadow-xl"
              aria-label="Menu principal"
            >
              <header
                className="flex shrink-0 items-center justify-between border-b border-slate-700 px-4"
                style={{ height: APP_HEADER_HEIGHT_PX, minHeight: APP_HEADER_HEIGHT_PX }}
              >
                <Link href="/app" className="flex items-center text-lg font-semibold text-white hover:text-ness transition-colors">
                  <NessBrand suffix="OS" />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X className="size-5" />
                </button>
              </header>
              <SidebarNavContent pathname={pathname ?? ''} onNavigate={() => setOpen(false)} />
              <form action={signOut} className="mt-auto shrink-0 p-5 pt-4">
                <button
                  type="submit"
                  className={cn('w-full rounded-md text-left text-sm font-medium transition-colors', MENU_ITEM_PADDING, 'text-slate-400 hover:bg-slate-700/50 hover:text-red-400')}
                >
                  Sair
                </button>
              </form>
            </aside>
          </>
        )}
      </>
    );
  }

  // Desktop colapsado: faixa 48px com logo + trigger
  if (!open) {
    return (
      <aside
        className="fixed left-0 top-0 bottom-0 z-20 flex flex-col items-center border-r border-slate-700 bg-slate-800/30 pt-4"
        style={{ width: SIDEBAR_COLLAPSED_PX }}
        aria-label="Menu recolhido"
      >
        <SidebarTrigger className="shrink-0" />
        <Link
          href="/app"
          className="mt-4 flex items-center justify-center text-white hover:text-ness transition-colors"
          title="ness.OS"
        >
          <span className="text-lg font-semibold brand-dot">n</span>
        </Link>
      </aside>
    );
  }

  // Desktop expandido: sidebar completa
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-20 flex w-56 flex-col border-r border-slate-700 bg-slate-800/30 transition-[width] duration-200"
      style={{ width: SIDEBAR_WIDTH_PX }}
      aria-label="Menu principal"
    >
      <header
        className="flex shrink-0 items-center justify-between border-b border-slate-700 px-4"
        style={{ height: APP_HEADER_HEIGHT_PX, minHeight: APP_HEADER_HEIGHT_PX, maxHeight: APP_HEADER_HEIGHT_PX }}
      >
        <Link href="/app" className="flex items-center text-lg font-semibold text-white hover:text-ness transition-colors">
          <NessBrand suffix="OS" />
        </Link>
        <SidebarTrigger />
      </header>
      <SidebarNavContent pathname={pathname ?? ''} />
      <form action={signOut} className="mt-auto shrink-0 p-5 pt-4">
        <button
          type="submit"
          className={cn('w-full rounded-md text-left text-sm font-medium transition-colors', MENU_ITEM_PADDING, 'text-slate-400 hover:bg-slate-700/50 hover:text-red-400')}
        >
          Sair
        </button>
      </form>
    </aside>
  );
}
