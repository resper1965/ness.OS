'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Cloud, Server, Shield, Database, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts'

const custosCloud = [
  { mes: 'Ago', aws: 2800, gcp: 1200, azure: 800, total: 4800 },
  { mes: 'Set', aws: 2950, gcp: 1350, azure: 850, total: 5150 },
  { mes: 'Out', aws: 3100, gcp: 1400, azure: 900, total: 5400 },
  { mes: 'Nov', aws: 3200, gcp: 1500, azure: 950, total: 5650 },
  { mes: 'Dez', aws: 3400, gcp: 1600, azure: 1000, total: 6000 },
  { mes: 'Jan', aws: 3500, gcp: 1650, azure: 1050, total: 6200 },
]

const licencas = [
  { nome: 'Microsoft 365 E3', quantidade: 25, custoUnit: 180, custoTotal: 4500, vencimento: '2025-12-31', fornecedor: 'Microsoft' },
  { nome: 'Wazuh SIEM', quantidade: 5, custoUnit: 350, custoTotal: 1750, vencimento: '2025-06-30', fornecedor: 'Wazuh' },
  { nome: 'Tenable.io', quantidade: 500, custoUnit: 4.5, custoTotal: 2250, vencimento: '2025-09-15', fornecedor: 'Tenable' },
  { nome: 'CrowdStrike', quantidade: 150, custoUnit: 12, custoTotal: 1800, vencimento: '2025-08-01', fornecedor: 'CrowdStrike' },
  { nome: 'Burp Suite Pro', quantidade: 3, custoUnit: 200, custoTotal: 600, vencimento: '2025-04-15', fornecedor: 'PortSwigger' },
]

const custosPorCliente = [
  { cliente: 'Grupo Alupar', cloud: 2800, licencas: 1500, total: 4300 },
  { cliente: 'SPFC', cloud: 1950, licencas: 1200, total: 3150 },
  { cliente: 'Perfin', cloud: 1400, licencas: 800, total: 2200 },
  { cliente: 'IONIC Health', cloud: 1200, licencas: 600, total: 1800 },
  { cliente: 'Manesco', cloud: 850, licencas: 400, total: 1250 },
]

const distribuicaoCloud = [
  { name: 'AWS', value: 3500, color: '#ff9900' },
  { name: 'GCP', value: 1650, color: '#4285f4' },
  { name: 'Azure', value: 1050, color: '#00bcf2' },
]

export default function CustosPage() {
  const totalCloud = 6200
  const totalLicencas = licencas.reduce((acc, l) => acc + l.custoTotal, 0)
  const totalGeral = totalCloud + totalLicencas

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custos</h1>
            <p className="text-gray-500">Cloud, licenças e infraestrutura</p>
          </div>
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option>Janeiro 2025</option>
            <option>Dezembro 2024</option>
          </select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-500">Custos Cloud</p><p className="text-2xl font-bold">{formatCurrency(totalCloud)}</p></div>
                <Cloud className="text-ness-cyan" size={24} />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-red-600"><TrendingUp size={14} /> +3.3% vs mês anterior</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-500">Licenças</p><p className="text-2xl font-bold">{formatCurrency(totalLicencas)}</p></div>
                <Shield className="text-ness-cyan" size={24} />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600"><TrendingDown size={14} /> Estável</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-500">Custo Total</p><p className="text-2xl font-bold">{formatCurrency(totalGeral)}</p></div>
                <Database className="text-ness-cyan" size={24} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-yellow-600">Licenças Vencendo</p><p className="text-2xl font-bold text-yellow-700">2</p></div>
                <AlertTriangle className="text-yellow-500" size={24} />
              </div>
              <p className="text-sm text-yellow-600 mt-2">Próximos 90 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Cloud */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Evolução Custos Cloud (6 meses)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={custosCloud}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                  <Area type="monotone" dataKey="aws" stackId="1" stroke="#ff9900" fill="#ff9900" fillOpacity={0.6} name="AWS" />
                  <Area type="monotone" dataKey="gcp" stackId="1" stroke="#4285f4" fill="#4285f4" fillOpacity={0.6} name="GCP" />
                  <Area type="monotone" dataKey="azure" stackId="1" stroke="#00bcf2" fill="#00bcf2" fillOpacity={0.6} name="Azure" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Distribuição por Provider</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={distribuicaoCloud} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                    {distribuicaoCloud.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Custos por Cliente */}
        <Card>
          <CardHeader><CardTitle>Custos por Cliente</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={custosPorCliente}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cliente" />
                <YAxis tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="cloud" fill="#00ade8" name="Cloud" />
                <Bar dataKey="licencas" fill="#4ade80" name="Licenças" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Licenças */}
        <Card>
          <CardHeader><CardTitle>Licenças e Assinaturas</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Licença</th>
                  <th className="text-left p-4 font-medium text-gray-600">Fornecedor</th>
                  <th className="text-right p-4 font-medium text-gray-600">Qtd</th>
                  <th className="text-right p-4 font-medium text-gray-600">Custo Unit.</th>
                  <th className="text-right p-4 font-medium text-gray-600">Total/mês</th>
                  <th className="text-left p-4 font-medium text-gray-600">Vencimento</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {licencas.map((l) => {
                  const diasVenc = Math.ceil((new Date(l.vencimento).getTime() - new Date().getTime()) / (1000*60*60*24))
                  return (
                    <tr key={l.nome} className={diasVenc <= 90 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                      <td className="p-4 font-medium">{l.nome}</td>
                      <td className="p-4 text-gray-600">{l.fornecedor}</td>
                      <td className="p-4 text-right">{l.quantidade}</td>
                      <td className="p-4 text-right">{formatCurrency(l.custoUnit)}</td>
                      <td className="p-4 text-right font-medium">{formatCurrency(l.custoTotal)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {diasVenc <= 90 && <AlertTriangle size={14} className="text-yellow-500" />}
                          <span className={diasVenc <= 90 ? 'text-yellow-600' : ''}>{new Date(l.vencimento).toLocaleDateString('pt-BR')}</span>
                          {diasVenc <= 90 && <Badge variant="warning">{diasVenc}d</Badge>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={4} className="p-4 font-medium">Total Mensal</td>
                  <td className="p-4 text-right font-bold">{formatCurrency(totalLicencas)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
