'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type LeadBySourceItem = { source: string; count: number };

type LeadBySourceCardProps = {
  items: LeadBySourceItem[];
  total: number;
};

const SOURCE_COLORS: Record<string, string> = {
  Site: 'bg-blue-500',
  Contato: 'bg-emerald-500',
  Soluções: 'bg-amber-500',
  Blog: 'bg-rose-500',
  Casos: 'bg-violet-500',
  Outros: 'bg-slate-500',
};

export function LeadBySourceCard({ items, total }: LeadBySourceCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Leads por origem</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="text-center">
          <span className="text-3xl font-semibold tracking-tight text-white">
            {total.toLocaleString('pt-BR')}
          </span>
          <p className="text-sm text-slate-400">Leads</p>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum lead ainda.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.source} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${SOURCE_COLORS[item.source] ?? 'bg-slate-500'}`}
                  />
                  <span className="text-sm font-medium text-slate-200">{item.source}</span>
                </div>
                <span className="text-sm text-slate-400">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
