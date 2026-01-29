'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, daysUntil, getStatusColor, getSeverityColor } from '@/lib/utils'
import { Search, Filter, Plus, MoreVertical, Calendar, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

// Dados mockados
const contratos = [
  {
    id: '1',
    numero: 'CTR-2024-001',
    cliente: 'Grupo Alupar',
    descricao: 'Gestão de Segurança OT',
    valor_mensal: 45000,
    data_inicio: '2024-01-01',
    data_fim: '2025-12-31',
    status: 'ATIVO',
    indice_reajuste: 'IGPM',
    dias_restantes: 335,
  },
  {
    id: '2',
    numero: 'CTR-2024-002',
    cliente: 'São Paulo FC',
    descricao: 'SOC + Monitoramento 24x7',
    valor_mensal: 32000,
    data_inicio: '2024-03-01',
    data_fim: '2025-02-28',
    status: 'ATIVO',
    indice_reajuste: 'IPCA',
    dias_restantes: 30,
  },
  {
    id: '3',
    numero: 'CTR-2024-003',
    cliente: 'Perfin Investimentos',
    descricao: 'Consultoria LGPD + Pentest',
    valor_mensal: 28000,
    data_inicio: '2024-06-01',
    data_fim: '2025-05-31',
    status: 'ATIVO',
    indice_reajuste: 'IGPM',
    dias_restantes: 122,
  },
  {
    id: '4',
    numero: 'CTR-2023-015',
    cliente: 'IONIC Health',
    descricao: 'Gestão de Vulnerabilidades',
    valor_mensal: 18000,
    data_inicio: '2023-09-01',
    data_fim: '2024-08-31',
    status: 'SUSPENSO',
    indice_reajuste: 'IGPM',
    dias_restantes: -150,
  },
]

function getSeverity(dias: number): string {
  if (dias < 0) return 'VENCIDO'
  if (dias <= 30) return 'CRITICO'
  if (dias <= 60) return 'URGENTE'
  if (dias <= 90) return 'ATENCAO'
  return 'OK'
}

export default function ContratosPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  const filteredContratos = contratos.filter((c) => {
    const matchSearch = 
      c.cliente.toLowerCase().includes(search.toLowerCase()) ||
      c.numero.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
            <p className="text-gray-500">Gestão de contratos de serviço</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-ness-cyan text-white rounded-lg hover:bg-ness-cyan/90 transition">
            <Plus size={20} />
            Novo Contrato
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por cliente ou número..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ness-cyan/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ness-cyan/50"
          >
            <option value="todos">Todos os status</option>
            <option value="ATIVO">Ativos</option>
            <option value="SUSPENSO">Suspensos</option>
            <option value="ENCERRADO">Encerrados</option>
          </select>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-sm text-green-600 font-medium">Ativos</p>
              <p className="text-2xl font-bold text-green-700">
                {contratos.filter(c => c.status === 'ATIVO').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-600 font-medium">Vencendo em 90 dias</p>
              <p className="text-2xl font-bold text-yellow-700">
                {contratos.filter(c => c.dias_restantes > 0 && c.dias_restantes <= 90).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-600 font-medium">Críticos (30 dias)</p>
              <p className="text-2xl font-bold text-red-700">
                {contratos.filter(c => c.dias_restantes > 0 && c.dias_restantes <= 30).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-600 font-medium">Receita Mensal</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(contratos.filter(c => c.status === 'ATIVO').reduce((acc, c) => acc + c.valor_mensal, 0))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Contrato</th>
                    <th className="text-left p-4 font-medium text-gray-600">Cliente</th>
                    <th className="text-left p-4 font-medium text-gray-600">Valor Mensal</th>
                    <th className="text-left p-4 font-medium text-gray-600">Vigência</th>
                    <th className="text-left p-4 font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 font-medium text-gray-600">Vencimento</th>
                    <th className="text-left p-4 font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredContratos.map((contrato) => {
                    const severity = getSeverity(contrato.dias_restantes)
                    return (
                      <tr key={contrato.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <p className="font-medium">{contrato.numero}</p>
                          <p className="text-sm text-gray-500">{contrato.descricao}</p>
                        </td>
                        <td className="p-4 font-medium">{contrato.cliente}</td>
                        <td className="p-4">{formatCurrency(contrato.valor_mensal)}</td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(contrato.data_inicio).toLocaleDateString('pt-BR')} - {new Date(contrato.data_fim).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(contrato.status)}>
                            {contrato.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {contrato.status === 'ATIVO' && (
                            <div className="flex items-center gap-2">
                              {severity !== 'OK' && (
                                <AlertTriangle 
                                  size={16} 
                                  className={severity === 'CRITICO' ? 'text-red-500' : 'text-yellow-500'} 
                                />
                              )}
                              <span className={
                                severity === 'CRITICO' ? 'text-red-600 font-medium' :
                                severity === 'URGENTE' ? 'text-orange-600' :
                                severity === 'ATENCAO' ? 'text-yellow-600' :
                                'text-gray-600'
                              }>
                                {contrato.dias_restantes} dias
                              </span>
                            </div>
                          )}
                          {contrato.dias_restantes < 0 && (
                            <span className="text-red-600 font-medium">Vencido</span>
                          )}
                        </td>
                        <td className="p-4">
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <MoreVertical size={16} className="text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
