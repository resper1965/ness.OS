import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { getReconciliationAlerts } from '@/app/actions/fin';

type ContractRow = {
  id: string;
  mrr: number;
  renewal_date?: string | null;
  end_date?: string | null;
  clients: { name?: string } | { name?: string }[] | null;
};

function clientName(c: ContractRow): string {
  const client = Array.isArray(c.clients) ? c.clients[0] : c.clients;
  return (client as { name?: string } | null)?.name ?? '-';
}

export default async function FinAlertasPage() {
  const supabase = await getServerClient();
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const in30Str = in30.toISOString().slice(0, 10);

  const [renewalRes, endDateRes, reconciliationAlerts] = await Promise.all([
    supabase
      .from('contracts')
      .select('id, mrr, renewal_date, clients(name)')
      .not('renewal_date', 'is', null)
      .gte('renewal_date', today)
      .lte('renewal_date', in30Str)
      .order('renewal_date'),
    supabase
      .from('contracts')
      .select('id, mrr, end_date, clients(name)')
      .not('end_date', 'is', null)
      .gte('end_date', today)
      .lte('end_date', in30Str)
      .order('end_date'),
    getReconciliationAlerts(),
  ]);

  const renewalData = (renewalRes.data ?? []) as ContractRow[];
  const endDateData = (endDateRes.data ?? []) as ContractRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Alertas"
        subtitle="Renovação e reconciliação MRR vs faturamento Omie (mês corrente)."
      />

      <PageCard title="Reconciliação MRR vs Omie">
        <p className="px-5 py-3 text-sm text-slate-400">
          Clientes com divergência acima da tolerância (5% do MRR ou R$ 50). Período: mês corrente.
        </p>
        <DataTable
          data={reconciliationAlerts}
          keyExtractor={(row) => row.client_id}
          emptyMessage="Nenhum alerta de reconciliação"
          emptyDescription="MRR e faturamento Omie estão dentro da tolerância ou Omie indisponível. Período: mês corrente. Tolerância: 5% do MRR ou R$ 50."
          columns={[
            { key: 'client_name', header: 'Cliente' },
            {
              key: 'mrr',
              header: 'MRR',
              render: (row) => `R$ ${row.mrr.toLocaleString('pt-BR')}`,
            },
            {
              key: 'faturamento_omie',
              header: 'Faturamento Omie',
              render: (row) => `R$ ${row.faturamento_omie.toLocaleString('pt-BR')}`,
            },
            {
              key: 'divergencia',
              header: 'Divergência',
              render: (row) => (
                <span className="text-amber-400">R$ {row.divergencia.toLocaleString('pt-BR')}</span>
              ),
            },
          ]}
        />
      </PageCard>

      <PageCard title="Renovação (próximos 30 dias)">
        <DataTable<ContractRow>
          data={renewalData}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhuma renovação nos próximos 30 dias"
          emptyDescription="Nenhum contrato com data de renovação neste período."
          columns={[
            {
              key: 'client',
              header: 'Cliente',
              render: (row) => clientName(row),
            },
            {
              key: 'mrr',
              header: 'MRR',
              render: (row) => `R$ ${Number(row.mrr).toLocaleString('pt-BR')}`,
            },
            {
              key: 'renewal_date',
              header: 'Renovação',
              render: (row) => (
                <span className="text-amber-400">
                  {row.renewal_date ? new Date(row.renewal_date).toLocaleDateString('pt-BR') : '-'}
                </span>
              ),
            },
          ]}
        />
      </PageCard>

      <PageCard title="Vencimento (próximos 30 dias)">
        <DataTable<ContractRow>
          data={endDateData}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum vencimento nos próximos 30 dias"
          emptyDescription="Nenhum contrato com data de vencimento neste período."
          columns={[
            {
              key: 'client',
              header: 'Cliente',
              render: (row) => clientName(row),
            },
            {
              key: 'mrr',
              header: 'MRR',
              render: (row) => `R$ ${Number(row.mrr).toLocaleString('pt-BR')}`,
            },
            {
              key: 'end_date',
              header: 'Vencimento',
              render: (row) => (
                <span className="text-amber-400">
                  {row.end_date ? new Date(row.end_date).toLocaleDateString('pt-BR') : '-'}
                </span>
              ),
            },
          ]}
        />
      </PageCard>
    </PageContent>
  );
}
