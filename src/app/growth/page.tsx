'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, DollarSign, TrendingUp, Users, Construction } from 'lucide-react'

export default function GrowthPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comercial</h1>
          <p className="text-gray-500">Propostas, precificação e pipeline</p>
        </div>

        {/* Em desenvolvimento */}
        <Card className="border-dashed border-2 border-ness-cyan/30 bg-ness-cyan/5">
          <CardContent className="p-8 text-center">
            <Construction size={48} className="mx-auto mb-4 text-ness-cyan" />
            <h2 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              O ness.GROWTH está sendo implementado. Funcionalidades planejadas:
            </p>
          </CardContent>
        </Card>

        {/* Preview das funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Propostas</p>
                  <p className="text-sm text-gray-500">Geração automática</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Precificação</p>
                  <p className="text-sm text-gray-500">Cálculo de preço/hora</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Pipeline</p>
                  <p className="text-sm text-gray-500">Funil de vendas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Leads</p>
                  <p className="text-sm text-gray-500">Qualificação automática</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agentes IA planejados */}
        <Card>
          <CardHeader>
            <CardTitle>Agentes IA Planejados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">🤖 ness.Proposal</p>
                <p className="text-sm text-gray-500">Geração de propostas comerciais baseadas em templates e histórico</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">🤖 ness.Pricing</p>
                <p className="text-sm text-gray-500">Sugestão de preços baseada em custos reais e margem alvo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
