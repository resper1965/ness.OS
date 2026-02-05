'use client';

import {
  Users2,
  FileText,
  Wallet,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GrowthDashboardData } from '@/app/actions/growth';

const iconClass = 'mr-3 inline size-7 shrink-0 rounded-md border border-slate-600 p-1.5 text-slate-400';

type GrowthDashboardCardsProps = {
  data: GrowthDashboardData;
};

/**
 * KPI cards do Dashboard Comercial (ness.GROWTH), inspirados no CRM do clone.
 * Índices C-level: base de clientes (Omie), contratos, receita, faturamento Omie, leads.
 */
export function GrowthDashboardCards({ data }: GrowthDashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <Users2 className={iconClass} />
            Total clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-ness lg:text-3xl">
            {data.totalCustomers.toLocaleString('pt-BR')}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {data.totalCustomersOmie} sincronizados com Omie
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <FileText className={iconClass} />
            Contratos ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {data.totalDeals}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <Wallet className={iconClass} />
            Receita (MRR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            R$ {data.totalRevenue.toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <TrendingUp className={iconClass} />
            Faturado Omie (mês)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {data.omieRevenueMonth != null
              ? `R$ ${data.omieRevenueMonth.toLocaleString('pt-BR')}`
              : '—'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-medium text-slate-400">
            <MessageSquare className={iconClass} />
            Total leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {data.leadsTotal}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Novo: {data.leadsByStatus.new} · Qualificado: {data.leadsByStatus.qualified} · Proposta: {data.leadsByStatus.proposal} · Ganho: {data.leadsByStatus.won} · Perdido: {data.leadsByStatus.lost}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
