'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Search, AlertTriangle, Clock, Construction } from 'lucide-react'

export default function JurPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jurídico</h1>
          <p className="text-gray-500">Gestão de contratos e compliance</p>
        </div>

        {/* Em desenvolvimento */}
        <Card className="border-dashed border-2 border-ness-cyan/30 bg-ness-cyan/5">
          <CardContent className="p-8 text-center">
            <Construction size={48} className="mx-auto mb-4 text-ness-cyan" />
            <h2 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              O ness.JUR está sendo implementado. Funcionalidades planejadas:
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
                  <p className="font-medium">Contratos</p>
                  <p className="text-sm text-gray-500">Repositório de documentos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Search size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Análise</p>
                  <p className="text-sm text-gray-500">Revisão por IA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Riscos</p>
                  <p className="text-sm text-gray-500">Cláusulas críticas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Prazos</p>
                  <p className="text-sm text-gray-500">Vencimentos e renovações</p>
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
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">🤖 ness.Legal</p>
              <p className="text-sm text-gray-500">
                Análise automática de contratos, identificação de riscos, extração de cláusulas importantes, 
                e alertas de vencimentos. Usa RAG com pgvector para busca semântica em documentos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
