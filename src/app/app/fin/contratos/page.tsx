import Link from 'next/link';
import { FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ContractForm } from '@/components/fin/contract-form';
import { ClientForm } from '@/components/fin/client-form';
import { ErpSyncButton } from '@/components/fin/erp-sync-button';
import { DataTable } from '@/components/shared/data-table';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { EmptyState } from '@/components/shared/empty-state';
import { IndicesCard } from '@/components/fin/indices-card';
import { getLastErpSync, getIndices } from '@/app/actions/data';

type Contract = {
  id: string;
  mrr: number;
  start_date: string | null;
  end_date: string | null;
  clients: { name?: string } | { name?: string }[] | null;
};

export default async function ContratosPage() {
  const supabase = await createClient();
  const [contractsRes, clientsRes, lastSync, indices] = await Promise.all([
    supabase.from('contracts').select('id, mrr, start_date, end_date, clients(name)').order('start_date', { ascending: false }),
    supabase.from('clients').select('id, name').order('name'),
    getLastErpSync(),
    getIndices().catch(() => null),
  ]);
  const contracts = contractsRes.data;
  const clients = clientsRes.data;

  return (
    <PageContent>
      <AppPageHeader
        title="Contratos"
        subtitle="MRR e vigência por cliente. Base para cálculo de rentabilidade e métricas."
        actions={<ErpSyncButton lastSync={lastSync} />}
      />
      {indices != null && <IndicesCard indices={indices} />}
      <div id="client-form"><ClientForm /></div>
      <ContractForm clients={clients ?? []} />
      <PageCard title="Contratos">
        {(!contracts || contracts.length === 0) ? (
          <EmptyState
            icon={FileText}
            title="Nenhum contrato cadastrado"
            message="Adicione um cliente e use o formulário acima para criar um contrato com MRR e vigência."
            description="Contratos são a base para rentabilidade e alertas de renovação."
            action={
              <Link href="#client-form" className="text-ness hover:underline font-medium">
                Adicionar cliente →
              </Link>
            }
          />
        ) : (
          <DataTable<Contract>
          data={contracts as Contract[]}
          keyExtractor={(c) => c.id}
          emptyMessage="Nenhum contrato cadastrado."
          columns={[
            {
              key: 'clients',
              header: 'Cliente',
              render: (c) => {
                const clientsData = c.clients;
                const name = Array.isArray(clientsData)
                  ? (clientsData[0] as { name?: string })?.name
                  : (clientsData as { name?: string })?.name;
                return name ?? '-';
              },
            },
            {
              key: 'mrr',
              header: 'MRR',
              render: (c) => `R$ ${Number(c.mrr).toLocaleString('pt-BR')}`,
            },
            {
              key: 'start_date',
              header: 'Início',
              render: (c) => (c.start_date ? new Date(c.start_date).toLocaleDateString('pt-BR') : '-'),
            },
            {
              key: 'end_date',
              header: 'Fim',
              render: (c) => (c.end_date ? new Date(c.end_date).toLocaleDateString('pt-BR') : '-'),
            },
          ]}
        />
        )}
      </PageCard>
    </PageContent>
  );
}
