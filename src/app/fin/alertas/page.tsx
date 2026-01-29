'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { 
  AlertTriangle, 
  Calendar, 
  TrendingDown, 
  RefreshCw,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react'
import { useState } from 'react'

// Dados mockados
const alertas = [
  {
    id: '1',
    tipo: 'VENCIMENTO_30D',
    categoria: 'vencimento',
    cliente: 'São Paulo FC',
    contrato: 'CTR-2024-002',
    mensagem: 'Contrato vence em 30 dias',
    dados: { data_fim: '2025-02-28', valor_mensal: 32000 },
    severidade: 'critico',
    lido: false,
    created_at: '2025-01-29T08:00:00Z',
  },
  {
    id: '2',
    tipo: 'RENTABILIDADE_BAIXA',
    categoria: 'rentabilidade',
    cliente: 'Cliente Problema',
    contrato: 'CTR-2024-004',
    mensagem: 'Rentabilidade negativa (-7.3%)',
    dados: { rentabilidade: -7.3, margem: -1317 },
    severidade: 'critico',
    lido: false,
    created_at: '2025-01-28T14:30:00Z',
  },
  {
    id: '3',
    tipo: 'REAJUSTE_PENDENTE',
    categoria: 'reajuste',
    cliente: 'Grupo Alupar',
    contrato: 'CTR-2024-001',
    mensagem: 'Reajuste IGPM pendente (acumulado 4.2%)',
    dados: { indice: 'IGPM', acumulado: 4.2, data_reajuste: '2025-01-01' },
    severidade: 'atencao',
    lido: false,
    created_at: '2025-01-27T10:00:00Z',
  },
  {
    id: '4',
    tipo: 'VENCIMENTO_90D',
    categoria: 'vencimento',
    cliente: 'Perfin Investimentos',
    contrato: 'CTR-2024-003',
    mensagem: 'Contrato vence em 122 dias',
    dados: { data_fim: '2025-05-31', valor_mensal: 28000 },
    severidade: 'atencao',
    lido: true,
    created_at: '2025-01-25T09:00:00Z',
  },
  {
    id: '5',
    tipo: 'INADIMPLENCIA',
    categoria: 'financeiro',
    cliente: 'Cliente X',
    contrato: 'CTR-2024-005',
    mensagem: 'Fatura em atraso há 15 dias',
    dados: { valor: 15000, dias_atraso: 15 },
    severidade: 'urgente',
    lido: false,
    created_at: '2025-01-26T16:00:00Z',
  },
]

const categorias = [
  { id: 'todos', label: 'Todos', icon: Filter },
  { id: 'vencimento', label: 'Vencimentos', icon: Calendar },
  { id: 'rentabilidade', label: 'Rentabilidade', icon: TrendingDown },
  { id: 'reajuste', label: 'Reajustes', icon: RefreshCw },
  { id: 'financeiro', label: 'Financeiro', icon: AlertTriangle },
]

function getAlertIcon(categoria: string) {
  switch (categoria) {
    case 'vencimento': return <Calendar className="text-orange-500" size={20} />
    case 'rentabilidade': return <TrendingDown className="text-red-500" size={20} />
    case 'reajuste': return <RefreshCw className="text-blue-500" size={20} />
    case 'financeiro': return <AlertTriangle className="text-yellow-500" size={20} />
    default: return <AlertTriangle className="text-gray-500" size={20} />
  }
}

function getSeveridadeBadge(severidade: string) {
  switch (severidade) {
    case 'critico': return <Badge variant="danger">Crítico</Badge>
    case 'urgente': return <Badge variant="warning">Urgente</Badge>
    case 'atencao': return <Badge variant="secondary">Atenção</Badge>
    default: return <Badge>Info</Badge>
  }
}

export default function AlertasPage() {
  const [categoria, setCategoria] = useState('todos')
  const [showResolved, setShowResolved] = useState(false)

  const filteredAlertas = alertas.filter((a) => {
    const matchCategoria = categoria === 'todos' || a.categoria === categoria
    const matchResolved = showResolved || !a.lido
    return matchCategoria && matchResolved
  })

  const countByCategoria = (cat: string) => 
    alertas.filter(a => (cat === 'todos' || a.categoria === cat) && !a.lido).length

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
            <p className="text-gray-500">Central de notificações e pendências</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded border-gray-300"
            />
            Mostrar resolvidos
          </label>
        </div>

        {/* Filtros por categoria */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((cat) => {
            const Icon = cat.icon
            const count = countByCategoria(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  categoria === cat.id
                    ? 'bg-ness-cyan text-white'
                    : 'bg-white border hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {cat.label}
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    categoria === cat.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-600">Críticos</p>
              <p className="text-2xl font-bold text-red-700">
                {alertas.filter(a => a.severidade === 'critico' && !a.lido).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <p className="text-sm text-orange-600">Urgentes</p>
              <p className="text-2xl font-bold text-orange-700">
                {alertas.filter(a => a.severidade === 'urgente' && !a.lido).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-600">Atenção</p>
              <p className="text-2xl font-bold text-yellow-700">
                {alertas.filter(a => a.severidade === 'atencao' && !a.lido).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-sm text-green-600">Resolvidos (7d)</p>
              <p className="text-2xl font-bold text-green-700">
                {alertas.filter(a => a.lido).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de alertas */}
        <Card>
          <CardContent className="p-0 divide-y">
            {filteredAlertas.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <p>Nenhum alerta pendente!</p>
              </div>
            ) : (
              filteredAlertas.map((alerta) => (
                <div 
                  key={alerta.id}
                  className={`p-4 hover:bg-gray-50 transition ${alerta.lido ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getAlertIcon(alerta.categoria)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getSeveridadeBadge(alerta.severidade)}
                        <span className="font-medium">{alerta.cliente}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{alerta.contrato}</span>
                      </div>
                      <p className="text-gray-700">{alerta.mensagem}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(alerta.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        {alerta.dados.valor_mensal && (
                          <span>Valor: {formatCurrency(alerta.dados.valor_mensal)}/mês</span>
                        )}
                        {alerta.dados.rentabilidade !== undefined && (
                          <span className="text-red-600">Rent: {alerta.dados.rentabilidade}%</span>
                        )}
                        {alerta.dados.acumulado && (
                          <span>Acumulado: {alerta.dados.acumulado}%</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!alerta.lido && (
                        <button className="px-3 py-1 text-sm bg-ness-cyan text-white rounded hover:bg-ness-cyan/90 transition">
                          Resolver
                        </button>
                      )}
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50 transition">
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
