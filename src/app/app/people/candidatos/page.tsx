import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';

export default async function CandidatosPage() {
  const supabase = await createClient();
  const { data: apps } = await supabase
    .from('job_applications')
    .select('id, candidate_name, candidate_email, created_at, public_jobs(title)')
    .order('created_at', { ascending: false });

  return (
    <PageContent>
      <AppPageHeader
        title="Candidatos"
        subtitle="Candidaturas das vagas publicadas em /carreiras."
      />
      <PageCard title="Candidatos">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr className="h-[52px]">
              <th className="px-5 py-4 font-medium">Nome</th>
              <th className="px-5 py-4 font-medium">E-mail</th>
              <th className="px-5 py-4 font-medium">Vaga</th>
              <th className="px-5 py-4 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-400">
            {(apps ?? []).map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-4">{a.candidate_name}</td>
                <td className="px-5 py-4">{a.candidate_email}</td>
                <td className="px-5 py-4">{(a.public_jobs as { title?: string })?.title ?? "-"}</td>
                <td className="px-5 py-4">{new Date(a.created_at).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!apps || apps.length === 0) && (
          <div className="px-4 py-12 text-center text-slate-400">Nenhuma candidatura.</div>
        )}
        </div>
      </PageCard>
    </PageContent>
  );
}
