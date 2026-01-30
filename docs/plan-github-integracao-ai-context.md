# Plano: Ler GitHub e integrar ao repositório local (AI-context)

## Objetivo

Fluxo padronizado para **ler o GitHub**, identificar mudanças, integrar ao repositório local e manter o **AI-context** (`.context/docs`, `.context/agents`) alinhado ao codebase.

---

## 1. Fluxo resumido

```
GitHub (remote) → git pull → repositório local → docs/planos → .context/docs + .context/agents → context getMap + buildSemantic
```

---

## 2. Passos detalhados

### 2.1 Ler GitHub

1. **Pull do main**
   ```bash
   cd ness.OS
   git status                    # conferir estado local
   git stash push -m "antes-pull" # se houver mudanças locais
   git pull origin main --no-edit
   git stash pop                 # se usou stash
   ```

2. **Inspecionar commits recentes**
   ```bash
   git log origin/main --oneline -20
   git diff HEAD~N..HEAD --stat  # N = número de commits novos
   ```

3. **Listar arquivos novos/modificados**
   ```bash
   git diff --name-only HEAD@{1} HEAD   # após pull
   # ou
   git log -1 --name-only --pretty=format:  # último commit
   ```

### 2.2 Identificar artefatos relevantes

| Tipo | Pastas / arquivos típicos | Ação |
|------|---------------------------|------|
| Schema / migrations | `src/database/`, `supabase/migrations/` | Atualizar plan-ajuste-schema, architecture |
| Edge Functions | `src/supabase/functions/`, `supabase/functions/` | plan-github-artefatos, setup-mcp-supabase |
| Frontend | `src/app/`, `src/components/`, `src/hooks/`, `src/lib/` | data-flow, frontend-specialist, project-overview |
| Config / infra | `package.json`, `vercel.json`, `.env.example`, `.gitignore` | tooling, development-workflow |
| Docs | `README.md`, `SETUP.md`, `ARCHITECTURE.md` | Revisar e alinhar planos |

### 2.3 Integrar aos planos existentes

- **[plan-github-artefatos-iniciais](plan-github-artefatos-iniciais.md):** adicionar § nova com artefatos novos, próximos passos e referências.
- **[plan-ajuste-schema-ao-projeto](plan-ajuste-schema-ao-projeto.md):** atualizar se houve mudança em schemas ou integração frontend ↔ fin.
- **[plan-github-novos-passos-integracao](plan-github-novos-passos-integracao.md):** registrar a rodada (data, commits, checklist).
- **[setup-mcp-supabase](setup-mcp-supabase.md):** atualizar se houver mudança em migrations ou Edge Functions.

### 2.4 Atualizar AI-context (`.context/`)

**`.context/docs/`**

| Arquivo | Conteúdo a revisar |
|---------|--------------------|
| `project-overview.md` | Stack, estrutura `src/`, status dos módulos |
| `architecture.md` | Módulos, pastas, fluxo dados |
| `data-flow.md` | Frontend ↔ Supabase, hooks, queries `fin.*` |
| `tooling.md` | npm scripts, CLI, env vars |
| `glossary.md` | Termos novos |
| `development-workflow.md` | Setup, dev, deploy |

**`.context/agents/`**

| Arquivo | Conteúdo a revisar |
|---------|--------------------|
| `frontend-specialist.md` | `src/app`, componentes, hooks, lib |
| `feature-developer.md` | Padrões de novas features |
| `database-specialist.md` | Schemas, migrations |
| `backend-specialist.md` | Edge Functions, integrações |
| `architect-specialist.md` | Visão geral de mudanças |

### 2.5 Context MCP

1. **getMap** — verificar se o mapa reflete a estrutura atual:
   ```
   context({ action: "getMap", repoPath: "/home/resper/nessOS/ness.OS", section: "all" })
   ```

2. **buildSemantic** — reconstruir contexto semântico após mudanças:
   ```
   context({ action: "buildSemantic", repoPath: "/home/resper/nessOS/ness.OS", contextType: "documentation" })
   context({ action: "buildSemantic", repoPath: "/home/resper/nessOS/ness.OS", contextType: "compact" })
   ```

---

## 3. Checklist (execução)

- [ ] `git pull origin main` (ou branch relevante)
- [ ] Reconciliar conflitos (stash/merge)
- [ ] Listar commits e arquivos alterados
- [ ] Atualizar plan-github-artefatos-iniciais (se houver novos artefatos)
- [ ] Atualizar plan-ajuste-schema-ao-projeto (se houver mudança em schema/frontend)
- [ ] Registrar rodada em plan-github-novos-passos-integracao
- [ ] Atualizar setup-mcp-supabase (se aplicável)
- [ ] Atualizar `.context/docs` (project-overview, architecture, data-flow, tooling, glossary, development-workflow)
- [ ] Atualizar `.context/agents` (frontend-specialist, feature-developer, database-specialist, backend-specialist, architect-specialist)
- [ ] Rodar **context getMap**
- [ ] Rodar **context buildSemantic** (documentation + compact)

---

## 4. Referências

- [Plano mestre (workflow)](../.context/plans/ness-os-desenvolvimento.md) — consolidado; vinculado ao workflow PREVC
- [plan-github-artefatos-iniciais](plan-github-artefatos-iniciais.md)
- [plan-ajuste-schema-ao-projeto](plan-ajuste-schema-ao-projeto.md)
- [plan-github-novos-passos-integracao](plan-github-novos-passos-integracao.md)
- [setup-mcp-supabase](setup-mcp-supabase.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [.context/](../.context/)
