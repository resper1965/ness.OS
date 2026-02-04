'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';

type Contract = { id: string; clients: { name?: string } | { name?: string }[] | null };

type Props = {
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  job: { id?: string; title: string; slug: string; department: string | null; description_html: string | null; is_open: boolean; contract_id?: string | null };
  contracts?: Contract[];
};

function getClientName(c: Contract): string {
  const clients = c.clients;
  if (!clients) return 'Sem cliente';
  const name = Array.isArray(clients) ? (clients[0] as { name?: string })?.name : (clients as { name?: string })?.name;
  return name ?? 'Sem nome';
}

export function JobEditForm({ action, job, contracts = [] }: Props) {
  const [state, formAction] = useFormState(action, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white';

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-800/50 bg-green-500/10 p-6 text-green-400">
        Vaga atualizada. <Link href="/app/people/vagas" className="underline">Voltar</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {job.id && <input type="hidden" name="_id" value={job.id} />}
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-3">Título</label>
        <input name="title" defaultValue={job.title} required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-3">Slug</label>
        <input name="slug" defaultValue={job.slug} required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-3">Departamento</label>
        <input name="department" defaultValue={job.department ?? ''} className={inputClass} />
      </div>
      {contracts.length > 0 && (
        <div>
          <label className="block text-sm text-slate-300 mb-3">Contrato (opcional)</label>
          <select name="contract_id" className={inputClass} defaultValue={job.contract_id ?? ''}>
            <option value="">Nenhum</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>{getClientName(c)}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm text-slate-300 mb-3">Descrição (HTML)</label>
        <textarea name="description_html" rows={6} defaultValue={job.description_html ?? ''} className={inputClass} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_open" id="open" defaultChecked={job.is_open} className="rounded border-slate-600 bg-slate-800 text-ness" />
        <label htmlFor="open" className="text-sm text-slate-300">Vaga aberta</label>
      </div>
      <div className="flex gap-4 mt-6">
        <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">Salvar</button>
        <Link href="/app/people/vagas" className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancelar</Link>
      </div>
    </form>
  );
}
