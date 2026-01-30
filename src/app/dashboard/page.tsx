'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { KPICard } from '@/components/modules/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent } from '@/lib/utils'
import {
  DollarSign,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useDashboardKPIs, useFluxoCaixa, useRentabilidade, useAlertas, useSyncOmie } from '@/hooks/use-fin'

function getSeveridadeBadge(tipo: string): 'danger' | 'warning' {
  return tipo.includes('90') || tipo.includes('30') || tipo.includes('RENTABILIDADE') ? 'danger' : 'warning'
}

export default function DashboardPage() {
  const { kpis, loading: kpisLoading } = useDashboardKPIs()
  const { triggerSync, syncing, lastSync, error: syncError } = useSyncOmie()
  const { fluxoCaixa, loading: fluxoLoading } = useFluxoCaixa(6)
  const { rentabilidade, loading: rentLoading } = useRentabilidade()
  const { alertas, loading: alertasLoading } = useAlertas(true)

  const rentabilidadeClientes = rentabilidade
    .slice(0, 5)
    .map((r) => ({
      cliente: (r as any).contrato?.cliente?.razao_social ?? '—',
      rentabilidade: Number(r.rentabilidade_percent ?? 0),
    }))

  const receitaMensal = fluxoCaixa.map((f) => ({
    mes: f.mes,
    receita: f.receita,
    despesa: f.despesa,
  }))

  const loading = kpisLoading || fluxoLoading || rentLoading || alertasLoading

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-ness-cyan" />
        </div>
      </AppLayout>
    )
  }
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Visão geral do ness.OS</p>
          </div>
          <div className="flex items-center gap-3">
            {lastSync && (
              <span className="text-xs text-gray-500">
                Último sync: {lastSync.toLocaleString('pt-BR')}
              </span>
            )}
            <button
              onClick={() => triggerSync().then(() => window.location.reload())}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ness-cyan text-white hover:bg-ness-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {syncing ? 'Sincronizando…' : 'Sincronizar Omie'}
            </button>
            {syncError && (
              <p className="text-xs text-red-600">{syncError}</p>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Receita Mensal"
            value={formatCurrency(kpis.receitaMensal)}
            change={0}
            changeLabel="dados do Supabase"
            trend="neutral"
            icon={<DollarSign size={24} />}
          />
          <KPICard
            title="Margem Média"
            value={formatPercent(kpis.margemMedia)}
            change={0}
            changeLabel="dados do Supabase"
            trend="neutral"
            icon={<TrendingUp size={24} />}
          />
          <KPICard
            title="Contratos Ativos"
            value={kpis.contratosAtivos.toString()}
            change={0}
            trend="neutral"
            icon={<FileText size={24} />}
          />
          <KPICard
            title="Alertas Pendentes"
            value={kpis.alertasPendentes.toString()}
            trend="neutral"
            icon={<AlertTriangle size={24} />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receita x Despesa */}
          <Card>
            <CardHeader>
              <CardTitle>Receita x Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={receitaMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="receita" fill="#00ade8" name="Receita" />
                  <Bar dataKey="despesa" fill="#e5e7eb" name="Despesa" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rentabilidade por Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Rentabilidade por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rentabilidadeClientes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="cliente" type="category" width={80} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar 
                    dataKey="rentabilidade" 
                    fill="#00ade8"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alertas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Alertas Recentes</CardTitle>
            <Link 
              href="/fin/alertas" 
              className="text-sm text-ness-cyan hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertas.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">Nenhum alerta pendente.</p>
              ) : (
                alertas.slice(0, 4).map((alerta) => (
                  <div
                    key={alerta.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeveridadeBadge(alerta.tipo)}>
                        {alerta.tipo}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{alerta.mensagem}</p>
                      </div>
                    </div>
                    <Link
                      href={`/fin/contratos`}
                      className="text-ness-cyan hover:underline text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
