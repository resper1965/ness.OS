import Link from 'next/link';
import { signOut } from '@/app/actions/auth';

type NavGroup = { title: string; items: { href: string; label: string }[] };

const navGroups: NavGroup[] = [
  {
    title: 'Início',
    items: [{ href: '/app', label: 'Dashboard' }],
  },
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

export function AppSidebar() {
  return (
    <aside className="w-56 border-r border-slate-700 bg-slate-800/30 p-4 flex flex-col">
      <header className="mb-6 flex h-14 shrink-0 items-center border-b border-slate-700">
        <Link
          href="/app"
          className="text-lg font-semibold text-white hover:text-ness transition-colors"
        >
          ness<span className="text-ness">.</span>OS
        </Link>
      </header>
      <nav className="space-y-6 flex-1 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <form action={signOut} className="mt-auto">
        <button
          type="submit"
          className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-700/50 hover:text-red-400"
        >
          Sair
        </button>
      </form>
    </aside>
  );
}
