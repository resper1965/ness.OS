'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Clock, Calendar, Download, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const recursos = [
  {
    id: '1',
    nome: 'João Silva',
    cargo: 'Analista de Segurança Sr',
    custoHora: 95,
    horasMes: 168,
    alocacoes: [
      { cliente: 'Grupo Alupar', projeto: 'OT Governance', horas: 120, faturavel: true },
      { cliente: 'Interno', projeto: 'Treinamento', horas: 32, faturavel: false },
      { cliente: 'SPFC', projeto: 'TSCM', horas: 16, faturavel: true },
    ]
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cargo: 'Analista SOC',
    custoHora: 75,
    horasMes: 160,
    alocacoes: [
      { cliente: 'SPFC', projeto: 'SOC 24x7', horas: 148, faturavel: true },
      { cliente: 'Interno', projeto: 'Documentação', horas: 12, faturavel: false },
    ]
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    cargo: 'Consultor LGPD',
    custoHora: 110,
    horasMes: 172,
    alocacoes: [
      { cliente: 'Perfin', projeto: 'LGPD Assessment', horas: 100, faturavel: true },
      { cliente: 'Manesco', projeto: 'Pentest', horas: 40, faturavel: true },
      { cliente: 'Interno', projeto: 'Proposta', horas: 32, faturavel: false },
    ]
  },
  {
    id: '4',
    nome: 'Ana Oliveira',
    cargo: 'Analista de Segurança Pl',
    custoHora: 85,
    horasMes: 164,
    alocacoes: [
      { cliente: 'IONIC Health', projeto: 'Vuln Management', horas: 140, faturavel: true },
      { cliente: 'Interno', projeto: 'Estudo', horas: 24, faturavel: false },
    ]
  },
]

const horasPorDia = [
  { dia: 'Seg', joao: 8, maria: 8, pedro: 9, ana: 8 },
  { dia: 'Ter', joao: 9, maria: 8, pedro: 8, ana: 9 },
  { dia: 'Qua', joao: 8, maria: 8, pedro: 10, ana: 8 },
  { dia: 'Qui', joao: 8, maria: 8, pedro: 8, ana: 8 },
  { dia: 'Sex', joao: 7, maria: 8, pedro: 8, ana: 7 },
]

export default function TimesheetPage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [semana, setSemana] = useState('atual')

  const totalHoras = recursos.reduce((acc, r) => acc + r.horasMes, 0)
  const totalFaturadas = recursos.reduce((acc, r) => 
    acc + r.alocacoes.filter(a => a.faturavel).reduce((s, a) => s + a.horas, 0), 0
  )
  const totalCusto = recursos.reduce((acc, r) => acc + (r.horasMes * r.custoHora), 0)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timesheet</h1>
            <p className="text-gray-500">Registro e acompanhamento de horas</p>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border rounded-lg text-sm" value={semana} onChange={(e) => setSemana(e.target.value)}>
              <option value="atual">Semana Atual</option>
              <option value="anterior">Semana Anterior</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Download size={16} /> Exportar
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Total Horas</p><p className="text-2xl font-bold">{totalHoras}h</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Horas Faturáveis</p><p className="text-2xl font-bold text-green-600">{totalFaturadas}h</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Utilização</p><p className="text-2xl font-bold">{((totalFaturadas/totalHoras)*100).toFixed(1)}%</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Custo Total</p><p className="text-2xl font-bold">{formatCurrency(totalCusto)}</p></CardContent></Card>
        </div>

        {/* Gráfico */}
        <Card>
          <CardHeader><CardTitle>Horas por Dia da Semana</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={horasPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="joao" fill="#00ade8" name="João" stackId="stack" />
                <Bar dataKey="maria" fill="#4ade80" name="Maria" stackId="stack" />
                <Bar dataKey="pedro" fill="#fbbf24" name="Pedro" stackId="stack" />
                <Bar dataKey="ana" fill="#a78bfa" name="Ana" stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader><CardTitle>Timesheet por Recurso</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Recurso</th>
                  <th className="text-left p-4 font-medium text-gray-600">Cargo</th>
                  <th className="text-right p-4 font-medium text-gray-600">Custo/h</th>
                  <th className="text-right p-4 font-medium text-gray-600">Horas</th>
                  <th className="text-right p-4 font-medium text-gray-600">Faturáveis</th>
                  <th className="text-right p-4 font-medium text-gray-600">Custo</th>
                  <th className="text-center p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recursos.map((recurso) => {
                  const horasFat = recurso.alocacoes.filter(a => a.faturavel).reduce((s, a) => s + a.horas, 0)
                  return (
                    <>
                      <tr key={recurso.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedRow(expandedRow === recurso.id ? null : recurso.id)}>
                        <td className="p-4 font-medium">{recurso.nome}</td>
                        <td className="p-4 text-gray-600">{recurso.cargo}</td>
                        <td className="p-4 text-right">{formatCurrency(recurso.custoHora)}</td>
                        <td className="p-4 text-right">{recurso.horasMes}h</td>
                        <td className="p-4 text-right text-green-600">{horasFat}h</td>
                        <td className="p-4 text-right font-medium">{formatCurrency(recurso.horasMes * recurso.custoHora)}</td>
                        <td className="p-4 text-center">{expandedRow === recurso.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</td>
                      </tr>
                      {expandedRow === recurso.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="p-4">
                            <div className="space-y-2">
                              {recurso.alocacoes.map((aloc, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-white rounded">
                                  <div><span className="font-medium">{aloc.cliente}</span> — {aloc.projeto}</div>
                                  <div className="flex items-center gap-3">
                                    <Badge variant={aloc.faturavel ? 'success' : 'secondary'}>{aloc.faturavel ? 'Faturável' : 'Interno'}</Badge>
                                    <span className="font-medium">{aloc.horas}h</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
