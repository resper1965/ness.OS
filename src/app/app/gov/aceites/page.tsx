import Link from 'next/link';
import { getPendingAcceptances } from '@/app/actions/gov';
import { AcceptPolicyButton } from '@/components/gov/accept-policy-button';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';

type PendingRow = {
  id: string;
  version: number;
  created_at: string;
  policies: { id?: string; title?: string; slug?: string } | { id?: string; title?: string; slug?: string }[] | null;
};

function policyFromRow(row: PendingRow): { id?: string; title?: string } | null {
  const p = row.policies;
  if (!p) return null;
  return Array.isArray(p) ? p[0] ?? null : p;
}

export default async function GovAceitesPage() {
  const pending = (await getPendingAcceptances()) as PendingRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Rastreabilidade de Aceite"
        subtitle="Controle digital de assinaturas de NDAs, termos e políticas desde o onboarding."
      />
      <PageCard title="Rastreabilidade de Aceite">
        <DataTable<PendingRow>
          data={pending}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhuma política pendente de aceite"
          emptyDescription="Todas as versões de políticas já foram aceitas por você."
          columns={[
            {
              key: 'policy',
              header: 'Política',
              render: (row) => {
                const policy = policyFromRow(row);
                return (
                  <Link
                    href={policy?.id ? `/app/gov/politicas/${policy.id}` : '#'}
                    className="text-ness hover:underline"
                  >
                    {policy?.title ?? '—'}
                  </Link>
                );
              },
            },
            {
              key: 'version',
              header: 'Versão',
              render: (row) => `v${row.version}`,
            },
            {
              key: 'created_at',
              header: 'Data',
              render: (row) => new Date(row.created_at).toLocaleDateString('pt-BR'),
            },
          ]}
          actions={(row) => <AcceptPolicyButton policyVersionId={row.id} />}
        />
      </PageCard>
    </PageContent>
  );
}
