'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { syncPerformanceMetricsFromTimer } from '@/app/actions/timesheet';
import { PrimaryButton } from '@/components/shared/primary-button';

/**
 * Botão para sincronizar performance_metrics a partir de time_entries (timer).
 * Apenas admin/ops/superadmin podem disparar. Exibido em /app/ops/metricas.
 */
export function SyncTimerMetricsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    try {
      const res = await syncPerformanceMetricsFromTimer();
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(res.updated !== undefined ? `${res.updated} registro(s) atualizado(s) a partir do timer.` : 'Sincronizado.');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <PrimaryButton type="button" as="button" loading={loading} onClick={handleSync}>
      Sincronizar horas do timer
    </PrimaryButton>
  );
}
