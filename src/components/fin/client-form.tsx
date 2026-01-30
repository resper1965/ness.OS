'use client';

import { useFormState } from 'react-dom';
import { addClient } from '@/app/actions/clients';

export function ClientForm() {
  const [state, formAction] = useFormState(addClient, {});

  return (
    <form action={formAction} className="inline-flex gap-2 mb-6">
      <input
        name="name"
        type="text"
        placeholder="Nome do cliente"
        required
        className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white w-48"
      />
      <button type="submit" className="rounded-md bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600">
        Adicionar cliente
      </button>
      {state?.success && <span className="text-green-400 text-sm">Cliente adicionado.</span>}
      {state?.error && <span className="text-red-400 text-sm">{state.error}</span>}
    </form>
  );
}
