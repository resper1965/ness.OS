import { getFrameworks, getChecksByFramework } from '@/app/actions/compliance';
import { createClient } from '@/lib/supabase/server';
import { ComplianceCheckForm } from '@/components/jur/compliance-check-form';

export default async function JurConformidadePage() {
  const frameworks = await getFrameworks();
  const supabase = await createClient();
  const { data: playbooks } = await supabase
    .from('playbooks')
    .select('id, title')
    .order('title');

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Conformidade</h1>
      <p className="text-slate-400 mb-6">
        Verificação de aderência à LGPD, Marco Civil e leis trabalhistas.
      </p>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Novo check</h2>
          <ComplianceCheckForm
            frameworks={frameworks}
            playbooks={playbooks ?? []}
          />
        </div>

        {frameworks.map((fw) => (
          <FrameworkChecks key={fw.id} frameworkId={fw.id} name={fw.name} />
        ))}
      </div>
    </div>
  );
}

async function FrameworkChecks({ frameworkId, name }: { frameworkId: string; name: string }) {
  const checks = await getChecksByFramework(frameworkId);

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-3">{name}</h2>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
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
    </div>
  );
}
