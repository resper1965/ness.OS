import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getReconciliationAlerts } from '@/app/actions/fin';

export default async function FinDashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const in30Str = in30.toISOString().slice(0, 10);

  const [contractsRes, renewalRes, reconciliationAlerts] = await Promise.all([
    supabase.from('contracts').select('id, mrr'),
    supabase
      .from('contracts')
      .select('id')
      .not('renewal_date', 'is', null)
      .gte('renewal_date', today)
      .lte('renewal_date', in30Str),
    getReconciliationAlerts(),
  ]);

  const contracts = contractsRes.data ?? [];
  const totalMrr = contracts.reduce((acc, c) => acc + Number(c.mrr ?? 0), 0);
  const renewalCount = (renewalRes.data ?? []).length;
  const reconciliationCount = reconciliationAlerts.length;

  const navCards = [
    { href: '/app/fin/contratos', title: 'Contratos', desc: 'MRR, vigência e clientes. Sincronize com Omie.' },
    { href: '/app/fin/rentabilidade', title: 'Rentabilidade', desc: 'Receita menos custos por contrato. Margem por cliente.' },
    { href: '/app/fin/alertas', title: 'Alertas', desc: 'Renovação e reconciliação MRR vs faturamento Omie.' },
  ];

  return (
    <PageContent>
      <AppPageHeader
        title="ness.FIN"
        subtitle="CFO digital. Rentabilidade real, contratos e ciclo de vida. Visão geral do módulo financeiro."
      />

      {/* Cards de resumo (estilo dashboard Bundui/finance) */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>MRR total</CardDescription>
            <CardTitle className="text-2xl text-ness">
              R$ {totalMrr.toLocaleString('pt-BR')}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Contratos</CardDescription>
            <CardTitle className="text-2xl text-white">{contracts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Renovação (30 dias)</CardDescription>
            <CardTitle className="text-2xl text-white">{renewalCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alertas reconciliação</CardDescription>
            <CardTitle className={`text-2xl ${reconciliationCount > 0 ? 'text-amber-400' : 'text-white'}`}>
              {reconciliationCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Cards de navegação para sub-páginas */}
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {navCards.map((item) => (
          <Link key={item.href} href={item.href} className="block min-w-0">
            <Card className="h-full transition-colors hover:border-ness/50 hover:bg-slate-800/70">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-sm text-ness">Abrir →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Fluxo: Contratos (MRR e vigência) → Métricas (ness.OPS) → Rentabilidade (margem) e Alertas (renovação e Omie).
      </p>
    </PageContent>
  );
}
