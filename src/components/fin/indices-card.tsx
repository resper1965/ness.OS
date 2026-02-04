'use client';

/**
 * Bloco informativo de índices ness.DATA (PTAX, IPCA, IGP-M) para precificação e reajuste.
 * Exibido na página de Contratos (ness.FIN) para validar integração e apoiar decisão de MRR/reajuste.
 */

export type IndicesData = {
  dollar: { buy: number; sell: number; date: string; dataHoraCotacao?: string } | null;
  ipca: { value: number; date: string } | null;
  igpm: { value: number; date: string } | null;
};

type Props = { indices: IndicesData };

function formatBrl(n: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

function formatPct(n: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + '%';
}

function formatDate(s: string): string {
  try {
    return new Date(s + 'T12:00:00').toLocaleDateString('pt-BR');
  } catch {
    return s;
  }
}

export function IndicesCard({ indices }: Props) {
  const { dollar, ipca, igpm } = indices;
  const hasAny = dollar != null || ipca != null || igpm != null;
  if (!hasAny) return null;

  return (
    <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <h3 className="text-sm font-medium text-slate-300 mb-3">Referência para precificação e reajuste (ness.DATA)</h3>
      <div className="flex flex-wrap gap-6 text-sm">
        {dollar != null && (
          <div>
            <span className="text-slate-500">PTAX (dólar)</span>
            <span className="ml-2 text-slate-200">
              Compra {formatBrl(dollar.buy)} · Venda {formatBrl(dollar.sell)}
            </span>
            <span className="ml-2 text-slate-500">({formatDate(dollar.date)})</span>
          </div>
        )}
        {ipca != null && (
          <div>
            <span className="text-slate-500">IPCA</span>
            <span className="ml-2 text-slate-200">{formatPct(ipca.value)}</span>
            <span className="ml-2 text-slate-500">({formatDate(ipca.date)})</span>
          </div>
        )}
        {igpm != null && (
          <div>
            <span className="text-slate-500">IGP-M</span>
            <span className="ml-2 text-slate-200">{formatPct(igpm.value)}</span>
            <span className="ml-2 text-slate-500">({formatDate(igpm.date)})</span>
          </div>
        )}
      </div>
    </div>
  );
}
