import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

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
        subtitle="Alertas de consumo e oportunidades de upsell."
      />
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Contrato</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Mensagem</th>
              <th className="px-4 py-3 font-medium">Data</th>
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
                  <td className="px-4 py-3">{clientName ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-400">{a.alert_type ?? '-'}</td>
                  <td className="px-4 py-3">{a.message ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(a.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!alerts || alerts.length === 0) && (
          <div className="px-4 py-12 text-center text-slate-500">
            Nenhum alerta de upsell. Integre com métricas de consumo para disparar alertas.
          </div>
        )}
      </div>
    </PageContent>
  );
}
