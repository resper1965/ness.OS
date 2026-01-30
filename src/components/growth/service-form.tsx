'use client';

import { useFormState } from 'react-dom';
import { createService } from '@/app/actions/admin-services';

type Props = { playbooks: { id: string; title: string }[] };

export function ServiceForm({ playbooks }: Props) {
  const [state, formAction] = useFormState(createService, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white';

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-lg border border-slate-700 p-6 mb-8">
      <h2 className="font-semibold text-slate-200">Novo serviço</h2>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Serviço criado.</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Nome</label>
        <input name="name" type="text" required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Slug</label>
        <input name="slug" type="text" required placeholder="n-secops" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Playbook (obrigatório)</label>
        <select name="playbook_id" required className={inputClass}>
          <option value="">Selecione</option>
          {playbooks.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Pitch</label>
        <textarea name="marketing_pitch" rows={2} className={inputClass} />
      </div>
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
        Criar serviço
      </button>
    </form>
  );
}
