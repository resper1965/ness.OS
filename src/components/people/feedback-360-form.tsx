'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { createFeedback360FromForm } from '@/app/actions/people';
import { InputField } from '@/components/shared/input-field';
import { PrimaryButton } from '@/components/shared/primary-button';

type Profile = { id: string; full_name: string | null };

type Props = { profiles: Profile[] };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" as="button" loading={pending}>
      Enviar feedback
    </PrimaryButton>
  );
}

export function Feedback360Form({ profiles }: Props) {
  const [state, formAction] = useFormState(createFeedback360FromForm, {});

  useEffect(() => {
    if (state?.success) toast.success('Feedback 360º registrado.');
    if (state?.error) toast.error(state.error);
  }, [state?.success, state?.error]);

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-lg border border-slate-700 p-6">
      <h2 className="font-semibold text-slate-200">Novo feedback 360º</h2>
      <InputField
        id="feedback-subject"
        label="Colaborador avaliado"
        name="subject_id"
        as="select"
        required
        helper="Quem está sendo avaliado."
      >
        <option value="">Selecione</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>{p.full_name ?? p.id.slice(0, 8)}</option>
        ))}
      </InputField>
      <InputField
        id="feedback-criteria"
        label="Critério"
        name="criteria"
        placeholder="Ex.: Colaboração, Liderança"
        helper="Opcional."
      />
      <InputField
        id="feedback-score"
        label="Score (1 a 5)"
        name="score"
        type="number"
        min={1}
        max={5}
        required
        helper="1 = baixo, 5 = alto."
      />
      <div>
        <label htmlFor="feedback-comment" className="block text-sm font-medium text-slate-300 mb-2">Comentário</label>
        <textarea
          id="feedback-comment"
          name="comment"
          rows={3}
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          placeholder="Opcional"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
