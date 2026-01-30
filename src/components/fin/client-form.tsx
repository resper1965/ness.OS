'use client';

import { useFormState } from 'react-dom';
import { addClient } from '@/app/actions/clients';

export function ClientForm() {
  const [state, formAction] = useFormState(addClient, {});

  return (
    <form action={formAction} className="inline-flex flex-wrap items-end gap-2 mb-6">
      <div>
        <label htmlFor="client-name" className="block text-xs text-slate-400 mb-1">Cliente</label>
        <input
          id="client-name"
          name="name"
          type="text"
          placeholder="Empresa XYZ Ltda"
          required
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white w-48 placeholder:text-slate-500"
        />
        <p className="text-xs text-slate-500 mt-1 w-48">Razão social ou nome fantasia.</p>
      </div>
      <button type="submit" className="rounded-md bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600">
        Adicionar cliente
      </button>
      {state?.success && <span className="text-green-400 text-sm">Cliente adicionado.</span>}
      {state?.error && <span className="text-red-400 text-sm">{state.error}</span>}
    </form>
  );
}
