import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ExportBudgetCsv } from '@/components/fin/export-budget-csv';

type BudgetRow = {
  contract_id: string;
  client_name: string;
  revenue: number;
  budgeted_cost: number;
  actual_cost: number;
  cost_variance: number;
};

export default async function BudgetReportPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from('v_contract_budget_vs_actual')
    .select('*')
    .order('cost_variance', { ascending: true });

  const data = (rows ?? []) as BudgetRow[];

  // Totais do Dashboard
  const totalRevenue = data.reduce((acc, r) => acc + Number(r.revenue), 0);
  const totalBudget = data.reduce((acc, r) => acc + Number(r.budgeted_cost), 0);
  const totalActual = data.reduce((acc, r) => acc + Number(r.actual_cost), 0);
  const totalVariance = totalBudget - totalActual;

  return (
    <PageContent>
      <div className="flex justify-between items-center mb-6">
        <AppPageHeader
          title="Relatório: Orçado vs Real"
          subtitle="Analise a variância entre o custo planejado (Service Actions no contrato) e o custo real capturado no Timer."
        />
        <ExportBudgetCsv data={data} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <PageCard className="p-4 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Receita Total</p>
              <p className="text-xl font-bold text-slate-100">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </PageCard>

        <PageCard className="p-4 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Orçado (Budget)</p>
              <p className="text-xl font-bold text-slate-100">R$ {totalBudget.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </PageCard>

        <PageCard className="p-4 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingDown className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Real (Actual)</p>
              <p className="text-xl font-bold text-slate-100">R$ {totalActual.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </PageCard>

        <PageCard className={`p-4 bg-slate-800/50 border-l-4 ${totalVariance >= 0 ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${totalVariance >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <DollarSign className={`w-5 h-5 ${totalVariance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Variância Total</p>
              <p className={`text-xl font-bold ${totalVariance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ {totalVariance.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </PageCard>
      </div>

      <PageCard title="Análise por Contrato">
        <DataTable<BudgetRow>
          data={data}
          keyExtractor={(row) => row.contract_id}
          emptyMessage="Nenhum dado de orçamento vinculado aos contratos."
          columns={[
            {
              key: 'client_name',
              header: 'Cliente',
            },
            {
              key: 'revenue',
              header: 'Receita',
              render: (row) => `R$ ${Number(row.revenue).toLocaleString('pt-BR')}`
            },
            {
              key: 'budgeted_cost',
              header: 'Budget (Previsto)',
              render: (row) => (
                <span className="text-slate-300">
                  R$ {Number(row.budgeted_cost).toLocaleString('pt-BR')}
                </span>
              )
            },
            {
              key: 'actual_cost',
              header: 'Actual (Real)',
              render: (row) => (
                <span className="text-slate-100 font-mono">
                  R$ {Number(row.actual_cost).toLocaleString('pt-BR')}
                </span>
              )
            },
            {
              key: 'cost_variance',
              header: 'Variância',
              render: (row) => {
                const isPositive = Number(row.cost_variance) >= 0;
                return (
                  <span className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''} R$ {Number(row.cost_variance).toLocaleString('pt-BR')}
                  </span>
                );
              }
            },
            {
              key: 'status',
              header: 'Eficiência',
              render: (row) => {
                const budget = Number(row.budgeted_cost);
                const actual = Number(row.actual_cost);
                if (budget === 0) return '-';
                const efficiency = (1 - (actual / budget)) * 100;
                return (
                  <div className="flex flex-col gap-1">
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${efficiency >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, Math.max(0, efficiency + 50))}%` }}
                      />
                    </div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      {efficiency.toFixed(1)}% {efficiency >= 0 ? 'Abaixo do Budget' : 'Acima do Budget'}
                    </span>
                  </div>
                );
              }
            }
          ]}
        />
      </PageCard>
    </PageContent>
  );
}
