import { TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { EmptyState } from '@/components/shared/empty-state';

export default async function GrowthUpsellPage() {
  const supabase = await createClient();
  const { data: alerts } = await supabase
    .from('upsell_alerts')
    .select(`
      id,
      alert_type,
      message,
      created_at,
      contracts(clients(name))
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <PageContent>
      <AppPageHeader
        title="Upsell Alerts"
        subtitle="Alertas de consumo e oportunidades de upsell. Integre com métricas para disparar quando consumption > threshold."
      />
      <PageCard title="Alertas de upsell">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr className="h-[52px]">
              <th className="px-5 py-4 font-medium">Contrato</th>
              <th className="px-5 py-4 font-medium">Tipo</th>
              <th className="px-5 py-4 font-medium">Mensagem</th>
              <th className="px-5 py-4 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(alerts ?? []).map((a) => {
              const contracts = a.contracts as unknown;
              const contract = Array.isArray(contracts) ? contracts[0] : contracts;
              const clients = contract && typeof contract === 'object' && 'clients' in contract ? (contract as { clients: unknown }).clients : null;
              const client = Array.isArray(clients) ? clients[0] : clients;
              const clientName = client && typeof client === 'object' && 'name' in client ? (client as { name: string }).name : null;
              return (
                <tr key={a.id} className="text-slate-300">
                  <td className="px-5 py-4">{clientName ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-400">{a.alert_type ?? '-'}</td>
                  <td className="px-5 py-4">{a.message ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-400">{new Date(a.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!alerts || alerts.length === 0) && (
          <EmptyState
            icon={TrendingUp}
            title="Nenhum upsell configurado"
            message="Alertas de consumo e oportunidades de upsell. Integre com métricas para disparar quando consumption > threshold."
            description="Alertas são disparados automaticamente pela integração com métricas."
          />
        )}
        </div>
      </PageCard>
    </PageContent>
  );
}
