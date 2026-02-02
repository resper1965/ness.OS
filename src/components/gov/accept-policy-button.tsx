'use client';

import { acceptPolicyVersion } from '@/app/actions/gov';
import { useTransition } from 'react';

type Props = { policyVersionId: string };

export function AcceptPolicyButton({ policyVersionId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      acceptPolicyVersion(policyVersionId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-md bg-ness px-3 py-1.5 text-sm font-medium text-white hover:bg-ness-600 disabled:opacity-50"
    >
      {isPending ? '...' : 'Registrar aceite'}
    </button>
  );
}
