'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts'

// Dados mockados
const rentabilidadeContratos = [
  {
    id: '1',
    contrato: 'CTR-2024-001',
    cliente: 'Grupo Alupar',
    receita: 45000,
    custo_direto: 22000,
    overhead: 11250,
    impostos: 7043,
    margem: 4707,
    rentabilidade: 10.5,
    trend: 'up',
    detalhes: {
      horas_tecnicas: 180,
      custo_hora: 85,
      licencas: 3500,
      cloud: 2900,
    }
  },
  {
    id: '2',
    contrato: 'CTR-2024-002',
    cliente: 'São Paulo FC',
    receita: 32000,
    custo_direto: 14000,
    overhead: 8000,
    impostos: 5008,
    margem: 4992,
    rentabilidade: 15.6,
    trend: 'up',
    detalhes: {
      horas_tecnicas: 120,
      custo_hora: 90,
      licencas: 2200,
      cloud: 1000,
    }
  },
  {
    id: '3',
    contrato: 'CTR-2024-003',
    cliente: 'Perfin Investimentos',
    receita: 28000,
    custo_direto: 10000,
    overhead: 7000,
    impostos: 4382,
    margem: 6618,
    rentabilidade: 23.6,
    trend: 'up',
    detalhes: {
      horas_tecnicas: 80,
      custo_hora: 95,
      licencas: 1500,
      cloud: 900,
    }
  },
  {
    id: '4',
    contrato: 'CTR-2024-004',
    cliente: 'Cliente Problema',
    receita: 18000,
    custo_direto: 12000,
    overhead: 4500,
    impostos: 2817,
    margem: -1317,
    rentabilidade: -7.3,
    trend: 'down',
    detalhes: {
      horas_tecnicas: 140,
      custo_hora: 75,
      licencas: 1200,
      cloud: 300,
    }
  },
]

const distribuicaoCustos = [
  { name: 'RH/Horas', value: 58000, color: '#00ade8' },
  { name: 'Licenças', value: 8400, color: '#4ade80' },
  { name: 'Cloud', value: 5100, color: '#fbbf24' },
  { name: 'Overhead', value: 30750, color: '#94a3b8' },
  { name: 'Impostos', value: 19250, color: '#ef4444' },
]

function getRentabilidadeColor(value: number): string {
  if (value < 0) return '#ef4444'
  if (value < 10) return '#f97316'
  if (value < 20) return '#eab308'
  return '#22c55e'
}

export default function RentabilidadePage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [periodo, setPeriodo] = useState('jan-2025')

  const totalReceita = rentabilidadeContratos.reduce((acc, c) => acc + c.receita, 0)
  const totalMargem = rentabilidadeContratos.reduce((acc, c) => acc + c.margem, 0)
  const margemMedia = (totalMargem / totalReceita) * 100

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rentabilidade</h1>
            <p className="text-gray-500">Análise de margem por contrato</p>
          </div>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ness-cyan/50"
          >
            <option value="jan-2025">Janeiro 2025</option>
            <option value="dez-2024">Dezembro 2024</option>
            <option value="nov-2024">Novembro 2024</option>
          </select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Receita Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalReceita)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Margem Total</p>
              <p className={`text-2xl font-bold ${totalMargem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalMargem)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Rentabilidade Média</p>
              <p className={`text-2xl font-bold ${margemMedia >= 15 ? 'text-green-600' : margemMedia >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                {margemMedia.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className={rentabilidadeContratos.filter(c => c.rentabilidade < 10).length > 0 ? 'bg-red-50 border-red-200' : ''}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Contratos em Alerta</p>
              <p className="text-2xl font-bold text-red-600">
                {rentabilidadeContratos.filter(c => c.rentabilidade < 10).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rentabilidade por Contrato */}
          <Card>
            <CardHeader>
              <CardTitle>Rentabilidade por Contrato</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rentabilidadeContratos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} domain={[-10, 30]} />
                  <YAxis dataKey="cliente" type="category" width={120} />
                  <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                  <Bar dataKey="rentabilidade" radius={[0, 4, 4, 0]}>
                    {rentabilidadeContratos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRentabilidadeColor(entry.rentabilidade)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição de Custos */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Custos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoCustos}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {distribuicaoCustos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Detalhada */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Contrato</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Contrato</th>
                    <th className="text-right p-4 font-medium text-gray-600">Receita</th>
                    <th className="text-right p-4 font-medium text-gray-600">Custo Direto</th>
                    <th className="text-right p-4 font-medium text-gray-600">Overhead</th>
                    <th className="text-right p-4 font-medium text-gray-600">Impostos</th>
                    <th className="text-right p-4 font-medium text-gray-600">Margem</th>
                    <th className="text-right p-4 font-medium text-gray-600">Rent. %</th>
                    <th className="text-center p-4 font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rentabilidadeContratos.map((item) => (
                    <>
                      <tr 
                        key={item.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${item.rentabilidade < 10 ? 'bg-red-50' : ''}`}
                        onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {item.rentabilidade < 10 && (
                              <AlertTriangle size={16} className="text-red-500" />
                            )}
                            <div>
                              <p className="font-medium">{item.cliente}</p>
                              <p className="text-sm text-gray-500">{item.contrato}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">{formatCurrency(item.receita)}</td>
                        <td className="p-4 text-right text-gray-600">{formatCurrency(item.custo_direto)}</td>
                        <td className="p-4 text-right text-gray-600">{formatCurrency(item.overhead)}</td>
                        <td className="p-4 text-right text-gray-600">{formatCurrency(item.impostos)}</td>
                        <td className={`p-4 text-right font-medium ${item.margem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.margem)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {item.trend === 'up' ? (
                              <TrendingUp size={14} className="text-green-500" />
                            ) : (
                              <TrendingDown size={14} className="text-red-500" />
                            )}
                            <span 
                              className="font-bold"
                              style={{ color: getRentabilidadeColor(item.rentabilidade) }}
                            >
                              {item.rentabilidade.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {expandedRow === item.id ? (
                            <ChevronUp size={16} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-400" />
                          )}
                        </td>
                      </tr>
                      {expandedRow === item.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={8} className="p-4">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="bg-white p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Horas Técnicas</p>
                                <p className="font-bold">{item.detalhes.horas_tecnicas}h</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Custo/Hora</p>
                                <p className="font-bold">{formatCurrency(item.detalhes.custo_hora)}</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Licenças</p>
                                <p className="font-bold">{formatCurrency(item.detalhes.licencas)}</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Cloud</p>
                                <p className="font-bold">{formatCurrency(item.detalhes.cloud)}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
