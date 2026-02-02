'use client';

import { useFormState } from 'react-dom';
import { saveMetric } from '@/app/actions/metricas';

type Contract = { id: string; mrr: number; client_id: string; clients: { name: string } | { name: string }[] | null };
type Metric = { id: string; contract_id: string; month: string; hours_worked: number; cost_input: number; sla_achieved: boolean };

type Props = {
  contracts: Contract[];
  recentMetrics: Metric[];
};

export function MetricasForm({ contracts, recentMetrics }: Props) {
  const [state, formAction] = useFormState(saveMetric, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white';
  const helpClass = 'text-xs text-slate-500 mt-1';

  return (
    <div className="space-y-8">
      <form action={formAction} className="max-w-md space-y-4 rounded-lg border border-slate-700 p-6">
        <h2 className="font-semibold text-slate-200">Registrar métrica</h2>
        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
        {state?.success && <p className="text-sm text-green-400">Salvo.</p>}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Contrato</label>
          <select name="contract_id" required className={inputClass}>
            <option value="">Selecione</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {((c.clients as { name?: string } | { name?: string }[] | null) && (Array.isArray(c.clients) ? c.clients[0]?.name : (c.clients as { name?: string }).name)) ?? c.id.slice(0, 8)}
              </option>
            ))}
          </select>
          <p className={helpClass}>Contrato que receberá a métrica.</p>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-2">Mês (YYYY-MM)</label>
          <input name="month" type="month" required className={inputClass} />
          <p className={helpClass}>Mês ao qual se referem horas e custos.</p>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-2">Horas Humanas Gastas</label>
          <input name="hours_worked" type="number" step="0.5" defaultValue="0" className={inputClass} placeholder="40" />
          <p className={helpClass}>Horas efetivas no contrato no mês. Pode ser decimal (ex.: 37,5).</p>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-2">Custo Hora (R$)</label>
          <input name="hourly_rate" type="number" step="0.01" defaultValue="0" className={inputClass} placeholder="150.00" />
          <p className={helpClass}>Custo por hora para cálculo: Margem = MRR - (Horas × Custo Hora + Custo Cloud).</p>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-2">Custo Cloud (R$)</label>
          <input name="cost_input" type="number" step="0.01" defaultValue="0" className={inputClass} placeholder="2500.00" />
          <p className={helpClass}>Custo de infraestrutura cloud e outros que reduzem a rentabilidade.</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="sla_achieved" id="sla" defaultChecked className="rounded border-slate-600 bg-slate-800 text-ness" />
          <label htmlFor="sla" className="text-sm text-slate-300">SLA atingido</label>
        </div>
        <p className={helpClass}>Marque se o SLA do contrato foi cumprido no mês.</p>
        <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
          Salvar
        </button>
      </form>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
        <h2 className="font-semibold text-slate-200 p-4">Métricas recentes</h2>
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-2">Contrato</th>
              <th className="px-4 py-2">Mês</th>
              <th className="px-4 py-2">Horas</th>
              <th className="px-4 py-2">Custo</th>
              <th className="px-4 py-2">SLA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-400">
            {recentMetrics.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-2">{m.contract_id.slice(0, 8)}...</td>
                <td className="px-4 py-2">{m.month}</td>
                <td className="px-4 py-2">{m.hours_worked}</td>
                <td className="px-4 py-2">R$ {m.cost_input}</td>
                <td className="px-4 py-2">{m.sla_achieved ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {recentMetrics.length === 0 && (
          <p className="p-4 text-slate-400">Nenhuma métrica registrada.</p>
        )}
      </div>
    </div>
  );
}
