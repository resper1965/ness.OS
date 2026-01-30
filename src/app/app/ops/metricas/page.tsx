import { createClient } from "@/lib/supabase/server";
import { MetricasForm } from "@/components/ops/metricas-form";

export default async function MetricasPage() {
  const supabase = await createClient();
  const { data: contracts } = await supabase.from("contracts").select("id, mrr, client_id, clients(name)").order("client_id");
  const { data: metrics } = await supabase
    .from("performance_metrics")
    .select("*")
    .order("month", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Métricas de Performance</h1>
        <p className="text-slate-400 text-sm mt-1">
          Horas trabalhadas, custo cloud e SLA por contrato/mês. Alimenta o cálculo de rentabilidade.
        </p>
      </div>
      <MetricasForm contracts={contracts ?? []} recentMetrics={metrics ?? []} />
    </div>
  );
}
