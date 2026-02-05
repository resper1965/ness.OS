'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const linkButtonBase =
  'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

/**
 * Header do Dashboard Comercial (ness.GROWTH), no estilo do CRM do clone:
 * título à esquerda, ações (links) à direita.
 */
export function GrowthDashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 id="growth-heading" className="text-xl font-bold tracking-tight text-slate-200 lg:text-2xl">
        Visão Comercial
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/app/growth/leads"
          className={cn(
            linkButtonBase,
            'border border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white'
          )}
        >
          Leads
        </Link>
        <Link
          href="/app/growth/propostas"
          className={cn(
            linkButtonBase,
            'border border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white'
          )}
        >
          Propostas
        </Link>
        <Link
          href="/app/growth/services"
          className={cn(linkButtonBase, 'bg-ness text-white hover:bg-ness/90')}
        >
          Serviços
        </Link>
      </div>
    </div>
  );
}
