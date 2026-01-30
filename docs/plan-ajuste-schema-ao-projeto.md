# Plano: Ajustar os schemas ao projeto principal (usando AI-context)

## Objetivo

Alinhar o schema do banco (hoje só `fin` em `001_schema_fin.sql`) ao **projeto principal** (ARCHITECTURE, modelo conceitual, fluxos) e manter o **AI-context** (`.context/docs`, `.context/agents`) coerente com o estado real e planejado dos schemas.

---

## 1. Estado atual

### 1.1 Implementado

- **Schema `fin`** (`src/database/001_schema_fin.sql`).
- **Schema RBAC** (`supabase/migrations/001_rbac_schema.sql`): `profiles`, `user_permissions`, `audit_log`; roles: superadmin, adm-area, user-area. Ver [DATABASE_SCHEMA](DATABASE_SCHEMA.md).
- **Tabelas:** `clientes`, `contratos`, `categorias`, `receitas`, `despesas`, `rentabilidade`, `alertas`, `configuracoes`, `sync_log`.
- **Views:** `vw_rentabilidade_cliente`, `vw_contratos_vencendo`, `vw_fluxo_caixa`.
- **Functions:** `calcular_rentabilidade`, `gerar_alertas_vencimento`, `update_updated_at`.
- **Triggers:** `updated_at` em clientes, contratos, receitas, despesas.
- **RLS:** políticas SELECT para `authenticated`; INSERT/UPDATE em `fin.alertas`.
- **Cron:** `gerar-alertas-vencimento` (diário 8h).
- **Extensões:** `uuid-ossp`, `pg_cron`. **Sem `vector`.**

### 1.2 Projeto principal (ARCHITECTURE + conceptual-model)

- **Schemas:** `fin`, `ops`, `growth`, `jur`, `gov`, `people`, `kb`.
- **Tabelas por schema:**

  | Schema | Tabelas |
  |--------|--------|
  | fin | contratos, receitas, despesas, rentabilidade (+ clientes, categorias, alertas, config, sync_log já existem) |
  | ops | recursos_consumidos, erros_operacionais |
  | growth | propostas, casos_sucesso |
  | jur | analises |
  | gov | aceites (e políticas, conforme conceptual) |
  | people | avaliacoes |
  | kb | documentos (embedding, metadata) |

- **Fluxos:** OPS→FIN→GROWTH, OPS→PEOPLE, OPS→GROWTH (marketing), FIN (alertas), JUR, GOV.

### 1.3 Dependências a preservar

- **sync-omie** e **SETUP** assumem `fin.*` (clientes, contratos, receitas, despesas, categorias, sync_log). Nenhuma alteração em `fin` pode quebrar nomes ou tipos usados pela Edge Function.

---

## 2. Ajustes em `fin` (sem quebrar sync-omie)

- Manter todas as tabelas e colunas usadas por `sync-omie`.
- **Opcional (migrations aditivas):**
  - Campos do modelo conceitual ainda não existentes (ex.: `fin.clientes`: `setor`, `porte`; `fin.contratos`: `tipo` MSS/PROJETO/CONSULTORIA, `valor_total`, `moeda`) como colunas adicionais ou em `metadata` JSONB, conforme decisão futura.
- **Extensões:** não alterar `001`; adicionar `vector` apenas em migration que criar `kb`.

---

## 3. Novos schemas e tabelas (migrations futuras)

Ordem sugerida, alinhada ao roadmap (Fase 1 = FIN; depois OPS, GROWTH, JUR, GOV, PEOPLE):

| Migração | Schemas / tabelas | Observação |
|----------|-------------------|------------|
| **002** | `ops`: `recursos_consumidos`, `erros_operacionais` | Estrutura mínima conforme conceptual-model; `recursos_consumidos.contrato_id` → `fin.contratos`. |
| **003** | `growth`: `propostas`, `casos_sucesso` | `propostas.cliente_id` → `fin.clientes`; `casos_sucesso` link opcional a contrato/cliente. |
| **004** | `kb`: `documentos` | Habilitar `vector`; `embedding vector(1536)`; ivfflat; `modulo`, `tipo`, `titulo`, `conteudo`, `metadata`. |
| **005** | `jur`: `analises` | `contrato_id` → `fin.contratos`; `status`, `score_risco`, `riscos` JSONB, `parecer`, etc. |
| **006** | `gov`: `politicas`, `aceites` | Conforme conceptual (políticas, aceites com data, IP, hash, etc.). |
| **007** | `people`: `avaliacoes` | Estrutura mínima 360º; `colaborador_id` etc. |

- Cada migration em arquivo próprio, ex.: `src/database/002_schema_ops.sql`, etc.
- RLS e grants por schema, seguindo o padrão de `fin`.
- Atualizar **SETUP** e **AI-context** quando cada migration for adotada.

---

## 4. AI-context a manter atualizado

### 4.1 `.context/docs`

- **architecture.md:**  
  - Indicar que o schema **implementado** está em `src/database/` (hoje `001_schema_fin.sql`).  
  - Listar schemas **fin** (implementado) vs **ops, growth, jur, gov, people, kb** (planejados).  
  - Referir este plano e `docs/data-model/conceptual-model.md`.

- **data-flow.md:**  
  - Reforçar que **fin** está implementado (tabelas, views, functions, cron).  
  - Manter fluxos OPS→FIN→GROWTH etc.; indicar que **ops/growth/jur/gov/people** dependem das migrations futuras.  
  - Mencionar **kb** para RAG quando `004` existir.

- **glossary.md:**  
  - Entradas para schemas `fin`, `ops`, `growth`, `jur`, `gov`, `people`, `kb` e para `src/database/` (migrations).

### 4.2 `.context/agents`

- **database-specialist.md:**  
  - Schema **fin** em `001_schema_fin.sql`; demais schemas via migrations `002`–`007`.  
  - Referência a `docs/data-model/conceptual-model.md`, `docs/plan-ajuste-schema-ao-projeto.md` e à regra de não quebrar sync-omie.

- **backend-specialist.md:**  
  - Confirmar uso de `fin.*` pela Edge Function **sync-omie**; futuras integrações com `ops`, `growth`, etc., conforme migrations.

### 4.3 Uso do context MCP

- **getMap:**  
  - Atualizar o codebase map incluindo `src/database/`, `src/supabase/functions/`, para refletir schema e sync-omie.

- **buildSemantic:**  
  - Rodar após alterações em `.context/docs` (ex.: `contextType: "documentation"` ou `"compact"`) para manter o contexto semântico alinhado ao projeto e aos schemas.

- **scaffoldPlan (opcional):**  
  - Usar para criar ou revisar planos (ex.: “schema-ops”, “schema-kb”) conforme novas migrations forem planejadas.

---

## 5. Checklist de execução

- [ ] Manter `001_schema_fin.sql` e sync-omie compatíveis; não remover/renomear colunas ou tabelas usadas pelo sync.
- [ ] Atualizar `.context/docs/architecture.md` e `data-flow.md` com estado real vs planejado dos schemas.
- [ ] Atualizar `.context/docs/glossary.md` com schemas e migrations.
- [ ] Atualizar `.context/agents/database-specialist.md` e `backend-specialist.md` conforme §4.2.
- [ ] Rodar **getMap** (e, se disponível, **buildSemantic**) para AI-context coerente.
- [ ] Ao criar novas migrations (002–007), atualizar SETUP, este plano e o AI-context.
- [ ] Incluir **frontend** (src/app, src/components, src/lib) no AI-context e no getMap; ver [plan-github-novos-passos-integracao](plan-github-novos-passos-integracao.md).

---

## 7. Frontend (Novos passos GitHub)

- **App Next.js 14** em `src/app/` (dashboard, `fin/contratos`, `fin/rentabilidade`, `fin/alertas`), `src/components/`, `src/lib/supabase.ts` (tipos `fin`), `utils.ts`.
- Consome `fin.*` via Supabase (hoje parte mock; migrar para queries reais). Ver [plan-github-artefatos-iniciais](plan-github-artefatos-iniciais.md) §6 e [plan-github-novos-passos-integracao](plan-github-novos-passos-integracao.md).

---

## 6. Referências

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [docs/data-model/conceptual-model.md](data-model/conceptual-model.md)
- [docs/architecture/data-flow.md](architecture/data-flow.md)
- [docs/architecture/tech-stack-supabase.md](architecture/tech-stack-supabase.md)
- [SETUP.md](../SETUP.md) · [src/database/001_schema_fin.sql](../src/database/001_schema_fin.sql)
- [docs/context-separation.md](context-separation.md) · [.context/](../.context/)
- [docs/plan-github-novos-passos-integracao.md](plan-github-novos-passos-integracao.md)
