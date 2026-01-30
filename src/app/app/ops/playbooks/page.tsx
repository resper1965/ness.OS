import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PlaybooksPage() {
  const supabase = await createClient();
  const { data: playbooks } = await supabase
    .from("playbooks")
    .select("id, title, slug, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Playbooks</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manuais técnicos que definem &quot;como fazemos&quot;. Todo serviço vendido deve ter um playbook vinculado.
          </p>
        </div>
        <Link href="/app/ops/playbooks/novo" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
          Novo playbook
        </Link>
      </div>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Atualizado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(playbooks ?? []).map((pb) => (
              <tr key={pb.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="px-4 py-3">{pb.title}</td>
                <td className="px-4 py-3 text-slate-400">{pb.slug}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(pb.updated_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3">
                  <Link href={`/app/ops/playbooks/${pb.id}`} className="text-ness hover:underline">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!playbooks || playbooks.length === 0) && (
          <div className="px-4 py-12 text-center">
            <p className="text-slate-400">Nenhum playbook cadastrado.</p>
            <p className="text-slate-500 text-sm mt-2">Crie o primeiro para documentar procedimentos e habilitar o Knowledge Bot.</p>
            <Link href="/app/ops/playbooks/novo" className="inline-block mt-4 rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">Novo playbook</Link>
          </div>
        )}
      </div>
    </div>
  );
}
