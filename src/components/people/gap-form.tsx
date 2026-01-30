'use client';

import { useFormState } from 'react-dom';
import { createGap } from '@/app/actions/gaps';

type Props = { profiles?: { id: string; full_name: string | null }[] };

export function GapForm({ profiles = [] }: Props) {
  const [state, formAction] = useFormState(createGap, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white';

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-lg border border-slate-700 p-6 mb-8">
      <h2 className="font-semibold text-slate-200">Registrar gap</h2>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Gap registrado.</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Colaborador</label>
        <select name="employee_id" required className={inputClass}>
          <option value="">Selecione</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.full_name ?? p.id.slice(0, 8)}</option>
          ))}
        </select>
        {profiles.length === 0 && <p className="text-xs text-slate-500 mt-1">Cadastre usuários no Auth para listar.</p>}
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Descrição</label>
        <textarea name="description" rows={3} required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Severidade</label>
        <select name="severity" className={inputClass}>
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">Registrar</button>
    </form>
  );
}
