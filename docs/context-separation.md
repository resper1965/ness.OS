# Separação: Agentes da Aplicação vs Playbooks AI (AI-context)

## Regra

**Não misturar agentes da aplicação com agentes do AI-context.** Usar nomes e localizações distintas; em docs e conversas, sempre qualificar qual tipo se está a tratar.

---

## 1. Agentes da aplicação (ness.OS)

- **O que são:** Os 10 agentes de negócio do produto ness.OS (Vendas, Precificação, Marketing, Homogeneização, Mapeamento, Rentabilidade, Ciclo de Vida, Análise Contratual, Compliance, Correlação de Treinamento).
- **Onde:** Especificados em **`docs/agents/agents-specification.md`**. Implementados como **Edge Functions** (Deno) em `supabase/functions/`. Módulos em `docs/modules/*.md`.
- **Uso:** Parte do produto; operam sobre dados reais, KB/RAG, integrações (Omie, etc.).

---

## 2. Playbooks AI (AI-context)

- **O que são:** Roles/personas da IA que **desenvolve** o repositório (ex.: architect, backend, database, feature-developer). Guiam como a IA lida com código, docs e tarefas de desenvolvimento.
- **Onde:** **`.context/agents/`** (ex.: `architect-specialist.md`, `backend-specialist.md`). Fazem parte do scaffolding **AI-context** (`.context/`), não do produto.
- **Uso:** Cursor e ferramentas de desenvolvimento; **não** são os 10 agentes da aplicação.

---

## 3. Onde cada um aparece

| Conceito | Onde vive | Exemplo |
|----------|-----------|---------|
| Agentes da aplicação | `docs/agents/`, `docs/modules/`, Edge Functions | Agente de Precificação, Agente de Ciclo de Vida |
| Playbooks AI | `.context/agents/` | architect-specialist, feature-developer |

---

## 4. Redação

- Ao falar dos **10 agentes do produto:** usar **"agentes da aplicação"** ou **"agentes ness.OS"**.
- Ao falar dos **roles da IA que desenvolve:** usar **"Playbooks AI"** ou **"playbooks em .context/agents/"**.
- Evitar "agentes" sem qualificador quando o contexto puder ser ambíguo.

---

## 5. Referências

- Agentes da aplicação: [docs/agents/agents-specification.md](agents/agents-specification.md), [docs/modules/](modules/).
- Playbooks AI: [.context/agents/](../.context/agents/), [.context/docs/](../.context/docs/).
- Regras Cursor: `.cursor/rules/` na raiz do workspace (fora de `ness.OS/`).
