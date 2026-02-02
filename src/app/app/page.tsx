import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

const ALL_WIDGETS = [
  { key: 'leads', href: '/app/growth/leads', title: 'Leads', desc: 'Leads do site em Kanban. Qualifique e acompanhe conversões.' },
  { key: 'playbooks', href: '/app/ops/playbooks', title: 'Playbooks', desc: 'Manuais técnicos. Tudo que vendemos tem um playbook.' },
  { key: 'knowledge-bot', href: '/app/ops/playbooks/chat', title: 'Knowledge Bot', desc: 'Tire dúvidas sobre procedimentos usando IA.' },
  { key: 'services', href: '/app/growth/services', title: 'Serviços', desc: 'Catálogo de soluções. Vinculado aos playbooks.' },
  { key: 'propostas', href: '/app/growth/propostas', title: 'Propostas', desc: 'Propostas comerciais para clientes.' },
  { key: 'metricas', href: '/app/ops/metricas', title: 'Métricas', desc: 'Horas, custo cloud e SLA por contrato.' },
  { key: 'assets', href: '/app/ops/assets', title: 'Assets', desc: 'Arquivos e ativos de marca.' },
  { key: 'contratos', href: '/app/fin/contratos', title: 'Contratos', desc: 'Contratos e clientes.' },
  { key: 'rentabilidade', href: '/app/fin/rentabilidade', title: 'Rentabilidade', desc: 'Receita menos custos por contrato.' },
  { key: 'vagas', href: '/app/people/vagas', title: 'Vagas', desc: 'Vagas abertas aparecem em /carreiras.' },
  { key: 'gaps', href: '/app/people/gaps', title: 'Gaps', desc: 'Registro de gaps de treinamento.' },
] as const;

const ROLE_WIDGETS: Record<string, readonly (typeof ALL_WIDGETS)[number]['key'][]> = {
  admin: ALL_WIDGETS.map((w) => w.key),
  superadmin: ALL_WIDGETS.map((w) => w.key),
  sales: ['leads', 'services', 'propostas', 'knowledge-bot'],
  ops: ['playbooks', 'metricas', 'knowledge-bot', 'assets'],
  fin: ['contratos', 'rentabilidade'],
  employee: ['knowledge-bot', 'gaps'],
  legal: ['leads', 'knowledge-bot'], // JUR: acesso básico
};

export default async function AppDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string) || 'employee';
  const allowedKeys = ROLE_WIDGETS[role] ?? ROLE_WIDGETS.admin;
  const widgets = ALL_WIDGETS.filter((w) => allowedKeys.includes(w.key));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard ness.OS</h1>
        <p className="text-slate-400">
          Central de gestão do ness.OS. Aqui você organiza operação, vendas, pessoas e financeiro.
        </p>
        {role && (
          <p className="text-xs text-slate-500 mt-1">Role: {role}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((w) => (
          <Link
            key={w.key}
            href={w.href}
            className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
          >
            <h2 className="font-semibold text-white mb-1">{w.title}</h2>
            <p className="text-sm text-slate-400">{w.desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 text-sm text-slate-400">
        <strong className="text-slate-300">Fluxo:</strong> Playbooks (OPS) → Serviços (Growth) → Contratos (FIN) → Métricas (OPS).
        O site público consome o que você publica aqui.
      </div>
    </div>
  );
}
