'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { NessBrand } from '@/components/shared/ness-brand';
import { useState } from 'react';

import { APP_HEADER_HEIGHT_PX } from '@/lib/header-constants';

const SIDEBAR_HEADER_HEIGHT = 'h-14';
const MENU_ITEM_PADDING = 'px-3 py-2';

type NavGroup = { title: string; items: { href: string; label: string }[] };

const navGroups: NavGroup[] = [
  { title: 'Início', items: [{ href: '/app', label: 'Dashboard' }] },
  {
    title: 'ness.GROWTH',
    items: [
      { href: '/app/growth/leads', label: 'Leads' },
      { href: '/app/growth/propostas', label: 'Propostas' },
      { href: '/app/growth/posts', label: 'Posts' },
      { href: '/app/growth/casos', label: 'Casos' },
      { href: '/app/growth/services', label: 'Serviços' },
      { href: '/app/growth/brand', label: 'Brand' },
      { href: '/app/growth/upsell', label: 'Upsell' },
    ],
  },
  {
    title: 'ness.OPS',
    items: [
      { href: '/app/ops/playbooks', label: 'Playbooks' },
      { href: '/app/ops/playbooks/chat', label: 'Knowledge Bot' },
      { href: '/app/ops/metricas', label: 'Métricas' },
      { href: '/app/ops/assets', label: 'Assets' },
    ],
  },
  {
    title: 'ness.PEOPLE',
    items: [
      { href: '/app/people/vagas', label: 'Vagas' },
      { href: '/app/people/candidatos', label: 'Candidatos' },
      { href: '/app/people/gaps', label: 'Gaps' },
      { href: '/app/people/avaliacao', label: '360º' },
    ],
  },
  {
    title: 'ness.FIN',
    items: [
      { href: '/app/fin/contratos', label: 'Contratos' },
      { href: '/app/fin/rentabilidade', label: 'Rentabilidade' },
      { href: '/app/fin/alertas', label: 'Alertas' },
    ],
  },
  {
    title: 'ness.JUR',
    items: [
      { href: '/app/jur', label: 'Visão Geral' },
      { href: '/app/jur/conformidade', label: 'Conformidade' },
      { href: '/app/jur/risco', label: 'Risco' },
    ],
  },
  {
    title: 'ness.GOV',
    items: [
      { href: '/app/gov', label: 'Visão Geral' },
      { href: '/app/gov/politicas', label: 'Políticas' },
      { href: '/app/gov/aceites', label: 'Aceites' },
    ],
  },
];

function CollapsibleGroup({
  group,
  isOpen,
  onToggle,
  pathname,
}: {
  group: NavGroup;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  const isInicio = group.title === 'Início';

  if (isInicio) {
    const item = group.items[0];
    return (
      <div className="space-y-0.5">
        <Link
          href={item.href}
          className={`block rounded-md ${MENU_ITEM_PADDING} text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white ${
            pathname === item.href ? 'bg-slate-700/50 text-white' : ''
          }`}
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
        className={`flex w-full items-center justify-between rounded-md ${MENU_ITEM_PADDING} text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-700/30 hover:text-slate-400`}
      >
        <span>{group.title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
      </button>
      {isOpen && (
        <div className="mt-0.5 space-y-0.5">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md ${MENU_ITEM_PADDING} text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white ${
                pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/app')
                  ? 'bg-slate-700/50 text-white'
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const path = pathname ?? '';
    const open = new Set<string>();
    for (const g of navGroups) {
      if (g.items.some((i) => path === i.href || (i.href !== '/app' && path.startsWith(i.href)))) {
        open.add(g.title);
      }
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
    <aside className="flex w-56 flex-col border-r border-slate-700 bg-slate-800/30 p-4">
      <header
        className={`${SIDEBAR_HEADER_HEIGHT} flex shrink-0 items-center border-b border-slate-700 mb-2`}
        style={{ height: `${APP_HEADER_HEIGHT_PX}px` }}
      >
        <Link
          href="/app"
          className="flex items-center text-lg font-semibold text-white hover:text-ness transition-colors"
        >
          <NessBrand suffix="OS" />
        </Link>
      </header>
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {navGroups.map((group) => (
          <CollapsibleGroup
            key={group.title}
            group={group}
            isOpen={openGroups.has(group.title)}
            onToggle={() => toggleGroup(group.title)}
            pathname={pathname ?? ''}
          />
        ))}
      </nav>
      <form action={signOut} className="mt-auto pt-2">
        <button
          type="submit"
          className={`w-full rounded-md ${MENU_ITEM_PADDING} text-left text-sm font-medium text-slate-400 hover:bg-slate-700/50 hover:text-red-400`}
        >
          Sair
        </button>
      </form>
    </aside>
  );
}
