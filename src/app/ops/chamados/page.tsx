'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, Clock, User, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const chamados = [
  { id: 'TKT-2025-0089', cliente: 'Alupar', assunto: 'Alerta Wazuh - Brute Force detectado', prioridade: 'Alta', status: 'Em Andamento', responsavel: 'João Silva', abertura: '2025-01-29 08:30', sla: '2h', categoria: 'Incidente' },
  { id: 'TKT-2025-0088', cliente: 'SPFC', assunto: 'Firewall - Regra de acesso bloqueada', prioridade: 'Média', status: 'Aberto', responsavel: '-', abertura: '2025-01-29 09:15', sla: '4h', categoria: 'Requisição' },
  { id: 'TKT-2025-0087', cliente: 'Perfin', assunto: 'Backup noturno falhou', prioridade: 'Alta', status: 'Em Andamento', responsavel: 'Maria Santos', abertura: '2025-01-29 07:00', sla: '1h', categoria: 'Incidente' },
  { id: 'TKT-2025-0086', cliente: 'IONIC', assunto: 'Certificado SSL expirando em 15 dias', prioridade: 'Baixa', status: 'Aguardando', responsavel: 'Pedro Costa', abertura: '2025-01-28 14:00', sla: '24h', categoria: 'Requisição' },
  { id: 'TKT-2025-0085', cliente: 'Manesco', assunto: 'Usuário bloqueado no AD', prioridade: 'Média', status: 'Resolvido', responsavel: 'Ana Oliveira', abertura: '2025-01-28 10:30', sla: '2h', categoria: 'Requisição' },
  { id: 'TKT-2025-0084', cliente: 'Alupar', assunto: 'Lentidão no sistema SCADA', prioridade: 'Alta', status: 'Resolvido', responsavel: 'João Silva', abertura: '2025-01-27 16:00', sla: '1h', categoria: 'Incidente' },
  { id: 'TKT-2025-0083', cliente: 'SPFC', assunto: 'Solicitação de novo usuário VPN', prioridade: 'Baixa', status: 'Resolvido', responsavel: 'Carlos Lima', abertura: '2025-01-27 11:00', sla: '8h', categoria: 'Requisição' },
  { id: 'TKT-2025-0082', cliente: 'Perfin', assunto: 'Atualização de antivírus', prioridade: 'Média', status: 'Resolvido', responsavel: 'Maria Santos', abertura: '2025-01-26 09:00', sla: '4h', categoria: 'Mudança' },
]

const porStatus = [
  { status: 'Aberto', quantidade: 1, color: '#ef4444' },
  { status: 'Em Andamento', quantidade: 2, color: '#fbbf24' },
  { status: 'Aguardando', quantidade: 1, color: '#94a3b8' },
  { status: 'Resolvido', quantidade: 4, color: '#22c55e' },
]

const porCliente = [
  { cliente: 'Alupar', quantidade: 2 },
  { cliente: 'SPFC', quantidade: 2 },
  { cliente: 'Perfin', quantidade: 2 },
  { cliente: 'IONIC', quantidade: 1 },
  { cliente: 'Manesco', quantidade: 1 },
]

function getPrioridadeBadge(p: string) {
  return p === 'Alta' ? <Badge variant="danger">Alta</Badge> : p === 'Média' ? <Badge variant="warning">Média</Badge> : <Badge variant="secondary">Baixa</Badge>
}

function getStatusBadge(s: string) {
  return s === 'Aberto' ? <Badge variant="danger">Aberto</Badge> : s === 'Em Andamento' ? <Badge variant="warning">Em Andamento</Badge> : s === 'Aguardando' ? <Badge variant="secondary">Aguardando</Badge> : <Badge variant="success">Resolvido</Badge>
}

export default function ChamadosPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')

  const filtered = chamados.filter(c => {
    const matchSearch = c.assunto.toLowerCase().includes(search.toLowerCase()) || c.cliente.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chamados</h1>
            <p className="text-gray-500">Central de atendimento e suporte</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-ness-cyan text-white rounded-lg hover:bg-ness-cyan/90">
            <Plus size={20} /> Novo Chamado
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-red-50 border-red-200"><CardContent className="p-4"><p className="text-sm text-red-600">Abertos</p><p className="text-2xl font-bold text-red-700">1</p></CardContent></Card>
          <Card className="bg-yellow-50 border-yellow-200"><CardContent className="p-4"><p className="text-sm text-yellow-600">Em Andamento</p><p className="text-2xl font-bold text-yellow-700">2</p></CardContent></Card>
          <Card className="bg-gray-50"><CardContent className="p-4"><p className="text-sm text-gray-600">Aguardando</p><p className="text-2xl font-bold">1</p></CardContent></Card>
          <Card className="bg-green-50 border-green-200"><CardContent className="p-4"><p className="text-sm text-green-600">Resolvidos (7d)</p><p className="text-2xl font-bold text-green-700">4</p></CardContent></Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Por Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={porStatus} cx="50%" cy="50%" outerRadius={70} dataKey="quantidade">
                    {porStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Por Cliente</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={porCliente} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="cliente" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#00ade8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Buscar chamado..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="todos">Todos</option>
            <option value="Aberto">Aberto</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Aguardando">Aguardando</option>
            <option value="Resolvido">Resolvido</option>
          </select>
        </div>

        {/* Tabela */}
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">ID</th>
                  <th className="text-left p-4 font-medium text-gray-600">Cliente</th>
                  <th className="text-left p-4 font-medium text-gray-600">Assunto</th>
                  <th className="text-left p-4 font-medium text-gray-600">Prioridade</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Responsável</th>
                  <th className="text-left p-4 font-medium text-gray-600">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{c.id}</td>
                    <td className="p-4">{c.cliente}</td>
                    <td className="p-4"><p className="font-medium">{c.assunto}</p><p className="text-sm text-gray-500">{c.categoria} • {c.abertura}</p></td>
                    <td className="p-4">{getPrioridadeBadge(c.prioridade)}</td>
                    <td className="p-4">{getStatusBadge(c.status)}</td>
                    <td className="p-4">{c.responsavel}</td>
                    <td className="p-4"><span className={c.prioridade === 'Alta' ? 'text-red-600 font-medium' : ''}>{c.sla}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
