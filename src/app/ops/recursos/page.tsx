'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Users, Plus, Mail, Phone, Briefcase } from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts'

const equipe = [
  { id: '1', nome: 'João Silva', cargo: 'Analista Sr', area: 'Segurança OT', status: 'Alocado', cliente: 'Alupar', utilizacao: 95, email: 'joao@ness.com.br', custo: 95 },
  { id: '2', nome: 'Maria Santos', cargo: 'Analista SOC', area: 'SOC', status: 'Alocado', cliente: 'SPFC', utilizacao: 92, email: 'maria@ness.com.br', custo: 75 },
  { id: '3', nome: 'Pedro Costa', cargo: 'Consultor', area: 'GRC', status: 'Parcial', cliente: 'Perfin/Manesco', utilizacao: 81, email: 'pedro@ness.com.br', custo: 110 },
  { id: '4', nome: 'Ana Oliveira', cargo: 'Analista Pl', area: 'Vulnerabilidades', status: 'Alocado', cliente: 'IONIC', utilizacao: 95, email: 'ana@ness.com.br', custo: 85 },
  { id: '5', nome: 'Carlos Lima', cargo: 'Analista Jr', area: 'Suporte', status: 'Bench', cliente: '-', utilizacao: 45, email: 'carlos@ness.com.br', custo: 55 },
  { id: '6', nome: 'Lucia Ferreira', cargo: 'Analista Sr', area: 'Pentest', status: 'Alocado', cliente: 'Manesco', utilizacao: 95, email: 'lucia@ness.com.br', custo: 100 },
  { id: '7', nome: 'Roberto Alves', cargo: 'Analista Pl', area: 'Segurança OT', status: 'Alocado', cliente: 'Alupar', utilizacao: 90, email: 'roberto@ness.com.br', custo: 85 },
  { id: '8', nome: 'Fernanda Dias', cargo: 'Estagiária', area: 'Suporte', status: 'Parcial', cliente: 'Diversos', utilizacao: 88, email: 'fernanda@ness.com.br', custo: 35 },
]

const distribuicaoPorArea = [
  { name: 'Segurança OT', value: 2, color: '#00ade8' },
  { name: 'SOC', value: 1, color: '#4ade80' },
  { name: 'GRC', value: 1, color: '#fbbf24' },
  { name: 'Vulnerabilidades', value: 1, color: '#a78bfa' },
  { name: 'Pentest', value: 1, color: '#f472b6' },
  { name: 'Suporte', value: 2, color: '#94a3b8' },
]

const distribuicaoPorStatus = [
  { name: 'Alocado', value: 5, color: '#22c55e' },
  { name: 'Parcial', value: 2, color: '#fbbf24' },
  { name: 'Bench', value: 1, color: '#ef4444' },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'Alocado': return <Badge variant="success">Alocado</Badge>
    case 'Parcial': return <Badge variant="warning">Parcial</Badge>
    case 'Bench': return <Badge variant="danger">Bench</Badge>
    default: return <Badge>{status}</Badge>
  }
}

export default function RecursosPage() {
  const totalRecursos = equipe.length
  const alocados = equipe.filter(e => e.status === 'Alocado').length
  const bench = equipe.filter(e => e.status === 'Bench').length
  const custoTotal = equipe.reduce((acc, e) => acc + (e.custo * 168), 0)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recursos</h1>
            <p className="text-gray-500">Gestão de equipe e alocação</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-ness-cyan text-white rounded-lg hover:bg-ness-cyan/90">
            <Plus size={20} /> Novo Recurso
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Total Recursos</p><p className="text-2xl font-bold">{totalRecursos}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Alocados</p><p className="text-2xl font-bold text-green-600">{alocados}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Bench</p><p className="text-2xl font-bold text-red-600">{bench}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Custo Mensal</p><p className="text-2xl font-bold">{formatCurrency(custoTotal)}</p></CardContent></Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Por Área</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={distribuicaoPorArea} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {distribuicaoPorArea.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Por Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={distribuicaoPorStatus} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {distribuicaoPorStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {equipe.map((pessoa) => (
            <Card key={pessoa.id} className={pessoa.status === 'Bench' ? 'border-red-200 bg-red-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-ness-cyan text-white flex items-center justify-center font-medium">
                    {pessoa.nome.split(' ').map(n => n[0]).join('')}
                  </div>
                  {getStatusBadge(pessoa.status)}
                </div>
                <h3 className="font-medium">{pessoa.nome}</h3>
                <p className="text-sm text-gray-500">{pessoa.cargo}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={14} /> {pessoa.area}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={14} /> {pessoa.cliente}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                  <span className="text-gray-500">Utilização</span>
                  <span className={pessoa.utilizacao >= 80 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{pessoa.utilizacao}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
