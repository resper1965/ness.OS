import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { PrimaryButton } from '@/components/shared/primary-button';

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
    <PageContent>
      <AppPageHeader
        title="Políticas"
        subtitle="Normas internas com versionamento e rastreabilidade de aceite."
        actions={<PrimaryButton href="/app/gov/politicas/novo">Nova política</PrimaryButton>}
      />
      <PageCard title="Políticas">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr className="h-[52px]">
              <th className="px-5 py-4 font-medium">Título</th>
              <th className="px-5 py-4 font-medium">Slug</th>
              <th className="px-5 py-4 font-medium">Versões</th>
              <th className="px-5 py-4 font-medium">Data</th>
              <th className="px-5 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(policies ?? []).map((p) => {
              const versions = (p.policy_versions as { version: number }[] | null) ?? [];
              return (
                <tr key={p.id} className="text-slate-300 hover:bg-slate-800/30">
                  <td className="px-5 py-4">{p.title}</td>
                  <td className="px-5 py-4 text-slate-400">{p.slug ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-400">{versions.length}</td>
                  <td className="px-5 py-4 text-slate-400">
                    {new Date(p.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-5 py-4">
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
            <div className="mt-4">
              <PrimaryButton href="/app/gov/politicas/novo">Nova política</PrimaryButton>
            </div>
          </div>
        )}
        </div>
      </PageCard>
    </PageContent>
  );
}
