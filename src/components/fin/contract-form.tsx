'use client';

import { useFormState } from 'react-dom';
import { createContract } from '@/app/actions/contracts';

type Props = { clients: { id: string; name: string }[] };

export function ContractForm({ clients }: Props) {
  const [state, formAction] = useFormState(createContract, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500';
  const helpClass = 'text-xs text-slate-500 mt-1';

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-lg border border-slate-700 p-6 mb-8">
      <h2 className="font-semibold text-slate-200">Novo contrato</h2>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Contrato criado.</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Cliente</label>
        <select name="client_id" required className={inputClass}>
          <option value="">Selecione</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <p className={helpClass}>Adicione o cliente antes, se necessário.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">MRR (R$)</label>
        <input name="mrr" type="number" step="0.01" required className={inputClass} placeholder="5000.00" />
        <p className={helpClass}>Valor que o cliente paga por mês.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Data início</label>
        <input name="start_date" type="date" className={inputClass} />
        <p className={helpClass}>Quando o contrato passa a valer.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Data fim</label>
        <input name="end_date" type="date" className={inputClass} />
        <p className={helpClass}>Opcional — deixe vazio se indefinido.</p>
      </div>
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
        Criar contrato
      </button>
    </form>
  );
}
