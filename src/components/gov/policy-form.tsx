'use client';

import { useFormState } from 'react-dom';

type Props = {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  policyId?: string;
  defaultTitle?: string;
  defaultSlug?: string;
  defaultContent?: string;
};

export function PolicyForm({ action, policyId, defaultTitle = '', defaultSlug = '', defaultContent = '' }: Props) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {policyId && <input type="hidden" name="id" value={policyId} />}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Título</label>
        <input id="title" name="title" defaultValue={defaultTitle} required className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder-slate-500" placeholder="Ex.: Política de Segurança" />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-slate-300 mb-1">Slug</label>
        <input id="slug" name="slug" defaultValue={defaultSlug} className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder-slate-500" placeholder="opcional" />
      </div>
      <div>
        <label htmlFor="content_text" className="block text-sm font-medium text-slate-300 mb-1">Conteúdo</label>
        <textarea id="content_text" name="content_text" defaultValue={defaultContent} rows={10} className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder-slate-500" placeholder="Texto da política..." />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      {state?.success && <p className="text-green-400 text-sm">Salvo.</p>}
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">Salvar</button>
    </form>
  );
}
