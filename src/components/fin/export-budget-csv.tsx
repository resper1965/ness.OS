'use client';

import { exportToCsv } from '@/lib/csv-export';
import { Download } from 'lucide-react';

type BudgetRow = {
  contract_id: string;
  client_name: string;
  revenue: number;
  budgeted_cost: number;
  actual_cost: number;
  cost_variance: number;
};

export function ExportBudgetCsv({ data }: { data: BudgetRow[] }) {
  const handleExport = () => {
    exportToCsv(
      data,
      [
        { key: 'client_name', header: 'Cliente' },
        { key: 'revenue', header: 'Receita' },
        { key: 'budgeted_cost', header: 'Custo Orçado' },
        { key: 'actual_cost', header: 'Custo Real' },
        { key: 'cost_variance', header: 'Variância' },
      ],
      `ness.FIN-budget-vs-actual-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={data.length === 0}
      className="flex items-center gap-2 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-600 disabled:opacity-50 transition-colors"
    >
      <Download className="w-4 h-4" />
      Exportar CSV
    </button>
  );
}
