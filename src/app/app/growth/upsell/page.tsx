import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';

type ContractRef = { clients?: { name?: string } | { name?: string }[] } | unknown;
type AlertRow = {
  id: string;
  alert_type: string | null;
  message: string | null;
  created_at: string;
  contracts: ContractRef | ContractRef[] | null;
};

function clientNameFromAlert(row: AlertRow): string {
  const contracts = row.contracts;
  if (!contracts) return '-';
  const c = Array.isArray(contracts) ? contracts[0] : contracts;
  if (!c || typeof c !== 'object' || !('clients' in c)) return '-';
  const clients = (c as { clients: unknown }).clients;
  const client = Array.isArray(clients) ? clients[0] : clients;
  return client && typeof client === 'object' && 'name' in client
    ? (client as { name: string }).name
    : '-';
}

export default async function GrowthUpsellPage() {
  const supabase = await getServerClient();
  const { data: alerts } = await supabase
    .from('upsell_alerts')
    .select(`
      id,
      alert_type,
      message,
      created_at,
      contracts(clients(name))
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  const rows = (alerts ?? []) as AlertRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Upsell Alerts"
        subtitle="Alertas de consumo e oportunidades de upsell. Integre com métricas para disparar quando consumption > threshold."
      />
      <PageCard title="Alertas de upsell">
        <DataTable<AlertRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum upsell configurado"
          emptyDescription="Alertas de consumo e oportunidades de upsell. Integre com métricas para disparar quando consumption > threshold. Alertas são disparados automaticamente pela integração com métricas."
          columns={[
            {
              key: 'contract',
              header: 'Contrato',
              render: (row) => clientNameFromAlert(row),
            },
            {
              key: 'alert_type',
              header: 'Tipo',
              render: (row) => <span className="text-slate-400">{row.alert_type ?? '-'}</span>,
            },
            {
              key: 'message',
              header: 'Mensagem',
              render: (row) => row.message ?? '-',
            },
            {
              key: 'created_at',
              header: 'Data',
              render: (row) => (
                <span className="text-slate-400">
                  {new Date(row.created_at).toLocaleDateString('pt-BR')}
                </span>
              ),
            },
          ]}
        />
      </PageCard>
    </PageContent>
  );
}
