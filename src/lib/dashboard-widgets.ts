/**
 * Widgets do Dashboard (/app) por role. Usado pela página para renderizar links condicionalmente.
 * Testável em isolation (FASE 5 — baseline testes).
 */

export const ALL_WIDGETS = [
  { key: 'leads' as const, href: '/app/growth/leads', title: 'Leads', desc: 'Leads do site em Kanban. Qualifique e acompanhe conversões.' },
  { key: 'playbooks' as const, href: '/app/ops/playbooks', title: 'Playbooks', desc: 'Manuais técnicos. Tudo que vendemos tem um playbook.' },
  { key: 'knowledge-bot' as const, href: '/app/ops/playbooks/chat', title: 'Knowledge Bot', desc: 'Tire dúvidas sobre procedimentos usando IA.' },
  { key: 'services' as const, href: '/app/growth/services', title: 'Serviços', desc: 'Catálogo de soluções. Vinculado aos playbooks.' },
  { key: 'propostas' as const, href: '/app/growth/propostas', title: 'Propostas', desc: 'Propostas comerciais para clientes.' },
  { key: 'metricas' as const, href: '/app/ops/metricas', title: 'Métricas', desc: 'Horas, custo cloud e SLA por contrato.' },
  { key: 'assets' as const, href: '/app/ops/assets', title: 'Assets', desc: 'Arquivos e ativos de marca.' },
  { key: 'contratos' as const, href: '/app/fin/contratos', title: 'Contratos', desc: 'Contratos e clientes.' },
  { key: 'rentabilidade' as const, href: '/app/fin/rentabilidade', title: 'Rentabilidade', desc: 'Receita menos custos por contrato.' },
  { key: 'vagas' as const, href: '/app/people/vagas', title: 'Vagas', desc: 'Vagas abertas aparecem em /carreiras.' },
  { key: 'gaps' as const, href: '/app/people/gaps', title: 'Gaps', desc: 'Registro de gaps de treinamento.' },
] as const;

export type WidgetKey = (typeof ALL_WIDGETS)[number]['key'];
export type Widget = (typeof ALL_WIDGETS)[number];

const ROLE_WIDGETS: Record<string, readonly WidgetKey[]> = {
  admin: ALL_WIDGETS.map((w) => w.key),
  superadmin: ALL_WIDGETS.map((w) => w.key),
  sales: ['leads', 'services', 'propostas', 'knowledge-bot'],
  ops: ['playbooks', 'metricas', 'knowledge-bot', 'assets'],
  fin: ['contratos', 'rentabilidade'],
  cfo: ['contratos', 'rentabilidade'],
  employee: ['knowledge-bot', 'gaps'],
  legal: ['leads', 'knowledge-bot'],
};

/** Retorna widgets permitidos para o role; fallback admin se role desconhecido. */
export function getWidgetsForRole(role: string): Widget[] {
  const allowedKeys = ROLE_WIDGETS[role] ?? ROLE_WIDGETS.admin;
  return ALL_WIDGETS.filter((w) => allowedKeys.includes(w.key));
}
