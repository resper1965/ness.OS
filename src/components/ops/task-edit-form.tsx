'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';

type Props = {
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  playbookId: string;
  initialValues: {
    _task_id: string;
    title: string;
    slug: string;
    description?: string;
    estimated_duration_minutes?: number | null;
    estimated_value?: number | null;
  };
};

const inputClass =
  'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ness';

export function TaskEditForm({ action, playbookId, initialValues }: Props) {
  const [state, formAction] = useFormState(action, {});

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-800/50 bg-green-500/10 p-6 text-green-400">
        Task salva. <Link href={`/app/ops/playbooks/${playbookId}`} className="underline">Voltar ao playbook</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <input type="hidden" name="_task_id" value={initialValues._task_id} />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Título</label>
        <input name="title" type="text" required defaultValue={initialValues.title} className={inputClass} placeholder="Revisar backup" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Slug</label>
        <input name="slug" type="text" defaultValue={initialValues.slug} className={inputClass} placeholder="revisar-backup" />
        <p className="text-xs text-slate-500 mt-1">Único no playbook. Deixe em branco para gerar do título.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Duração (min)</label>
          <input name="estimated_duration_minutes" type="number" min="0" step="1" defaultValue={initialValues.estimated_duration_minutes ?? ''} className={inputClass} placeholder="30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Valor (R$)</label>
          <input name="estimated_value" type="number" min="0" step="0.01" defaultValue={initialValues.estimated_value ?? ''} className={inputClass} placeholder="0.00" />
        </div>
      </div>
      <p className="text-xs text-slate-500">Ao menos uma métrica (duração ou valor) é obrigatória.</p>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Descrição (opcional)</label>
        <textarea name="description" rows={3} defaultValue={initialValues.description ?? ''} className={inputClass} placeholder="Descrição da task" />
      </div>
      <div className="flex gap-4">
        <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
          Salvar
        </button>
        <Link href={`/app/ops/playbooks/${playbookId}`} className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
