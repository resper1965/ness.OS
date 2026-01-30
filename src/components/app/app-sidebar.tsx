import Link from 'next/link';
import { signOut } from '@/app/actions/auth';

const navItems = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/growth/posts', label: 'Posts' },
  { href: '/app/growth/leads', label: 'Leads' },
  { href: '/app/growth/services', label: 'Serviços' },
  { href: '/app/ops/playbooks', label: 'Playbooks' },
  { href: '/app/ops/playbooks/chat', label: 'Knowledge Bot' },
  { href: '/app/ops/metricas', label: 'Métricas' },
  { href: '/app/ops/assets', label: 'Assets' },
  { href: '/app/people/vagas', label: 'Vagas' },
  { href: '/app/people/candidatos', label: 'Candidatos' },
  { href: '/app/people/gaps', label: 'Gaps' },
  { href: '/app/fin/contratos', label: 'Contratos' },
  { href: '/app/fin/rentabilidade', label: 'Rentabilidade' },
];

export function AppSidebar() {
  return (
    <aside className="w-56 border-r border-slate-700 bg-slate-800/30 p-4 flex flex-col">
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white"
          >
            {item.label}
          </Link>
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
