import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { NessBrand } from '@/components/shared/ness-brand';
import { ErpSyncButton } from '@/components/fin/erp-sync-button';
import { getLastErpSync } from '@/app/actions/data';
import { Database, BarChart3, RefreshCw } from 'lucide-react';

export default async function DataPage() {
  const lastSync = await getLastErpSync();

  return (
    <PageContent>
      <AppPageHeader
        title={<NessBrand suffix="DATA" />}
        subtitle="Camada de dados: ingestão ERP, indicadores e fontes externas."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/app/ops/indicators"
          className="flex items-start gap-3 rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
        >
          <BarChart3 className="h-5 w-5 shrink-0 text-ness" aria-hidden />
          <div>
            <h2 className="mb-1 font-semibold text-white">Indicadores</h2>
            <p className="text-sm text-slate-400">
              Métricas ingeridas via API (Infra, Sec, Data, Custom). Hub centralizado.
            </p>
          </div>
        </Link>
        <div className="flex items-start gap-3 rounded-lg border border-slate-700 p-4">
          <RefreshCw className="h-5 w-5 shrink-0 text-ness" aria-hidden />
          <div className="flex-1">
            <h2 className="mb-1 font-semibold text-white">Sync ERP (Omie)</h2>
            <p className="mb-3 text-sm text-slate-400">
              Sincronização centralizada: clientes, contas a receber/pagar, produtos. Log em erp_sync_log.
            </p>
            <ErpSyncButton lastSync={lastSync} />
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Database className="h-4 w-4" aria-hidden />
          <span className="text-sm">
            ness.DATA é a camada única que colhe e normaliza dados de fontes externas (Omie primeiro).
            Os módulos FIN, OPS, GROWTH e PEOPLE consomem via actions; não integram diretamente com o ERP.
          </span>
        </div>
      </div>
    </PageContent>
  );
}
