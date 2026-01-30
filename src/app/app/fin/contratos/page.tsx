import { createClient } from "@/lib/supabase/server";
import { ContractForm } from "@/components/fin/contract-form";
import { ClientForm } from "@/components/fin/client-form";

export default async function ContratosPage() {
  const supabase = await createClient();
  const { data: contracts } = await supabase
    .from("contracts")
    .select("id, mrr, start_date, end_date, client_id, clients(name)")
    .order("start_date", { ascending: false });
  const { data: clients } = await supabase.from("clients").select("id, name").order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Contratos</h1>
      <ClientForm />
      <ContractForm clients={clients ?? []} />
      <div className="mt-8 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">MRR</th>
              <th className="px-4 py-3 font-medium">Início</th>
              <th className="px-4 py-3 font-medium">Fim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-400">
            {(contracts ?? []).map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">{(c.clients as { name?: string })?.name ?? "-"}</td>
                <td className="px-4 py-3">R$ {Number(c.mrr).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">{c.start_date ? new Date(c.start_date).toLocaleDateString("pt-BR") : "-"}</td>
                <td className="px-4 py-3">{c.end_date ? new Date(c.end_date).toLocaleDateString("pt-BR") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!contracts || contracts.length === 0) && (
          <div className="px-4 py-12 text-center text-slate-400">Nenhum contrato. Adicione um cliente primeiro.</div>
        )}
      </div>
    </div>
  );
}
