'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';

type PostEditorFormProps = {
  action: (prev: unknown, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  initialValues?: {
    title?: string;
    slug?: string;
    seo_description?: string;
    content_markdown?: string;
    is_published?: boolean;
  };
};

export function PostEditorForm({ action, initialValues }: PostEditorFormProps) {
  const [state, formAction] = useFormState(action, {});

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-800/50 bg-green-500/10 p-6 text-green-400">
        Post salvo. <Link href="/app/growth/posts" className="underline">Voltar à lista</Link>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ness';

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={initialValues?.title}
          className={inputClass}
          placeholder="Título do post"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Slug (URL)</label>
        <input
          name="slug"
          type="text"
          required
          defaultValue={initialValues?.slug}
          className={inputClass}
          placeholder="meu-post-url"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Meta description (SEO)</label>
        <textarea
          name="seo_description"
          rows={2}
          defaultValue={initialValues?.seo_description ?? undefined}
          className={inputClass}
          placeholder="Descrição para buscadores"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Conteúdo (Markdown ou HTML)</label>
        <textarea
          name="content_markdown"
          rows={16}
          defaultValue={initialValues?.content_markdown ?? undefined}
          className={inputClass + ' font-mono text-xs'}
          placeholder="# Título&#10;&#10;Conteúdo do post..."
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_published"
          id="is_published"
          defaultChecked={initialValues?.is_published ?? false}
          className="rounded border-slate-600 bg-slate-800 text-ness focus:ring-ness"
        />
        <label htmlFor="is_published" className="text-sm text-slate-300">
          Publicar no site
        </label>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600"
        >
          Salvar
        </button>
        <Link
          href="/app/growth/posts"
          className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
