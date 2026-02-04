'use client';

import React, { useCallback, createContext, useContext, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft } from 'lucide-react';
import { APP_HEADER_HEIGHT_PX, SIDEBAR_WIDTH_PX } from '@/lib/header-constants';

/** Largura da faixa icon-only quando sidebar colapsada (3rem). */
export const SIDEBAR_COLLAPSED_PX = 48;

type SidebarContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  isMobile: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  const value: SidebarContextValue = { open, setOpen, isMobile, toggle };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * Área principal (main). marginLeft = sidebar expandida ou faixa colapsada; mobile = 0.
 */
export function SidebarInset({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { open, isMobile } = useSidebar();
  const marginLeft = isMobile ? 0 : (open ? SIDEBAR_WIDTH_PX : SIDEBAR_COLLAPSED_PX);

  return (
    <main
      className={`min-w-0 flex-1 overflow-auto transition-[margin] duration-200 ${className}`}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      {children}
    </main>
  );
}

/**
 * Botão para abrir/fechar a sidebar (estilo Bundui).
 */
export function SidebarTrigger({ className = '' }: { className?: string }) {
  const { toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex size-9 items-center justify-center rounded-md border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white ${className}`}
      aria-label="Abrir ou fechar menu"
    >
      <PanelLeft className="size-4" />
    </button>
  );
}
