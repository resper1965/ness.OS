'use client';

import { useFormState } from 'react-dom';
import { createJob } from '@/app/actions/people';
import { InputField } from '@/components/shared/input-field';

type Contract = { id: string; clients: { name?: string } | { name?: string }[] | null };

type Props = { contracts?: Contract[] };

function getClientName(c: Contract): string {
  const clients = c.clients;
  if (!clients) return 'Sem cliente';
  const name = Array.isArray(clients) ? (clients[0] as { name?: string })?.name : (clients as { name?: string })?.name;
  return name ?? 'Sem nome';
}

export function JobForm({ contracts = [] }: Props) {
  const [state, formAction] = useFormState(createJob, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-lg border border-slate-700 p-6 mb-8">
      <h2 className="font-semibold text-slate-200">Nova vaga</h2>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Vaga criada.</p>}
      <InputField id="job-title" label="Título" name="title" required placeholder="Desenvolvedor Full Stack" />
      <InputField id="job-slug" label="Slug" name="slug" required placeholder="desenvolvedor-fullstack" helper="Minúsculo, hífens. Ex.: desenvolvedor-fullstack" />
      <InputField id="job-department" label="Departamento" name="department" placeholder="Tecnologia" />
      {contracts.length > 0 && (
        <InputField id="job-contract" label="Contrato (opcional)" name="contract_id" as="select" helper="Vincule a vaga a um contrato (ATS).">
          <option value="">Nenhum</option>
          {contracts.map((c) => (
            <option key={c.id} value={c.id}>{getClientName(c)}</option>
          ))}
        </InputField>
      )}
      <div>
        <label htmlFor="job-desc" className="block text-sm font-medium text-slate-300 mb-2">Descrição (HTML)</label>
        <textarea id="job-desc" name="description_html" rows={6} className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500" placeholder="<p>Procuramos desenvolvedor...</p>" />
        <p className="text-xs text-slate-500 mt-1">Conteúdo da página da vaga. HTML permitido.</p>
      </div>
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
        Criar vaga
      </button>
    </form>
  );
}
