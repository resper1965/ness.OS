'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { InputField } from '@/components/shared/input-field';
import { PrimaryButton } from '@/components/shared/primary-button';

type Props = {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  policyId?: string;
  defaultTitle?: string;
  defaultSlug?: string;
  defaultContent?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" as="button" loading={pending}>
      Salvar
    </PrimaryButton>
  );
}

const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500';

export function PolicyForm({ action, policyId, defaultTitle = '', defaultSlug = '', defaultContent = '' }: Props) {
  const [state, formAction] = useFormState(action, {});

  useEffect(() => {
    if (state?.success) toast.success('Política salva. Nova versão registrada.');
    if (state?.error) toast.error(state.error);
  }, [state?.success, state?.error]);

  return (
    <form action={formAction} className="max-w-2xl space-y-4 rounded-lg border border-slate-700 p-6">
      {policyId && <input type="hidden" name="id" value={policyId} />}
      <InputField
        id="policy-title"
        label="Título"
        name="title"
        required
        defaultValue={defaultTitle}
        placeholder="Ex.: Política de Segurança"
      />
      <InputField
        id="policy-slug"
        label="Slug"
        name="slug"
        helper="Opcional — usado na URL. Se vazio, derivado do título."
        defaultValue={defaultSlug}
        placeholder="politica-de-seguranca"
      />
      <div>
        <label htmlFor="policy-content" className="block text-sm font-medium text-slate-300 mb-2">Conteúdo</label>
        <textarea
          id="policy-content"
          name="content_text"
          defaultValue={defaultContent}
          rows={10}
          className={inputClass}
          placeholder="Texto da política (markdown ou texto)..."
        />
        <p className="mt-1 text-xs text-slate-500">Ao salvar, uma nova versão é criada para rastreabilidade.</p>
      </div>
      <SubmitButton />
    </form>
  );
}
