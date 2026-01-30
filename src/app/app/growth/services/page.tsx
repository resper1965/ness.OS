import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ServiceForm } from "@/components/growth/service-form";

export default async function GrowthServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services_catalog")
    .select("id, name, slug, is_active, playbook_id, playbooks(title)")
    .order("name");
  const { data: playbooks } = await supabase.from("playbooks").select("id, title").order("title");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Catálogo de Serviços</h1>
      <ServiceForm playbooks={playbooks ?? []} />
      <div className="mt-8 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Playbook</th>
              <th className="px-4 py-3 font-medium">Ativo</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-400">
            {(services ?? []).map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.slug}</td>
                <td className="px-4 py-3">{(s.playbooks as { title?: string })?.title ?? "-"}</td>
                <td className="px-4 py-3">{s.is_active ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">
                  <Link href={`/app/growth/services/${s.id}`} className="text-ness hover:underline">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
