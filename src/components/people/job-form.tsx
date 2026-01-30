'use client';

import { useFormState } from 'react-dom';
import { createJob } from '@/app/actions/jobs';

export function JobForm() {
  const [state, formAction] = useFormState(createJob, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500';
  const helpClass = 'text-xs text-slate-500 mt-1';

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-lg border border-slate-700 p-6 mb-8">
      <h2 className="font-semibold text-slate-200">Nova vaga</h2>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Vaga criada.</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Título</label>
        <input name="title" type="text" required className={inputClass} placeholder="Desenvolvedor Full Stack" />
        <p className={helpClass}>Título exibido em /carreiras.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Slug</label>
        <input name="slug" type="text" required placeholder="desenvolvedor-fullstack" className={inputClass} />
        <p className={helpClass}>Minúsculo, hífens. Ex.: desenvolvedor-fullstack</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Departamento</label>
        <input name="department" type="text" className={inputClass} placeholder="Tecnologia" />
        <p className={helpClass}>Ex.: Tecnologia, Comercial, OPS</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Descrição (HTML)</label>
        <textarea name="description_html" rows={6} className={inputClass} placeholder="<p>Procuramos desenvolvedor...</p>" />
        <p className={helpClass}>Conteúdo da página da vaga. HTML permitido.</p>
      </div>
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
        Criar vaga
      </button>
    </form>
  );
}
