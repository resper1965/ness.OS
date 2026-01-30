'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';

type Props = {
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  job: { title: string; slug: string; department: string | null; description_html: string | null; is_open: boolean };
};

export function JobEditForm({ action, job }: Props) {
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
    <form action={formAction} className="max-w-md space-y-4">
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Título</label>
        <input name="title" defaultValue={job.title} required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Slug</label>
        <input name="slug" defaultValue={job.slug} required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Departamento</label>
        <input name="department" defaultValue={job.department ?? ''} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Descrição (HTML)</label>
        <textarea name="description_html" rows={6} defaultValue={job.description_html ?? ''} className={inputClass} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_open" id="open" defaultChecked={job.is_open} className="rounded border-slate-600 bg-slate-800 text-ness" />
        <label htmlFor="open" className="text-sm text-slate-300">Vaga aberta</label>
      </div>
      <div className="flex gap-4">
        <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">Salvar</button>
        <Link href="/app/people/vagas" className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancelar</Link>
      </div>
    </form>
  );
}
