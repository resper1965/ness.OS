'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';

type Props = {
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  initialValues?: { title?: string; slug?: string; content_markdown?: string };
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
    <form action={formAction} className="max-w-2xl space-y-6">
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
        <input name="title" type="text" required defaultValue={initialValues?.title} className={inputClass} placeholder="Manual de SecOps — Checklist de Deploy" />
        <p className={helpClass}>Nome legível. Aparece no catálogo e no Knowledge Bot.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
        <input name="slug" type="text" required defaultValue={initialValues?.slug} className={inputClass} placeholder="manual-secops-checklist" />
        <p className={helpClass}>Sem espaços ou acentos. Ex.: manual-secops-checklist</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Conteúdo (Markdown)</label>
        <textarea name="content_markdown" rows={16} defaultValue={initialValues?.content_markdown} className={inputClass + ' font-mono'} placeholder="## Pré-requisitos&#10;- Acesso ao ambiente&#10;&#10;## Passo 1&#10;..." />
        <p className={helpClass}>Procedimentos passo a passo. O Knowledge Bot usa esse texto para responder dúvidas.</p>
      </div>
      <div className="flex gap-4">
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
