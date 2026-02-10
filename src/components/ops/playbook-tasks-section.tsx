'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { createTask, deleteTaskFromForm, moveTaskUpFromForm, moveTaskDownFromForm, type TaskRow } from '@/app/actions/ops';

const inputClass =
  'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ness';

type Props = {
  playbookId: string;
  tasks: TaskRow[];
};

export function PlaybookTasksSection({ playbookId, tasks }: Props) {
  const [state, formAction] = useFormState(createTask, {});

  return (
    <section className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Tasks (composição)</h2>
      <p className="text-sm text-slate-500 mb-4">
        Menor unidade do playbook. Cada task deve ter ao menos uma métrica: duração (min) ou valor (R$).
      </p>

      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500 mb-4">Nenhuma task. Adicione abaixo.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {tasks.map((t, index) => (
            <li key={t.id} className="flex items-center justify-between gap-4 rounded-md border border-slate-600 bg-slate-800 px-4 py-3">
              <div>
                <span className="font-medium text-slate-200">{t.title}</span>
                <span className="text-slate-500 text-sm ml-2">
                  {t.estimated_duration_minutes != null && `${t.estimated_duration_minutes} min`}
                  {t.estimated_duration_minutes != null && t.estimated_value != null && ' · '}
                  {t.estimated_value != null && `R$ ${Number(t.estimated_value).toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <form action={moveTaskUpFromForm as unknown as (fd: FormData) => Promise<void>} className="inline">
                  <input type="hidden" name="task_id" value={t.id} />
                  <button type="submit" title="Subir" className="text-slate-500 hover:text-ness disabled:opacity-40" disabled={index === 0}>
                    ↑
                  </button>
                </form>
                <form action={moveTaskDownFromForm as unknown as (fd: FormData) => Promise<void>} className="inline">
                  <input type="hidden" name="task_id" value={t.id} />
                  <button type="submit" title="Descer" className="text-slate-500 hover:text-ness disabled:opacity-40" disabled={index === tasks.length - 1}>
                    ↓
                  </button>
                </form>
                <Link href={`/app/ops/playbooks/${playbookId}/tasks/${t.id}`} className="text-xs text-slate-500 hover:text-ness">
                  Editar
                </Link>
                <form action={deleteTaskFromForm as unknown as (fd: FormData) => Promise<void>} className="inline">
                <input type="hidden" name="task_id" value={t.id} />
                <button type="submit" className="text-xs text-slate-500 hover:text-red-400">
                  Excluir
                </button>
              </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="space-y-3 max-w-xl">
        <input type="hidden" name="playbook_id" value={playbookId} />
        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
        {state?.success && <p className="text-sm text-green-400">Task adicionada.</p>}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Título</label>
          <input name="title" type="text" required className={inputClass} placeholder="Revisar backup" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Duração (min)</label>
            <input name="estimated_duration_minutes" type="number" min="0" step="1" className={inputClass} placeholder="30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Valor (R$)</label>
            <input name="estimated_value" type="number" min="0" step="0.01" className={inputClass} placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Descrição (opcional)</label>
          <textarea name="description" rows={2} className={inputClass} placeholder="Descrição da task" />
        </div>
        <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
          Adicionar task
        </button>
      </form>
    </section>
  );
}
