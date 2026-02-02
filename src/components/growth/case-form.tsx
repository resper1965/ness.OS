'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';

type Props = {
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  initialValues?: { title?: string; slug?: string; raw_data?: string; summary?: string; content_html?: string; is_published?: boolean };
};

export function CaseForm({ action, initialValues }: Props) {
  const [state, formAction] = useFormState(action, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500';
  const helpClass = 'text-xs text-slate-500 mt-1';

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-800/50 bg-green-500/10 p-6 text-green-400">
        Caso salvo. <Link href="/app/growth/casos" className="underline">Voltar</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
        <input name="title" type="text" required defaultValue={initialValues?.title} className={inputClass} placeholder="Cliente X reduziu 40% de incidentes" />
        <p className={helpClass}>Título do caso de sucesso.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
        <input name="slug" type="text" required defaultValue={initialValues?.slug} className={inputClass} placeholder="cliente-x-reduziu-incidentes" />
        <p className={helpClass}>URL amigável. Minúsculo, hífens.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Dados brutos (raw)</label>
        <textarea name="raw_data" rows={6} defaultValue={initialValues?.raw_data} className={inputClass + ' font-mono text-xs'} placeholder="Dados técnicos do projeto. Será usado pelo Agente de Conteúdo para gerar post." />
        <p className={helpClass}>Dados técnicos para o botão &quot;Transformar Case em Post&quot;.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Resumo</label>
        <textarea name="summary" rows={3} defaultValue={initialValues?.summary} className={inputClass} placeholder="Resumo executivo do caso." />
      </div>
      {!initialValues && (
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_published" id="pub_new" className="rounded border-slate-600 bg-slate-800 text-ness" />
          <label htmlFor="pub_new" className="text-sm text-slate-300">Publicar no site</label>
        </div>
      )}
      {initialValues && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Conteúdo (HTML)</label>
          <textarea name="content_html" rows={10} defaultValue={initialValues?.content_html} className={inputClass + ' font-mono text-xs'} placeholder="<p>Conteúdo da página...</p>" />
        </div>
      )}
      {initialValues && (
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_published" id="pub" defaultChecked={initialValues?.is_published} className="rounded border-slate-600 bg-slate-800 text-ness" />
          <label htmlFor="pub" className="text-sm text-slate-300">Publicar no site</label>
        </div>
      )}
      <div className="flex gap-4">
        <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">Salvar</button>
        <Link href="/app/growth/casos" className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800">Cancelar</Link>
      </div>
    </form>
  );
}
