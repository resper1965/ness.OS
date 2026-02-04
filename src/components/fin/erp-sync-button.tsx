'use client';

import { useTransition } from 'react';
import { RefreshCw } from 'lucide-react';
import { syncOmieErp } from '@/app/actions/data';

type LastSync = {
  id: string;
  started_at: string;
  finished_at: string | null;
  status: string;
  record_count: number | null;
  error_message: string | null;
} | null;

export function ErpSyncButton({ lastSync }: { lastSync: LastSync }) {
  const [isPending, startTransition] = useTransition();
  const handleSync = () => {
    startTransition(async () => {
      const result = await syncOmieErp();
      if (result.error) {
        alert(result.error);
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <button
        type="button"
        onClick={handleSync}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
        {isPending ? 'Sincronizando...' : 'Sincronizar ERP (Omie)'}
      </button>
      {lastSync && (
        <div className="text-xs text-slate-400">
          Última sync:{' '}
          {lastSync.finished_at
            ? new Date(lastSync.finished_at).toLocaleString('pt-BR')
            : new Date(lastSync.started_at).toLocaleString('pt-BR')}
          {' · '}
          <span
            className={
              lastSync.status === 'success'
                ? 'text-green-400'
                : lastSync.status === 'error'
                  ? 'text-red-400'
                  : 'text-amber-400'
            }
          >
            {lastSync.status === 'running' ? 'Em andamento' : lastSync.status === 'success' ? 'Sucesso' : 'Erro'}
          </span>
          {lastSync.status === 'success' && lastSync.record_count != null && (
            <> · {lastSync.record_count} registro(s)</>
          )}
          {lastSync.status === 'error' && lastSync.error_message && (
            <span className="block mt-1 text-red-400 truncate max-w-md" title={lastSync.error_message}>
              {lastSync.error_message}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
