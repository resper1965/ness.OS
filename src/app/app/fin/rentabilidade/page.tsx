import { createClient } from "@/lib/supabase/server";

export default async function RentabilidadePage() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("contract_rentability").select("*");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Rentabilidade</h1>
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
          <div className="px-4 py-12 text-center text-slate-400">
            Cadastre contratos e métricas para ver a rentabilidade.
          </div>
        )}
      </div>
    </div>
  );
}
