import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function GovPoliticasPage() {
  const supabase = await createClient();
  const { data: policies } = await supabase
    .from('policies')
    .select(`
      id,
      title,
      slug,
      created_at,
      policy_versions(version)
    `)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Políticas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Normas internas com versionamento e rastreabilidade de aceite.
          </p>
        </div>
        <Link
          href="/app/gov/politicas/novo"
          className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600"
        >
          Nova política
        </Link>
      </div>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Versões</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(policies ?? []).map((p) => {
              const versions = (p.policy_versions as { version: number }[] | null) ?? [];
              return (
                <tr key={p.id} className="text-slate-300 hover:bg-slate-800/30">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-slate-400">{p.slug ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-400">{versions.length}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(p.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/app/gov/politicas/${p.id}`}
                      className="text-ness hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!policies || policies.length === 0) && (
          <div className="px-4 py-12 text-center">
            <p className="text-slate-400">Nenhuma política cadastrada.</p>
            <Link
              href="/app/gov/politicas/novo"
              className="inline-block mt-4 rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600"
            >
              Nova política
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
