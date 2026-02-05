'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GrowthPipelineStage } from '@/app/actions/growth';

type SalesPipelineCardProps = {
  stages: GrowthPipelineStage[];
};

/**
 * Pipeline de vendas (funil de leads), inspirado no CRM do clone.
 * Barra proporcional por estágio + lista com contagem e valor (ganho = MRR).
 */
export function SalesPipelineCard({ stages }: SalesPipelineCardProps) {
  const totalCount = stages.reduce((s, st) => s + st.count, 0);
  const totalValue = stages.reduce((s, st) => s + st.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de leads</CardTitle>
        <CardDescription>Leads por estágio. Ganho = MRR dos contratos.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="mb-6 flex h-4 w-full overflow-hidden rounded-full bg-slate-700">
            {stages.map((stage) => {
              const pct =
                totalCount > 0 ? (stage.count / totalCount) * 100 : 0;
              return (
                <Tooltip key={stage.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`h-full ${stage.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">{stage.name}</p>
                      <p className="text-slate-400 text-xs">{stage.count} leads</p>
                      {stage.value > 0 && (
                        <p className="text-slate-400 text-xs">
                          R$ {stage.value.toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        <div className="space-y-4">
          {stages.map((stage) => {
            const pctCount = totalCount > 0 ? (stage.count / totalCount) * 100 : 0;
            const pctValue = totalValue > 0 && stage.value > 0 ? (stage.value / totalValue) * 100 : 0;
            return (
              <div key={stage.id} className="flex items-center gap-4">
                <div className={`h-3 w-3 shrink-0 rounded-full ${stage.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">{stage.name}</p>
                  <p className="text-slate-400 text-xs">
                    {stage.count} leads
                    {stage.value > 0 && ` · R$ ${stage.value.toLocaleString('pt-BR')}`}
                    {pctValue > 0 && ` (${pctValue.toFixed(0)}%)`}
                  </p>
                </div>
                <div className="flex w-20 items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className={`h-full ${stage.color}`}
                      style={{ width: `${pctCount}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400 text-xs">
                    {pctCount.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
