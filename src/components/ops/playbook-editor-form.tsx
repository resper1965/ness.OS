'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';

type Props = {
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  initialValues?: {
    id?: string;
    title?: string;
    slug?: string;
    content_markdown?: string;
    tags?: string[] | null;
    last_reviewed_at?: string | null;
    estimated_duration_minutes?: number | null;
    estimated_value?: number | null;
  };
};

export function PlaybookEditorForm({ action, initialValues }: Props) {
  const [state, formAction] = useFormState(action, {});
  const inputClass =
    'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ness';
  const helpClass = 'text-xs text-slate-500 mt-1';

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-800/50 bg-green-500/10 p-6 text-green-400">
        Playbook salvo. <Link href="/app/ops/playbooks" className="underline">Voltar</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-4xl space-y-8">
      {initialValues?.id && <input type="hidden" name="_id" value={initialValues.id} />}
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Título</label>
        <input name="title" type="text" required defaultValue={initialValues?.title} className={inputClass} placeholder="Manual de SecOps — Checklist de Deploy" />
        <p className={helpClass}>Nome legível. Aparece no catálogo e no Knowledge Bot.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Slug</label>
        <input name="slug" type="text" required defaultValue={initialValues?.slug} className={inputClass} placeholder="manual-secops-checklist" />
        <p className={helpClass}>Sem espaços ou acentos. Ex.: manual-secops-checklist</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Tags</label>
        <input name="tags" type="text" defaultValue={Array.isArray(initialValues?.tags) ? initialValues.tags.join(', ') : ''} className={inputClass} placeholder="deploy, backup, secops" />
        <p className={helpClass}>Separadas por vírgula. Ex.: deploy, backup, secops</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Data de Revisão</label>
        <input name="last_reviewed_at" type="date" defaultValue={initialValues?.last_reviewed_at ?? ''} className={inputClass} />
        <p className={helpClass}>Última vez que o manual foi revisado.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Estimativa duração (min)</label>
          <input name="estimated_duration_minutes" type="number" min="0" step="1" defaultValue={initialValues?.estimated_duration_minutes ?? ''} className={inputClass} placeholder="60" />
          <p className={helpClass}>Métrica temporal: tempo estimado do playbook em minutos.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Estimativa valor (R$)</label>
          <input name="estimated_value" type="number" min="0" step="0.01" defaultValue={initialValues?.estimated_value ?? ''} className={inputClass} placeholder="0.00" />
          <p className={helpClass}>Métrica valor: estimativa em reais (custo ou preço de referência).</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Conteúdo (Markdown)</label>
        <textarea name="content_markdown" rows={16} defaultValue={initialValues?.content_markdown} className={inputClass + ' font-mono'} placeholder="## Pré-requisitos&#10;- Acesso ao ambiente&#10;&#10;## Passo 1&#10;..." />
        <p className={helpClass}>Procedimentos passo a passo. O Knowledge Bot usa esse texto para responder dúvidas.</p>
      </div>
      <div className="flex gap-4 mt-8">
        <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
          Salvar
        </button>
        <Link href="/app/ops/playbooks" className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
