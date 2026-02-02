'use client';

import { useFormState } from 'react-dom';
import { createService } from '@/app/actions/growth';

type Props = { playbooks: { id: string; title: string }[] };

export function ServiceForm({ playbooks }: Props) {
  const [state, formAction] = useFormState(createService, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500';
  const helpClass = 'text-xs text-slate-500 mt-1';

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-lg border border-slate-700 p-6 mb-8">
      <h2 className="font-semibold text-slate-200">Novo serviço</h2>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Serviço criado.</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Nome</label>
        <input name="name" type="text" required className={inputClass} placeholder="N-SecOps" />
        <p className={helpClass}>Nome exibido em /solucoes.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Slug</label>
        <input name="slug" type="text" required placeholder="n-secops" className={inputClass} />
        <p className={helpClass}>Minúsculo, hífens. Ex.: n-secops</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Playbook (obrigatório)</label>
        <select name="playbook_id" required className={inputClass}>
          <option value="">Selecione</option>
          {playbooks.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        <p className={helpClass}>Serviço ativo exige playbook. Trava Growth×OPS.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Título (site)</label>
        <input name="marketing_title" type="text" className={inputClass} placeholder="N-SecOps — Segurança Operacional" />
        <p className={helpClass}>Título em /solucoes/[slug]. Se vazio, usa o nome.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Corpo (site)</label>
        <textarea name="marketing_body" rows={6} className={inputClass} placeholder="Conteúdo completo da página. Markdown suportado." />
        <p className={helpClass}>Conteúdo principal da página do serviço no site público.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Pitch</label>
        <textarea name="marketing_pitch" rows={2} className={inputClass} placeholder="Segurança e compliance automatizados." />
        <p className={helpClass}>1–2 frases. Aparece nos cards de soluções.</p>
      </div>
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
        Criar serviço
      </button>
    </form>
  );
}
