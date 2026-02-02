import { createClient } from '@/lib/supabase/server';

export default async function FinAlertasPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const in30Str = in30.toISOString().slice(0, 10);

  const { data } = await supabase
    .from('contracts')
    .select('id, mrr, renewal_date, clients(name)')
    .not('renewal_date', 'is', null)
    .gte('renewal_date', today)
    .lte('renewal_date', in30Str)
    .order('renewal_date');

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Alertas de Renovação</h1>
      <p className="text-slate-400 mb-6">Contratos com renovação nos próximos 30 dias.</p>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">MRR</th>
              <th className="px-4 py-3 font-medium">Renovação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(data ?? []).map((c) => {
              const client = Array.isArray(c.clients) ? c.clients[0] : c.clients;
              const name = (client as { name?: string } | null)?.name;
              return (
                <tr key={c.id} className="text-slate-300">
                  <td className="px-4 py-3">{name ?? '-'}</td>
                  <td className="px-4 py-3">R$ {Number(c.mrr).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-amber-400">{c.renewal_date ? new Date(c.renewal_date).toLocaleDateString('pt-BR') : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!data || data.length === 0) && (
          <div className="px-4 py-12 text-center text-slate-500">Nenhum contrato com renovação nos próximos 30 dias.</div>
        )}
      </div>
    </div>
  );
}
