'use client';

import Link from 'next/link';
import {
  Wallet,
  FileText,
  Percent,
  AlertTriangle,
  CalendarClock,
  Calendar,
  AlertCircle,
  PieChart,
  Receipt,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CfoDashboardData } from '@/app/actions/fin';

const iconClass = 'mr-3 inline size-7 shrink-0 rounded-md border border-slate-600 p-1.5 text-slate-400';

type CfoKpiCardsProps = {
  data: CfoDashboardData;
};

/**
 * KPI cards da Visão CFO, inspirados no layout do dashboard finance do clone (resper1965/clone).
 * Estrutura: Card com ícone no título, valor em destaque, subtítulo opcional.
 * @see https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/finance
 */
export function CfoKpiCards({ data: cfo }: CfoKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <Wallet className={iconClass} />
            MRR total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-ness lg:text-3xl">
            R$ {cfo.mrrTotal.toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <FileText className={iconClass} />
            Contratos / Clientes ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {cfo.contractCount} / {cfo.activeClientsCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <Percent className={iconClass} />
            Margem média
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {cfo.marginAvgPct != null ? `${cfo.marginAvgPct.toFixed(1)}%` : '—'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <AlertTriangle className={iconClass} />
            Contratos margem negativa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-semibold tracking-tight lg:text-3xl ${
              cfo.contractsNegativeMarginCount > 0 ? 'text-amber-400' : 'text-white'
            }`}
          >
            {cfo.contractsNegativeMarginCount} ({cfo.contractsNegativeMarginPct.toFixed(0)}%)
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <CalendarClock className={iconClass} />
            Renovação (30 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            R$ {cfo.renewalPipeline30.toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <Calendar className={iconClass} />
            Renovação / Vencimento (90 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            R$ {cfo.renewalPipeline90.toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <AlertCircle className={iconClass} />
            Alertas reconciliação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-semibold tracking-tight lg:text-3xl ${
              cfo.reconciliationAlertsCount > 0 ? 'text-amber-400' : 'text-white'
            }`}
          >
            {cfo.reconciliationAlertsCount}
          </div>
          {cfo.reconciliationAlertsCount > 0 && (
            <p className="mt-1 text-xs text-slate-500">MRR vs faturamento Omie (mês)</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <PieChart className={iconClass} />
            Top 5 = % do MRR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {cfo.top5ConcentrationPct.toFixed(0)}%
          </div>
          <p className="mt-1 text-xs text-slate-500">Concentração de receita</p>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <Receipt className={iconClass} />
            MRR vs Faturado Omie (mês)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm text-slate-400">
            Reconhecido: R$ {cfo.mrrRecognized.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-slate-400">
            Omie: {cfo.omieRevenueMonth != null ? `R$ ${cfo.omieRevenueMonth.toLocaleString('pt-BR')}` : '—'}
          </p>
          <p
            className={`text-sm font-medium ${
              cfo.deltaRevenue !== 0 ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            Delta: R$ {cfo.deltaRevenue.toLocaleString('pt-BR')}
            {cfo.deltaRevenuePct != null
              ? ` (${cfo.deltaRevenuePct >= 0 ? '+' : ''}${cfo.deltaRevenuePct.toFixed(1)}%)`
              : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <Scale className={iconClass} />
            Exposição a reajuste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {cfo.adjustmentExposedCount} contr.
          </div>
          <p className="mt-1 text-sm text-slate-400">
            R$ {cfo.adjustmentExposedMrr.toLocaleString('pt-BR')} de MRR
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <RefreshCw className={iconClass} />
            Último sync Omie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-white">
            {cfo.lastErpSync.date ?? '—'}
          </div>
          {cfo.lastErpSync.status && (
            <p className="mt-1 text-xs text-slate-500">{cfo.lastErpSync.status}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const linkButtonBase =
  'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

/**
 * Header da seção Visão CFO, no estilo do finance dashboard do clone:
 * título à esquerda, ações (links) à direita.
 * @see https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/finance
 */
export function CfoDashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 id="cfo-heading" className="text-xl font-bold tracking-tight text-slate-200 lg:text-2xl">
        Visão CFO
      </h2>
      <div className="flex items-center gap-2">
        <Link
          href="/app/fin"
          className={cn(
            linkButtonBase,
            'border border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white'
          )}
        >
          ness.FIN
        </Link>
        <Link
          href="/app/fin/relatorios"
          className={cn(linkButtonBase, 'bg-ness text-white hover:bg-ness/90')}
        >
          Relatórios
        </Link>
      </div>
    </div>
  );
}
