'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, FileCheck, Users, BookOpen, Construction } from 'lucide-react'

export default function GovPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Governança</h1>
          <p className="text-gray-500">Políticas, compliance e documentação</p>
        </div>

        {/* Em desenvolvimento */}
        <Card className="border-dashed border-2 border-ness-cyan/30 bg-ness-cyan/5">
          <CardContent className="p-8 text-center">
            <Construction size={48} className="mx-auto mb-4 text-ness-cyan" />
            <h2 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              O ness.GOV está sendo implementado. Funcionalidades planejadas:
            </p>
          </CardContent>
        </Card>

        {/* Preview das funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Políticas</p>
                  <p className="text-sm text-gray-500">Gestão de políticas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileCheck size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Compliance</p>
                  <p className="text-sm text-gray-500">Checklists e auditorias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Comitês</p>
                  <p className="text-sm text-gray-500">Atas e deliberações</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BookOpen size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Base de Conhecimento</p>
                  <p className="text-sm text-gray-500">Documentação interna</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frameworks */}
        <Card>
          <CardHeader>
            <CardTitle>Frameworks Suportados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['ISO 27001', 'ISO 27701', 'LGPD', 'SOC 2', 'NIST CSF', 'CIS Controls', 'PCI-DSS', 'HIPAA'].map((fw) => (
                <div 
                  key={fw}
                  className="p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-600"
                >
                  {fw}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
