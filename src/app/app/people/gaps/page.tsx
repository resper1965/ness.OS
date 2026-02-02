import { createClient } from "@/lib/supabase/server";
import { GapForm } from "@/components/people/gap-form";

export default async function GapsPage() {
  const supabase = await createClient();
  const { data: gaps } = await supabase
    .from("training_gaps")
    .select("id, description, severity, resolved_at, playbook_id, profiles(full_name), playbooks(title)")
    .order("created_at", { ascending: false });
  const { data: profiles } = await supabase.from("profiles").select("id, full_name");
  const { data: playbooks } = await supabase.from("playbooks").select("id, title").order("title");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Gaps de Treinamento</h1>
      <GapForm profiles={profiles ?? []} playbooks={playbooks ?? []} />
      <div className="mt-8 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="px-4 py-3 font-medium">Severidade</th>
              <th className="px-4 py-3 font-medium">Colaborador</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-400">
            {(gaps ?? []).map((g) => (
              <tr key={g.id}>
                <td className="px-4 py-3">{g.description}</td>
                <td className="px-4 py-3">{g.severity}</td>
                <td className="px-4 py-3">{(g.profiles as { full_name?: string })?.full_name ?? "-"}</td>
                <td className="px-4 py-3">{g.resolved_at ? "Resolvido" : "Pendente"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
