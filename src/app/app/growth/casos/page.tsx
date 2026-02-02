import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function GrowthCasosPage() {
  const supabase = await createClient();
  const { data: cases } = await supabase
    .from('success_cases')
    .select('id, slug, title, is_published, created_at')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Casos de Sucesso</h1>
          <p className="text-slate-400 text-sm mt-1">
            Casos publicados em /casos. Ative &quot;Publicar no Site&quot; para exibir.
          </p>
        </div>
        <Link
          href="/app/growth/casos/novo"
          className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600"
        >
          Novo caso
        </Link>
      </div>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(cases ?? []).map((c) => (
              <tr key={c.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3 text-slate-400">{c.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      c.is_published
                        ? 'rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400'
                        : 'rounded-full bg-slate-600/50 px-2 py-0.5 text-xs text-slate-400'
                    }
                  >
                    {c.is_published ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/app/growth/casos/${c.id}`} className="text-ness hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!cases || cases.length === 0) && (
          <div className="px-4 py-12 text-center">
            <p className="text-slate-400">Nenhum caso cadastrado.</p>
            <p className="text-slate-500 text-sm mt-2">Crie o primeiro para publicar em /casos.</p>
            <Link href="/app/growth/casos/novo" className="inline-block mt-4 rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
              Novo caso
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
