import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { PrimaryButton } from '@/components/shared/primary-button';

export default async function GrowthCasosPage() {
  const supabase = await createClient();
  const { data: cases } = await supabase
    .from('success_cases')
    .select('id, slug, title, is_published, created_at')
    .order('created_at', { ascending: false });

  return (
    <PageContent>
      <AppPageHeader
        title="Casos de Sucesso"
        subtitle="Casos publicados em /casos. Ative &quot;Publicar no Site&quot; para exibir."
        actions={<PrimaryButton href="/app/growth/casos/novo">Novo caso</PrimaryButton>}
      />
      <PageCard title="Casos de Sucesso">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr className="h-[52px]">
              <th className="px-5 py-4 font-medium">Título</th>
              <th className="px-5 py-4 font-medium">Slug</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Data</th>
              <th className="px-5 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(cases ?? []).map((c) => (
              <tr key={c.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="px-5 py-4">{c.title}</td>
                <td className="px-5 py-4 text-slate-400">{c.slug}</td>
                <td className="px-5 py-4">
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
                <td className="px-5 py-4 text-slate-400">
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-5 py-4">
                  <Link href={`/app/growth/casos/${c.id}`} className="text-ness hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!cases || cases.length === 0) && (
          <div className="px-5 py-16 text-center">
            <p className="text-slate-400">Nenhum caso cadastrado.</p>
            <p className="mt-3 text-sm text-slate-500">Crie o primeiro para publicar em /casos.</p>
            <div className="mt-6">
              <PrimaryButton href="/app/growth/casos/novo">Novo caso</PrimaryButton>
            </div>
          </div>
        )}
        </div>
      </PageCard>
    </PageContent>
  );
}
