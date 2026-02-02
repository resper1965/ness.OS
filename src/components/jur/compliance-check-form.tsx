'use client';

import { useFormState } from 'react-dom';
import { createComplianceCheckFromForm } from '@/app/actions/jur';

type Props = {
  frameworks: { id: string; name: string; code: string }[];
  playbooks: { id: string; title: string }[];
};

export function ComplianceCheckForm({ frameworks, playbooks }: Props) {
  const [state, formAction] = useFormState(createComplianceCheckFromForm, { success: false });

  return (
    <form action={formAction} className="flex flex-wrap gap-4 items-end max-w-3xl">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Framework</label>
        <select
          name="framework_id"
          required
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white"
        >
          <option value="">Selecione</option>
          {frameworks.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Processo / Playbook</label>
        <select
          name="process_ref"
          required
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white"
        >
          <option value="">Selecione</option>
          {playbooks.map((p) => (
            <option key={p.id} value={p.title}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
        <select
          name="status"
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white"
        >
          <option value="pending">Pendente</option>
          <option value="ok">OK</option>
          <option value="gap">Gap</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Notas</label>
        <input
          name="notes"
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white w-48"
          placeholder="Opcional"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600"
      >
        Registrar
      </button>
      {state?.error && <p className="text-red-400 text-sm w-full">{state.error}</p>}
      {state?.success && <p className="text-green-400 text-sm w-full">Salvo.</p>}
    </form>
  );
}
