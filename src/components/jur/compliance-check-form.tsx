'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { createComplianceCheckFromForm } from '@/app/actions/jur';
import { InputField } from '@/components/shared/input-field';
import { PrimaryButton } from '@/components/shared/primary-button';

type Props = {
  frameworks: { id: string; name: string; code?: string | null }[];
  playbooks: { id: string; title: string; slug: string }[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" as="button" loading={pending}>
      Registrar check
    </PrimaryButton>
  );
}

export function ComplianceCheckForm({ frameworks, playbooks }: Props) {
  const [state, formAction] = useFormState(createComplianceCheckFromForm, { success: false });

  useEffect(() => {
    if (state?.success) toast.success('Check de conformidade registrado.');
    if (state?.error) toast.error(state.error);
  }, [state?.success, state?.error]);

  return (
    <form action={formAction} className="flex flex-wrap gap-4 items-end max-w-3xl">
      <InputField
        id="compliance-framework"
        label="Framework"
        name="framework_id"
        as="select"
        required
        helper="LGPD, Marco Civil, CLT, etc."
      >
        <option value="">Selecione</option>
        {frameworks.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </InputField>
      <InputField
        id="compliance-process"
        label="Processo (playbook)"
        name="process_ref"
        as="select"
        required
        helper="Referência = slug do playbook (estável)."
      >
        <option value="">Selecione</option>
        {playbooks.map((p) => (
          <option key={p.id} value={p.slug}>
            {p.title}
          </option>
        ))}
      </InputField>
      <InputField
        id="compliance-status"
        label="Status"
        name="status"
        as="select"
        helper="ok = em conformidade; gap = lacuna; pending = pendente."
      >
        <option value="pending">Pendente</option>
        <option value="ok">OK</option>
        <option value="gap">Gap</option>
      </InputField>
      <InputField
        id="compliance-notes"
        label="Notas"
        name="notes"
        placeholder="Opcional"
      />
      <SubmitButton />
    </form>
  );
}
