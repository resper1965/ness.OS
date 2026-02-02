import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default async function RentabilidadePage() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from('contract_rentability').select('*');

  return (
    <PageContent>
      <AppPageHeader
        title="Rentabilidade"
        subtitle="Receita (MRR) menos custos operacionais por contrato. Margem negativa em vermelho."
      />
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Receita (MRR)</th>
              <th className="px-4 py-3 font-medium">Custo</th>
              <th className="px-4 py-3 font-medium">Rentabilidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(rows ?? []).map((r: { contract_id: string; client_name: string; revenue: number; total_cost: number; rentability: number }) => (
              <tr key={r.contract_id} className="text-slate-300">
                <td className="px-4 py-3">{r.client_name}</td>
                <td className="px-4 py-3">R$ {Number(r.revenue).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">R$ {Number(r.total_cost).toLocaleString("pt-BR")}</td>
                <td className={`px-4 py-3 font-medium ${Number(r.rentability) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  R$ {Number(r.rentability).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!rows || rows.length === 0) && (
          <div className="px-4 py-12 text-center">
            <p className="text-slate-400">Nenhum dado de rentabilidade.</p>
            <p className="mt-2 text-sm text-slate-500">
              Cadastre contratos e insira métricas (horas, custo cloud) em OPS → Métricas.
            </p>
          </div>
        )}
      </div>
      {rows && rows.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Rentabilidade por contrato</h2>
          <div className="space-y-3">
            {(rows as { contract_id: string; client_name: string; rentability: number; revenue: number }[]).map((r) => {
              const pct = Number(r.revenue) > 0 ? (Number(r.rentability) / Number(r.revenue)) * 100 : 0;
              const barW = Math.min(100, Math.max(0, 50 + pct));
              return (
                <div key={r.contract_id} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-slate-300 truncate">{r.client_name}</span>
                  <div className="flex-1 h-6 bg-slate-800 rounded overflow-hidden">
                    <div
                      className={`h-full rounded transition-all ${Number(r.rentability) >= 0 ? 'bg-green-500/70' : 'bg-red-500/70'}`}
                      style={{ width: `${barW}%` }}
                    />
                  </div>
                  <span className={`w-24 text-right text-sm font-medium ${Number(r.rentability) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {Number(r.rentability).toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageContent>
  );
}
