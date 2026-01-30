import Link from 'next/link';

export default function AppDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard ness.OS</h1>
        <p className="text-slate-400">
          Central de gestão da NESS. Aqui você organiza operação, vendas, pessoas e financeiro.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/app/growth/leads"
          className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
        >
          <h2 className="font-semibold text-white mb-1">Leads</h2>
          <p className="text-sm text-slate-400">Leads do site em Kanban. Qualifique e acompanhe conversões.</p>
        </Link>
        <Link
          href="/app/ops/playbooks"
          className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
        >
          <h2 className="font-semibold text-white mb-1">Playbooks</h2>
          <p className="text-sm text-slate-400">Manuais técnicos. Tudo que vendemos tem um playbook.</p>
        </Link>
        <Link
          href="/app/ops/playbooks/chat"
          className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
        >
          <h2 className="font-semibold text-white mb-1">Knowledge Bot</h2>
          <p className="text-sm text-slate-400">Tire dúvidas sobre procedimentos usando IA.</p>
        </Link>
        <Link
          href="/app/growth/services"
          className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
        >
          <h2 className="font-semibold text-white mb-1">Serviços</h2>
          <p className="text-sm text-slate-400">Catálogo de soluções. Vinculado aos playbooks.</p>
        </Link>
        <Link
          href="/app/fin/rentabilidade"
          className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
        >
          <h2 className="font-semibold text-white mb-1">Rentabilidade</h2>
          <p className="text-sm text-slate-400">Receita menos custos por contrato.</p>
        </Link>
        <Link
          href="/app/people/vagas"
          className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
        >
          <h2 className="font-semibold text-white mb-1">Vagas</h2>
          <p className="text-sm text-slate-400">Vagas abertas aparecem em /carreiras.</p>
        </Link>
      </div>

      <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 text-sm text-slate-400">
        <strong className="text-slate-300">Fluxo:</strong> Playbooks (OPS) → Serviços (Growth) → Contratos (FIN) → Métricas (OPS).
        O site público consome o que você publica aqui.
      </div>
    </div>
  );
}
