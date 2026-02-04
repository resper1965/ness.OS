'use client';

import { useTransition } from 'react';
import { resolveWorkflowApproval } from '@/app/actions/ops';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Props = {
  approvalId: string;
};

export function WorkflowApprovalActions({ approvalId }: Props) {
  const [pending, startTransition] = useTransition();

  const handleResolve = (status: 'approved' | 'rejected') => {
    startTransition(async () => {
      const result = await resolveWorkflowApproval(approvalId, status);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(status === 'approved' ? 'Aprovação registrada.' : 'Rejeição registrada.');
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => handleResolve('approved')}
      >
        Aprovar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => handleResolve('rejected')}
      >
        Rejeitar
      </Button>
    </div>
  );
}
