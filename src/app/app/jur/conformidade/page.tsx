import { getFrameworks, getChecksByFramework } from '@/app/actions/jur';
import { createClient } from '@/lib/supabase/server';
import { ComplianceCheckForm } from '@/components/jur/compliance-check-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';

export default async function JurConformidadePage() {
  const frameworks = await getFrameworks();
  const supabase = await createClient();
  const { data: playbooks } = await supabase
    .from('playbooks')
    .select('id, title, slug')
    .order('title');

  return (
    <PageContent>
      <AppPageHeader
        title="Conformidade"
        subtitle="Verificação de aderência à LGPD, Marco Civil e leis trabalhistas. Vincule processos (playbooks) a cada framework."
      />
      <PageCard title="Novo check de conformidade" className="mb-6">
        <ComplianceCheckForm
          frameworks={frameworks}
          playbooks={playbooks ?? []}
        />
      </PageCard>

      {frameworks.map((fw) => (
        <FrameworkChecks key={fw.id} frameworkId={fw.id} name={fw.name} />
      ))}
    </PageContent>
  );
}

async function FrameworkChecks({ frameworkId, name }: { frameworkId: string; name: string }) {
  const checks = await getChecksByFramework(frameworkId);

  return (
    <PageCard title={name}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr className="h-[52px]">
              <th className="px-4 py-2 font-medium">Processo</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {checks.map((c) => (
              <tr key={c.id} className="text-slate-300">
                <td className="px-4 py-2">{c.process_ref}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      c.status === 'ok'
                        ? 'text-green-400'
                        : c.status === 'gap'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                    }
                  >
                    {c.status === 'ok' ? 'OK' : c.status === 'gap' ? 'Gap' : 'Pendente'}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-400">{c.notes ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {checks.length === 0 && (
          <p className="px-4 py-6 text-slate-500 text-center">Nenhum check registrado.</p>
        )}
      </div>
    </PageCard>
  );
}
