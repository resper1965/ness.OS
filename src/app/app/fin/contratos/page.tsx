import { createClient } from '@/lib/supabase/server';
import { ContractForm } from '@/components/fin/contract-form';
import { ClientForm } from '@/components/fin/client-form';
import { DataTable } from '@/components/shared/data-table';
import { AppPageHeader } from '@/components/shared/app-page-header';

type Contract = {
  id: string;
  mrr: number;
  start_date: string | null;
  end_date: string | null;
  clients: { name?: string } | { name?: string }[] | null;
};

export default async function ContratosPage() {
  const supabase = await createClient();
  const { data: contracts } = await supabase
    .from('contracts')
    .select('id, mrr, start_date, end_date, clients(name)')
    .order('start_date', { ascending: false });
  const { data: clients } = await supabase.from('clients').select('id, name').order('name');

  return (
    <div>
      <AppPageHeader
        title="Contratos"
        subtitle="MRR e vigência por cliente. Base para cálculo de rentabilidade e métricas."
      />
      <ClientForm />
      <ContractForm clients={clients ?? []} />
      <div className="mt-8">
        <DataTable<Contract>
          data={(contracts ?? []) as Contract[]}
          keyExtractor={(c) => c.id}
          emptyMessage="Nenhum contrato cadastrado. Adicione um cliente e depois crie o contrato."
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
      </div>
    </div>
  );
}
