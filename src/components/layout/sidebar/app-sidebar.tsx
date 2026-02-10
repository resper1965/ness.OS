'use client';

import { X } from 'lucide-react';
import { LayoutLogo } from '@/components/layout/logo';
import { NavMain } from './nav-main';
import { NavUser, type NavUserProps } from './nav-user';
import { useSidebar, SidebarTrigger } from '@/components/app/sidebar-context';
import { APP_HEADER_HEIGHT_PX, SIDEBAR_WIDTH_PX } from '@/lib/header-constants';
import { SIDEBAR_COLLAPSED_PX } from '@/components/app/sidebar-context';

export type LayoutAppSidebarProps = NavUserProps;

/** Sidebar do app: logo, NavMain (nav-config), NavUser (tema + usuário). Mobile = drawer; desktop = colapsado ou expandido. */
export function LayoutAppSidebar({ user }: LayoutAppSidebarProps) {
  const { open, setOpen, isMobile } = useSidebar();

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
                <LayoutLogo suffix="OS" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X className="size-5" />
                </button>
              </header>
              <NavMain onNavigate={() => setOpen(false)} />
              <NavUser user={user} />
            </aside>
          </>
        )}
      </>
    );
  }

  if (!open) {
    return (
      <aside
        className="fixed left-0 top-0 bottom-0 z-20 flex flex-col items-center border-r border-slate-700 bg-slate-800/30 pt-2"
        style={{ width: SIDEBAR_COLLAPSED_PX }}
        aria-label="Menu recolhido"
      >
        <SidebarTrigger className="shrink-0" />
        <LayoutLogo compact className="mt-4" />
      </aside>
    );
  }

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
        <LayoutLogo suffix="OS" />
        <SidebarTrigger />
      </header>
      <NavMain />
      <NavUser user={user} />
    </aside>
  );
}
