'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { GrowthDashboardData } from '@/app/actions/growth';

type RecentLeadsCardProps = {
  recentLeads: GrowthDashboardData['recentLeads'];
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Novo',
  qualified: 'Qualificado',
  proposal: 'Proposta',
  won: 'Ganho',
  lost: 'Perdido',
};

/**
 * Últimos leads (inspirado no LeadsCard do CRM do clone).
 */
export function RecentLeadsCard({ recentLeads }: RecentLeadsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Últimos leads</CardTitle>
          <CardDescription>Leads mais recentes do funil.</CardDescription>
        </div>
        <Link
          href="/app/growth/leads"
          className="text-sm font-medium text-ness hover:underline"
        >
          Ver todos
        </Link>
      </CardHeader>
      <CardContent>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum lead ainda.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLeads.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell>{l.company ?? '—'}</TableCell>
                  <TableCell className="text-slate-400">
                    {l.origin_url ? (l.origin_url.length > 30 ? `${l.origin_url.slice(0, 30)}…` : l.origin_url) : '—'}
                  </TableCell>
                  <TableCell>{STATUS_LABELS[l.status] ?? l.status}</TableCell>
                  <TableCell className="text-right text-slate-400 text-xs">
                    {l.created_at
                      ? new Date(l.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
