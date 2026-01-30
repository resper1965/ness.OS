import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { JobForm } from "@/components/people/job-form";

export default async function VagasPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase.from("public_jobs").select("id, title, department, is_open").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Vagas</h1>
      <JobForm />
      <div className="rounded-lg border border-slate-700 overflow-hidden mt-8">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr><th className="px-4 py-3 font-medium">Título</th><th className="px-4 py-3 font-medium">Departamento</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-400">
            {(jobs ?? []).map((j) => (
              <tr key={j.id}>
                <td className="px-4 py-3">{j.title}</td>
                <td className="px-4 py-3">{j.department ?? "-"}</td>
                <td className="px-4 py-3">{j.is_open ? "Aberta" : "Fechada"}</td>
                <td className="px-4 py-3"><Link href={`/app/people/vagas/${j.id}`} className="text-ness hover:underline">Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
