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
      <h1 className="text-2xl font-bold text-white mb-8">Métricas de Performance</h1>
      <MetricasForm contracts={contracts ?? []} recentMetrics={metrics ?? []} />
    </div>
  );
}
