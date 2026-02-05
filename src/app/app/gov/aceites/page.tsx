import { CheckCircle } from 'lucide-react';
import { getPendingAcceptances } from '@/app/actions/gov';
import { AcceptPolicyButton } from '@/components/gov/accept-policy-button';
import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { EmptyState } from '@/components/shared/empty-state';

export default async function GovAceitesPage() {
  const pending = await getPendingAcceptances();

  return (
    <PageContent>
      <AppPageHeader
        title="Rastreabilidade de Aceite"
        subtitle="Controle digital de assinaturas de NDAs, termos e políticas desde o onboarding."
      />
      <PageCard title="Rastreabilidade de Aceite">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr className="h-[52px]">
              <th className="px-5 py-4 font-medium">Política</th>
              <th className="px-5 py-4 font-medium">Versão</th>
              <th className="px-5 py-4 font-medium">Data</th>
              <th className="px-5 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {pending.map((v) => {
              const policies = v.policies;
              const policy = Array.isArray(policies) ? policies[0] : policies;
              return (
                <tr key={v.id} className="text-slate-300 hover:bg-slate-800/30">
                  <td className="px-5 py-4">
                    <Link href={`/app/gov/politicas/${(policy as { id?: string })?.id}`} className="text-ness hover:underline">
                      {(policy as { title?: string })?.title ?? '—'}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-slate-400">v{v.version}</td>
                  <td className="px-5 py-4 text-slate-400">
                    {new Date(v.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-5 py-4">
                    <AcceptPolicyButton policyVersionId={v.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pending.length === 0 && (
          <EmptyState
            icon={CheckCircle}
            title="Nenhuma política pendente de aceite"
            message="Todas as versões de políticas já foram aceitas por você."
            description="Controle digital de assinaturas de NDAs, termos e políticas desde o onboarding."
          />
        )}
        </div>
      </PageCard>
    </PageContent>
  );
}
