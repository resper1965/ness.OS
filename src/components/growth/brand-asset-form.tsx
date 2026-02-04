'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { createBrandAssetFromForm } from '@/app/actions/growth';
import { InputField } from '@/components/shared/input-field';
import { PrimaryButton } from '@/components/shared/primary-button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" as="button" loading={pending}>
      Adicionar asset
    </PrimaryButton>
  );
}

export function BrandAssetForm() {
  const [state, formAction] = useFormState(createBrandAssetFromForm, {});

  useEffect(() => {
    if (state?.success) toast.success('Asset adicionado.');
    if (state?.error) toast.error(state.error);
  }, [state?.success, state?.error]);

  return (
    <form action={formAction} className="flex flex-wrap gap-4 items-end max-w-2xl">
      <InputField
        id="brand-asset-name"
        label="Nome"
        name="name"
        required
        placeholder="Ex.: Logo principal"
      />
      <InputField
        id="brand-asset-type"
        label="Tipo"
        name="asset_type"
        as="select"
        helper="Opcional."
      >
        <option value="">—</option>
        <option value="logo">Logo</option>
        <option value="imagem">Imagem</option>
        <option value="documento">Documento</option>
        <option value="outro">Outro</option>
      </InputField>
      <InputField
        id="brand-asset-url"
        label="URL"
        name="url"
        placeholder="https://... ou path no bucket"
        helper="Link externo ou caminho no storage (os-assets)."
      />
      <SubmitButton />
    </form>
  );
}
