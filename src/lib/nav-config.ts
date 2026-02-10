/**
 * Configuração de navegação do ness.OS — módulos e áreas.
 * Áreas agrupam atividades correlatas (marketing, comercial, etc.).
 */

export type NavItem = { href: string; label: string };

export type NavArea = { id: string; title: string; items: NavItem[] };

export type NavModule = {
  id: string;
  title: string;
  /** Áreas (subgrupos). Se ausente, usa items direto. */
  areas?: NavArea[];
  /** Itens planos (para módulos sem áreas: JUR, GOV). */
  items?: NavItem[];
};

/** Módulos com áreas agrupadas. */
export const navModules: NavModule[] = [
  { id: 'inicio', title: 'Início', items: [{ href: '/app', label: 'Dashboard' }] },
  {
    id: 'growth',
    title: 'ness.GROWTH',
    areas: [
      { id: 'comercial', title: 'Comercial', items: [{ href: '/app/growth', label: 'Dashboard' }, { href: '/app/growth/leads', label: 'Leads' }, { href: '/app/growth/propostas', label: 'Propostas' }, { href: '/app/growth/upsell', label: 'Upsell' }] },
      { id: 'marketing', title: 'Marketing', items: [{ href: '/app/growth/posts', label: 'Posts' }, { href: '/app/growth/casos', label: 'Casos' }, { href: '/app/growth/brand', label: 'Brand' }] },
      { id: 'catalogo', title: 'Catálogo', items: [{ href: '/app/growth/services', label: 'Serviços' }] },
    ],
  },
  {
    id: 'ops',
    title: 'ness.OPS',
    areas: [
      { id: 'conhecimento', title: 'Conhecimento', items: [{ href: '/app/ops/playbooks', label: 'Playbooks' }, { href: '/app/ops/playbooks/chat', label: 'Knowledge Bot' }] },
      { id: 'operacao', title: 'Operação', items: [{ href: '/app/ops/service-actions', label: 'Service Actions' }, { href: '/app/ops/workflows', label: 'Workflows' }, { href: '/app/ops/metricas', label: 'Métricas' }, { href: '/app/ops/timer', label: 'Timer' }, { href: '/app/ops/indicators', label: 'Indicadores' }, { href: '/app/ops/assets', label: 'Assets' }] },
    ],
  },
  {
    id: 'people',
    title: 'ness.PEOPLE',
    areas: [
      { id: 'aquisição', title: 'Aquisição', items: [{ href: '/app/people/vagas', label: 'Vagas' }, { href: '/app/people/candidatos', label: 'Candidatos' }] },
      { id: 'desenvolvimento', title: 'Desenvolvimento', items: [{ href: '/app/people/gaps', label: 'Gaps' }, { href: '/app/people/avaliacao', label: '360º' }] },
    ],
  },
  {
    id: 'fin',
    title: 'ness.FIN',
    areas: [
      { id: 'visao-geral', title: 'Visão Geral', items: [{ href: '/app/fin', label: 'Visão Geral' }] },
      { id: 'contratos', title: 'Contratos', items: [{ href: '/app/fin/contratos', label: 'Contratos' }] },
      { id: 'financeiro', title: 'Financeiro', items: [{ href: '/app/fin/rentabilidade', label: 'Rentabilidade' }, { href: '/app/fin/alertas', label: 'Alertas' }, { href: '/app/fin/relatorios', label: 'Relatórios' }] },
    ],
  },
  {
    id: 'jur',
    title: 'ness.JUR',
    items: [
      { href: '/app/jur', label: 'Visão Geral' },
      { href: '/app/jur/conformidade', label: 'Conformidade' },
      { href: '/app/jur/risco', label: 'Risco' },
    ],
  },
  {
    id: 'gov',
    title: 'ness.GOV',
    items: [
      { href: '/app/gov', label: 'Visão Geral' },
      { href: '/app/gov/politicas', label: 'Políticas' },
      { href: '/app/gov/aceites', label: 'Aceites' },
    ],
  },
  {
    id: 'data',
    title: 'ness.DATA',
    items: [
      { href: '/app/data', label: 'Visão Geral' },
      { href: '/app/ops/indicators', label: 'Indicadores' },
      { href: '/app/fin/contratos', label: 'Sync ERP (Omie)' },
    ],
  },
];

/** Coleta todos os itens de um módulo (para checar pathname). */
export function getAllItems(module: NavModule): NavItem[] {
  if (module.items) return module.items;
  if (module.areas) return module.areas.flatMap((a) => a.items);
  return [];
}
