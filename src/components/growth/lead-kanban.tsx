'use client';

import { updateLeadStatus } from '@/app/actions/growth';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type Column = { key: string; label: string; help?: string };

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  status: string;
  created_at: string;
  origin_url: string | null;
};

type LeadKanbanProps = {
  columns: readonly Column[];
  leadsByStatus: Record<string, Lead[]>;
};

export function LeadKanban({ columns, leadsByStatus }: LeadKanbanProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function moveTo(status: string, leadId: string) {
    startTransition(() => {
      updateLeadStatus(leadId, status).then(() => router.refresh());
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {columns.map((col) => (
        <div
          key={col.key}
          className="rounded-lg border border-slate-700 bg-slate-800/30 min-h-[200px]"
        >
          <div className="px-4 py-3 border-b border-slate-700">
            <h2 className="font-semibold text-slate-200">{col.label}</h2>
            <span className="text-xs text-slate-400">
              {(leadsByStatus[col.key] ?? []).length} leads
            </span>
            {col.help && <p className="text-xs text-slate-500 mt-1">{col.help}</p>}
          </div>
          <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
            {(leadsByStatus[col.key] ?? []).map((lead) => (
              <div
                key={lead.id}
                className="rounded-md border border-slate-700 bg-slate-800/50 p-4"
              >
                <p className="font-medium text-white text-sm">{lead.name}</p>
                <p className="text-xs text-slate-400">{lead.email}</p>
                {lead.company && (
                  <p className="text-xs text-slate-500 mt-1">{lead.company}</p>
                )}
                {lead.message && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {lead.message}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {columns
                    .filter((c) => c.key !== lead.status)
                    .map((c) => (
                      <button
                        key={c.key}
                        onClick={() => moveTo(c.key, lead.id)}
                        disabled={isPending}
                        className="text-xs rounded px-2 py-1 bg-slate-700 text-slate-300 hover:bg-ness/20 hover:text-ness disabled:opacity-50"
                      >
                        → {c.label}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
