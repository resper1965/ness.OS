import { AlertCircle, Calendar, CalendarClock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { EmptyState } from '@/components/shared/empty-state';
import { getReconciliationAlerts } from '@/app/actions/fin';

export default async function FinAlertasPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const in30Str = in30.toISOString().slice(0, 10);

  const [renewalRes, endDateRes, reconciliationAlerts] = await Promise.all([
    supabase
      .from('contracts')
      .select('id, mrr, renewal_date, clients(name)')
      .not('renewal_date', 'is', null)
      .gte('renewal_date', today)
      .lte('renewal_date', in30Str)
      .order('renewal_date'),
    supabase
      .from('contracts')
      .select('id, mrr, end_date, clients(name)')
      .not('end_date', 'is', null)
      .gte('end_date', today)
      .lte('end_date', in30Str)
      .order('end_date'),
    getReconciliationAlerts(),
  ]);
  const data = renewalRes.data;
  const endDateData = endDateRes.data;

  return (
    <PageContent>
      <AppPageHeader
        title="Alertas"
        subtitle="Renovação e reconciliação MRR vs faturamento Omie (mês corrente)."
      />

      {/* Reconciliação MRR vs Omie */}
      <PageCard title="Reconciliação MRR vs Omie">
        <p className="px-5 py-3 text-sm text-slate-400">
          Clientes com divergência acima da tolerância (5% do MRR ou R$ 50). Período: mês corrente.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr className="h-[52px]">
                <th className="px-5 py-4 font-medium">Cliente</th>
                <th className="px-5 py-4 font-medium">MRR</th>
                <th className="px-5 py-4 font-medium">Faturamento Omie</th>
                <th className="px-5 py-4 font-medium">Divergência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {reconciliationAlerts.map((a) => (
                <tr key={a.client_id} className="text-slate-300">
                  <td className="px-5 py-4">{a.client_name}</td>
                  <td className="px-5 py-4">R$ {a.mrr.toLocaleString('pt-BR')}</td>
                  <td className="px-5 py-4">R$ {a.faturamento_omie.toLocaleString('pt-BR')}</td>
                  <td className="px-5 py-4 text-amber-400">R$ {a.divergencia.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {reconciliationAlerts.length === 0 && (
            <EmptyState
              icon={AlertCircle}
              title="Nenhum alerta de reconciliação"
              message="MRR e faturamento Omie estão dentro da tolerância ou Omie indisponível."
              description="Período: mês corrente. Tolerância: 5% do MRR ou R$ 50."
            />
          )}
        </div>
      </PageCard>

      {/* Renovação */}
      <PageCard title="Renovação (próximos 30 dias)">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr className="h-[52px]">
                <th className="px-5 py-4 font-medium">Cliente</th>
                <th className="px-5 py-4 font-medium">MRR</th>
                <th className="px-5 py-4 font-medium">Renovação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {(data ?? []).map((c) => {
                const client = Array.isArray(c.clients) ? c.clients[0] : c.clients;
                const name = (client as { name?: string } | null)?.name;
                return (
                  <tr key={c.id} className="text-slate-300">
                    <td className="px-5 py-4">{name ?? '-'}</td>
                    <td className="px-5 py-4">R$ {Number(c.mrr).toLocaleString('pt-BR')}</td>
                    <td className="px-5 py-4 text-amber-400">{c.renewal_date ? new Date(c.renewal_date).toLocaleDateString('pt-BR') : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!data || data.length === 0) && (
            <EmptyState
              icon={Calendar}
              title="Nenhuma renovação nos próximos 30 dias"
              message="Nenhum contrato com data de renovação neste período."
            />
          )}
        </div>
      </PageCard>

      {/* Vencimento (end_date) */}
      <PageCard title="Vencimento (próximos 30 dias)">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr className="h-[52px]">
                <th className="px-5 py-4 font-medium">Cliente</th>
                <th className="px-5 py-4 font-medium">MRR</th>
                <th className="px-5 py-4 font-medium">Vencimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {(endDateData ?? []).map((c) => {
                const client = Array.isArray(c.clients) ? c.clients[0] : c.clients;
                const name = (client as { name?: string } | null)?.name;
                return (
                  <tr key={c.id} className="text-slate-300">
                    <td className="px-5 py-4">{name ?? '-'}</td>
                    <td className="px-5 py-4">R$ {Number(c.mrr).toLocaleString('pt-BR')}</td>
                    <td className="px-5 py-4 text-amber-400">{c.end_date ? new Date(c.end_date).toLocaleDateString('pt-BR') : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!endDateData || endDateData.length === 0) && (
            <EmptyState
              icon={CalendarClock}
              title="Nenhum vencimento nos próximos 30 dias"
              message="Nenhum contrato com data de vencimento neste período."
            />
          )}
        </div>
      </PageCard>
    </PageContent>
  );
}
