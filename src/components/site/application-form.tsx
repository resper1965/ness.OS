'use client';

import { useFormState } from 'react-dom';
import { submitApplication } from '@/app/actions/job-application';

type Props = { jobId: string };

export function ApplicationForm({ jobId }: Props) {
  const [state, formAction] = useFormState(submitApplication, {});
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500';
  const helpClass = 'text-xs text-slate-500 mt-1';

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="job_id" value={jobId} />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Candidatura enviada!</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Nome</label>
        <input name="candidate_name" type="text" required className={inputClass} placeholder="Maria Santos" />
        <p className={helpClass}>Nome como aparece no currículo.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">E-mail</label>
        <input name="candidate_email" type="email" required className={inputClass} placeholder="maria.santos@email.com" />
        <p className={helpClass}>Usaremos para contato sobre a vaga.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">LinkedIn (opcional)</label>
        <input name="linkedin_url" type="url" className={inputClass} placeholder="https://linkedin.com/in/mariasantos" />
        <p className={helpClass}>Opcional — acelera a análise.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Mensagem (opcional)</label>
        <textarea name="message" rows={4} className={inputClass} placeholder="Tenho 5 anos em DevOps. Busco oportunidade em times com cultura de infraestrutura como código." />
        <p className={helpClass}>Destaque experiências relevantes à vaga.</p>
      </div>
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
        Enviar candidatura
      </button>
    </form>
  );
}
