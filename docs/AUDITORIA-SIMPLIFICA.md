# Auditoria — Redução de Complexidade (ness.OS)

> Primeira passada da Fase 1 do plano [reducao-complexidade-codebase](../.context/plans/reducao-complexidade-codebase.md).  
> Gerado no Ciclo 2 PREVC (etapa 9).

---

## 1. Server Actions (createClient / createServerClient)

| Arquivo | Chamadas | Domínio | Consolidar em (plano phase-2) |
|---------|----------|---------|-------------------------------|
| growth.ts | 14 | GROWTH (leads, posts, propostas) | growth.ts |
| ops.ts | 6 | OPS (playbooks, assets) | ops.ts |
| people.ts | 7 | PEOPLE (vagas, candidatos, gaps) | people.ts |
| fin.ts | 4 | FIN (contratos, rentabilidade) | fin.ts |
| gov.ts | 7 | GOV (políticas, aceites) | gov.ts |
| jur.ts | 4 | JUR (conformidade, risco) | jur.ts |
| ai.ts | 4 | IA (chat, propostas, conteúdo) | ai.ts |
| data.ts | 5 | Dados (indicadores, Omie, dólar) | data.ts |
| auth.ts | 3 | Auth | auth.ts |
| timesheet.ts | 11 | OPS (timer, métricas) | ops.ts ou timesheet.ts |
| static-pages.ts | 3 | Site (legais) | static-pages.ts |
| cases-public.ts | 3 | GROWTH (casos) | growth.ts |
| jobs-public.ts | 3 | PEOPLE (vagas públicas) | people.ts |

**Conclusão Fase 1 (auditoria):** 13 arquivos; padrão já por domínio (growth, ops, fin, people, jur, gov, ai, data). Próximo passo do plano: phase-2 (withSupabase em base.ts, consolidar onde houver duplicação real).

---

## 2. Componentes (inspeção resumida)

- `src/components/app/` — header, sidebar, theme (compartilhados).
- `src/components/shared/` — data-table, input-field, page-card (reutilizados).
- Módulos (fin, gov, growth, jur, ops, people) — componentes por domínio; candidatos a DataTable/EntityForm genérico conforme phase-3 do plano.

---

## 3. Próximos passos (plano reducao-complexidade-codebase)

- **Phase-2:** Implementar `withSupabase` em `src/lib/supabase/queries/base.ts`; consolidar actions por domínio onde houver duplicação.
- **Phase-3:** DataTable<T> e EntityForm<T> genéricos; unificar StatusBadge.
- **Phase-4:** Schemas Zod centralizados; prompts IA em lib/ai/prompts.ts.
- **Phase-5:** Índices e views (rentabilidade).
- **Phase-6:** Testes, tipos, lint, build, checklist manual.
