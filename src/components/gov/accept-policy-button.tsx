'use client';

import { acceptPolicyVersion } from '@/app/actions/gov';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { PrimaryButton } from '@/components/shared/primary-button';

type Props = { policyVersionId: string };

export function AcceptPolicyButton({ policyVersionId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await acceptPolicyVersion(policyVersionId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Aceite registrado.');
      router.refresh();
    });
  };

  return (
    <PrimaryButton
      type="button"
      as="button"
      onClick={handleClick}
      loading={isPending}
      disabled={isPending}
    >
      Registrar aceite
    </PrimaryButton>
  );
}
