import { getPendingAcceptances } from '@/app/actions/gov';
import { AcceptPolicyButton } from '@/components/gov/accept-policy-button';
import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default async function GovAceitesPage() {
  const pending = await getPendingAcceptances();

  return (
    <PageContent>
      <AppPageHeader
        title="Rastreabilidade de Aceite"
        subtitle="Controle digital de assinaturas de NDAs, termos e políticas desde o onboarding."
      />
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Política</th>
              <th className="px-4 py-3 font-medium">Versão</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {pending.map((v) => {
              const policies = v.policies;
              const policy = Array.isArray(policies) ? policies[0] : policies;
              return (
                <tr key={v.id} className="text-slate-300 hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <Link href={`/app/gov/politicas/${(policy as { id?: string })?.id}`} className="text-ness hover:underline">
                      {(policy as { title?: string })?.title ?? '—'}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-400">v{v.version}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(v.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <AcceptPolicyButton policyVersionId={v.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pending.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-slate-400">Nenhuma política pendente de aceite.</p>
            <p className="mt-2 text-sm text-slate-500">Todas as versões de políticas já foram aceitas por você.</p>
          </div>
        )}
      </div>
    </PageContent>
  );
}
