'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Target, TrendingUp, MessageSquare, Construction } from 'lucide-react'

export default function PeoplePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pessoas</h1>
          <p className="text-gray-500">Desenvolvimento, performance e engajamento</p>
        </div>

        {/* Em desenvolvimento */}
        <Card className="border-dashed border-2 border-ness-cyan/30 bg-ness-cyan/5">
          <CardContent className="p-8 text-center">
            <Construction size={48} className="mx-auto mb-4 text-ness-cyan" />
            <h2 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              O ness.PEOPLE está sendo implementado. Funcionalidades planejadas:
            </p>
          </CardContent>
        </Card>

        {/* Preview das funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">PDI</p>
                  <p className="text-sm text-gray-500">Plano de desenvolvimento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">OKRs</p>
                  <p className="text-sm text-gray-500">Objetivos e resultados</p>
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
                  <p className="font-medium">Performance</p>
                  <p className="text-sm text-gray-500">Avaliações e feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">1:1s</p>
                  <p className="text-sm text-gray-500">Reuniões individuais</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agente IA planejado */}
        <Card>
          <CardHeader>
            <CardTitle>Agente IA Planejado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">🤖 ness.Mentor</p>
                <p className="text-sm text-gray-500">
                  Análise de gaps de competência, sugestão de treinamentos, acompanhamento de PDI,
                  e geração de relatórios de performance. Integra com Qulture.Rocks e LMS.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">🤖 ness.PostMortem</p>
                <p className="text-sm text-gray-500">
                  Análise de erros operacionais, identificação de padrões, e sugestão de treinamentos
                  específicos baseados em incidentes do ness.OPS.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrações */}
        <Card>
          <CardHeader>
            <CardTitle>Integrações Planejadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Qulture.Rocks', 'Gupy', 'Feedz', 'LMS', 'Google Meet', 'Slack', 'Teams', 'ness.OPS'].map((tool) => (
                <div 
                  key={tool}
                  className="p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-600"
                >
                  {tool}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
