'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, Server, AlertTriangle, Construction } from 'lucide-react'

export default function OpsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operações</h1>
          <p className="text-gray-500">Gestão de horas, recursos e monitoramento</p>
        </div>

        {/* Em desenvolvimento */}
        <Card className="border-dashed border-2 border-ness-cyan/30 bg-ness-cyan/5">
          <CardContent className="p-8 text-center">
            <Construction size={48} className="mx-auto mb-4 text-ness-cyan" />
            <h2 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              O ness.OPS está sendo implementado. Funcionalidades planejadas:
            </p>
          </CardContent>
        </Card>

        {/* Preview das funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Timesheet</p>
                  <p className="text-sm text-gray-500">Horas por projeto</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Equipe</p>
                  <p className="text-sm text-gray-500">Alocação de recursos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Server size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Infraestrutura</p>
                  <p className="text-sm text-gray-500">Custos cloud</p>
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
                  <p className="font-medium">Incidentes</p>
                  <p className="text-sm text-gray-500">SLA e chamados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrações planejadas */}
        <Card>
          <CardHeader>
            <CardTitle>Integrações Planejadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Clockify', 'Toggl', 'GLPI', 'Wazuh', 'AWS', 'Azure', 'GCP', 'Zabbix'].map((tool) => (
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
