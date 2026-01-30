import { createClient } from "@/lib/supabase/server";

export default async function RentabilidadePage() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("contract_rentability").select("*");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Rentabilidade</h1>
        <p className="text-slate-400 text-sm mt-1">
          Receita (MRR) menos custos operacionais por contrato. Margem negativa em vermelho.
        </p>
      </div>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
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
            <p className="text-slate-500 text-sm mt-2">
              Cadastre contratos e insira métricas (horas, custo cloud) em OPS → Métricas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
