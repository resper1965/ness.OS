import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';

type RentabilityRow = {
  contract_id: string;
  client_name: string;
  revenue: number;
  total_cost: number;
  rentability: number;
};

export default async function RentabilidadePage() {
  const supabase = await getServerClient();
  const { data: rows } = await supabase.from('contract_rentability').select('*');

  const data = (rows ?? []) as RentabilityRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Rentabilidade"
        subtitle="Receita (MRR) menos custos operacionais por contrato. Margem negativa em vermelho."
      />
      <PageCard title="Rentabilidade">
        <DataTable<RentabilityRow>
          data={data}
          keyExtractor={(row) => row.contract_id}
          emptyMessage="Nenhum dado de rentabilidade"
          emptyDescription="Cadastre contratos e insira métricas (horas, custo cloud) em ness.OPS → Métricas. A rentabilidade é calculada a partir de MRR e custos operacionais por contrato."
          columns={[
            { key: 'client_name', header: 'Cliente' },
            {
              key: 'revenue',
              header: 'Receita (MRR)',
              render: (row) => `R$ ${Number(row.revenue).toLocaleString('pt-BR')}`,
            },
            {
              key: 'total_cost',
              header: 'Custo',
              render: (row) => `R$ ${Number(row.total_cost).toLocaleString('pt-BR')}`,
            },
            {
              key: 'rentability',
              header: 'Rentabilidade',
              render: (row) => (
                <span
                  className={`font-medium ${Number(row.rentability) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  R$ {Number(row.rentability).toLocaleString('pt-BR')}
                </span>
              ),
            },
          ]}
        />
      </PageCard>
      {data.length > 0 && (
        <PageCard title="Rentabilidade por contrato">
          <div className="space-y-3">
            {data.map((r) => {
              const pct = Number(r.revenue) > 0 ? (Number(r.rentability) / Number(r.revenue)) * 100 : 0;
              const barW = Math.min(100, Math.max(0, 50 + pct));
              return (
                <div key={r.contract_id} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-slate-300 truncate">{r.client_name}</span>
                  <div className="flex-1 h-6 bg-slate-800 rounded overflow-hidden">
                    <div
                      className={`h-full rounded transition-all ${Number(r.rentability) >= 0 ? 'bg-green-500/70' : 'bg-red-500/70'}`}
                      style={{ width: `${barW}%` }}
                    />
                  </div>
                  <span className={`w-24 text-right text-sm font-medium ${Number(r.rentability) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {Number(r.rentability).toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
          </div>
        </PageCard>
      )}
    </PageContent>
  );
}
