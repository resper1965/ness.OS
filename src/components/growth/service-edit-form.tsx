'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';

type Props = {
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  service: { name: string; slug: string; playbook_id: string | null; marketing_pitch: string | null; is_active: boolean };
  playbooks: { id: string; title: string }[];
};

export function ServiceEditForm({ action, service, playbooks }: Props) {
  const [state, formAction] = useFormState(action, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white';

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-800/50 bg-green-500/10 p-6 text-green-400">
        Serviço atualizado. <Link href="/app/growth/services" className="underline">Voltar</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Nome</label>
        <input name="name" defaultValue={service.name} required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Slug</label>
        <input name="slug" defaultValue={service.slug} required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Playbook</label>
        <select name="playbook_id" required className={inputClass} defaultValue={service.playbook_id ?? ''}>
          {playbooks.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Pitch</label>
        <textarea name="marketing_pitch" rows={2} defaultValue={service.marketing_pitch ?? ''} className={inputClass} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_active" id="active" defaultChecked={service.is_active} className="rounded border-slate-600 bg-slate-800 text-ness" />
        <label htmlFor="active" className="text-sm text-slate-300">Ativo no site</label>
      </div>
      <div className="flex gap-4">
        <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">Salvar</button>
        <Link href="/app/growth/services" className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancelar</Link>
      </div>
    </form>
  );
}
