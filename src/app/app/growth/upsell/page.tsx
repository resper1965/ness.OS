import { createClient } from '@/lib/supabase/server';

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
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Upsell Alerts</h1>
      <p className="text-slate-400 mb-6">
        Alertas de consumo e oportunidades de upsell.
      </p>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
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
              const contract = a.contracts as { clients: { name: string } | null } | null;
              const client = contract?.clients;
              return (
                <tr key={a.id} className="text-slate-300">
                  <td className="px-4 py-3">{client?.name ?? '-'}</td>
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
    </div>
  );
}
