'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { KPICard } from '@/components/modules/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent, daysUntil } from '@/lib/utils'
import {
  DollarSign,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

// Dados mockados (serão substituídos por dados do Supabase)
const kpis = {
  receitaMensal: 285000,
  margemMedia: 23.5,
  contratosAtivos: 18,
  alertasPendentes: 4,
}

const receitaMensal = [
  { mes: 'Ago', receita: 245000, despesa: 180000 },
  { mes: 'Set', receita: 258000, despesa: 185000 },
  { mes: 'Out', receita: 272000, despesa: 190000 },
  { mes: 'Nov', receita: 268000, despesa: 195000 },
  { mes: 'Dez', receita: 295000, despesa: 210000 },
  { mes: 'Jan', receita: 285000, despesa: 205000 },
]

const rentabilidadeClientes = [
  { cliente: 'Alupar', rentabilidade: 28 },
  { cliente: 'SPFC', rentabilidade: 24 },
  { cliente: 'Perfin', rentabilidade: 22 },
  { cliente: 'IONIC', rentabilidade: 19 },
  { cliente: 'Cliente E', rentabilidade: 15 },
]

const alertasRecentes = [
  { id: 1, tipo: 'VENCIMENTO', cliente: 'Alupar', mensagem: 'Contrato vence em 45 dias', severidade: 'warning' },
  { id: 2, tipo: 'RENTABILIDADE', cliente: 'Cliente X', mensagem: 'Margem abaixo de 10%', severidade: 'danger' },
  { id: 3, tipo: 'REAJUSTE', cliente: 'SPFC', mensagem: 'Reajuste IGPM pendente', severidade: 'warning' },
  { id: 4, tipo: 'VENCIMENTO', cliente: 'Perfin', mensagem: 'Contrato vence em 30 dias', severidade: 'danger' },
]

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Visão geral do ness.OS</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Receita Mensal"
            value={formatCurrency(kpis.receitaMensal)}
            change={5.2}
            changeLabel="vs mês anterior"
            trend="up"
            icon={<DollarSign size={24} />}
          />
          <KPICard
            title="Margem Média"
            value={formatPercent(kpis.margemMedia)}
            change={1.8}
            changeLabel="vs mês anterior"
            trend="up"
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
            trend="down"
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
              {alertasRecentes.map((alerta) => (
                <div 
                  key={alerta.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={alerta.severidade === 'danger' ? 'danger' : 'warning'}>
                      {alerta.tipo}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{alerta.cliente}</p>
                      <p className="text-sm text-gray-500">{alerta.mensagem}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/fin/contratos`}
                    className="text-ness-cyan hover:underline text-sm"
                  >
                    Ver
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
