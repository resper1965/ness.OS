'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { createContract } from '@/app/actions/fin';
import { InputField } from '@/components/shared/input-field';
import { PrimaryButton } from '@/components/shared/primary-button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" as="button" loading={pending}>
      Criar contrato
    </PrimaryButton>
  );
}

type Props = { clients: { id: string; name: string }[] };

const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500';
const helpClass = 'text-xs text-slate-500 mt-1';

export function ContractForm({ clients }: Props) {
  const [state, formAction] = useFormState(createContract, {});

  useEffect(() => {
    if (state?.success) toast.success('Contrato criado.');
    if (state?.error) toast.error(state.error);
  }, [state?.success, state?.error]);

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-lg border border-slate-700 p-6 mb-8">
      <h2 className="font-semibold text-slate-200">Novo contrato</h2>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Contrato criado.</p>}
      <InputField
        id="contract-client"
        label="Cliente"
        name="client_id"
        as="select"
        required
        helper="Adicione o cliente antes, se necessário."
      >
        <option value="">Selecione</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </InputField>
      <InputField
        id="contract-mrr"
        label="MRR (R$)"
        name="mrr"
        type="number"
        step="0.01"
        required
        placeholder="5000.00"
        helper="Valor que o cliente paga por mês."
      />
      <div>
        <label className="block text-sm text-slate-300 mb-2" htmlFor="contract-start">Data início</label>
        <input id="contract-start" name="start_date" type="date" className={inputClass} />
        <p className={helpClass}>Quando o contrato passa a valer.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2" htmlFor="contract-end">Data fim</label>
        <input id="contract-end" name="end_date" type="date" className={inputClass} />
        <p className={helpClass}>Opcional — deixe vazio se indefinido.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2" htmlFor="contract-renewal">Data Renovação</label>
        <input id="contract-renewal" name="renewal_date" type="date" className={inputClass} />
        <p className={helpClass}>Quando o contrato deve ser renovado.</p>
      </div>
      <InputField
        id="contract-adjustment"
        label="Índice Reajuste"
        name="adjustment_index"
        as="select"
        helper="Índice para reajuste anual (ex.: IGPM, IPCA)."
      >
        <option value="">Nenhum</option>
        <option value="IGPM">IGPM</option>
        <option value="IPCA">IPCA</option>
      </InputField>
      <SubmitButton />
    </form>
  );
}
