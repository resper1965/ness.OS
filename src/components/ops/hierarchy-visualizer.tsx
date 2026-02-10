'use client';

import { ChevronRight, Clock, DollarSign, ListChecks, FileText, Briefcase } from 'lucide-react';

export type HierarchyNode = {
  id: string;
  type: 'service' | 'action' | 'playbook' | 'task';
  title: string;
  duration: number;
  cost: number;
  children?: HierarchyNode[];
};

type Props = {
  root: HierarchyNode;
};

export function HierarchyVisualizer({ root }: Props) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-ness" />
          Análise de Composição e Custos
        </h3>
      </div>
      <div className="space-y-4">
        <NodeItem node={root} level={0} />
      </div>
    </div>
  );
}

function NodeItem({ node, level }: { node: HierarchyNode; level: number }) {
  const iconMap = {
    service: <Briefcase className="h-4 w-4 text-ness" />,
    action: <ListChecks className="h-4 w-4 text-blue-400" />,
    playbook: <FileText className="h-4 w-4 text-emerald-400" />,
    task: <ChevronRight className="h-4 w-4 text-slate-500" />,
  };

  const bgMap = {
    0: 'bg-ness/5 border-ness/20',
    1: 'bg-blue-500/5 border-blue-500/20',
    2: 'bg-emerald-500/5 border-emerald-500/20',
    3: 'bg-slate-800/5 border-slate-700/50',
  };

  return (
    <div className="space-y-2">
      <div 
        className={`flex items-center justify-between rounded-lg border p-3 ${bgMap[level as keyof typeof bgMap] || ''}`}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <div className="flex items-center gap-3">
          {iconMap[node.type]}
          <span className="text-sm font-medium text-slate-200">{node.title}</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="h-3 w-3" />
            {node.duration}m
          </div>
          <div className="flex items-center gap-1 text-ness-400">
            <DollarSign className="h-3 w-3" />
            {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(node.cost)}
          </div>
        </div>
      </div>
      {node.children && node.children.map((child) => (
        <NodeItem key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  );
}
