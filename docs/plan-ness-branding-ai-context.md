# Plano: ness. branding com AI-context

## Objetivo

Estabelecer e aplicar o **branding ness.** de forma consistente em todo o projeto, integrando as regras ao **AI-context** para que a IA use nomenclatura e referências corretas ao gerar código, documentação e UI.

---

## 1. Hierarquia de marca ness.

| Nível | Formato | Exemplo | Uso |
|-------|---------|---------|-----|
| **Empresa** | `ness.` | ness. | Nome da empresa (34 anos, cybersecurity) |
| **Produto** | `ness.OS` | ness.OS | Plataforma de gestão |
| **Módulos** | `ness.MODULO` | ness.FIN, ness.OPS, ness.GROWTH, ness.JUR, ness.GOV, ness.PEOPLE | Módulos do sistema |
| **Agentes (produto)** | `ness.Nome` | ness.Advisor, ness.Proposal, ness.Legal, ness.Mentor | Agentes visíveis ao usuário |
| **Agentes (código)** | `rex.modulo` | rex.fin, rex.ops, rex.growth | Nomes internos para prompts e Edge Functions (Fase 6) |

**Nota:** `rex.*` é convenção interna para os agentes conversacionais (DEVELOPMENT_PLAN Fase 6). Em UI e docs para usuário, preferir `ness.Nome` (ness.Advisor, ness.Proposal, etc.).

---

## 2. Convenções de nomenclatura

### 2.1 Escrita

| Regra | Correto | Incorreto |
|-------|---------|-----------|
| Ponto após ness | ness.OS, ness.FIN | nessOS, ness FIN |
| Maiúsculas nos módulos | ness.FIN, ness.OPS | ness.fin, ness.ops |
| Empresa com ponto | ness. | ness |
| Título da página | ness.OS | Ness.OS |

### 2.2 Domínios e emails

| Tipo | Formato | Exemplo |
|------|---------|---------|
| App | app.ness.com.br | Produção |
| Email | *@ness.com.br | admin@ness.com.br, esper@ness.com.br |

### 2.3 Cores e tipografia (Tailwind / CSS)

- **Cores:** `theme.colors.ness.cyan`, `ness.dark`, `ness.gray` (já em tailwind.config.ts)
- **Fonte:** Montserrat para identidade ness. (globals.css)
- **Primary:** `#00ade8` (cyan ness.)

### 2.4 Rodapé / copyright

- `© 2025 ness. Todos os direitos reservados.`
- `Proprietário - ness. Cybersecurity`
- Tagline: *"Invisíveis quando tudo funciona. Presentes quando mais importa."*

---

## 3. Mapeamento agentes → ness. (UI)

| Agente interno (rex.) | Nome produto (ness.) | Módulo |
|-----------------------|----------------------|--------|
| rex.fin | ness.Advisor / ness.Analyst | ness.FIN |
| rex.ops | ness.PostMortem | ness.OPS |
| rex.growth | ness.Proposal, ness.Pricing | ness.GROWTH |
| rex.jur | ness.Legal | ness.JUR |
| rex.gov | ness.Compliance | ness.GOV |
| rex.people | ness.Mentor | ness.PEOPLE |
| rex.kb | ness.Research | KB |
| rex.master | ness.Advisor (orquestrador) | Cross-módulo |

---

## 4. Integração com AI-context

### 4.1 Documentos a criar/atualizar

| Arquivo | Ação |
|---------|------|
| `.context/docs/ness-branding.md` | **Criar** — guia de branding (resumo deste plano) |
| `.context/docs/glossary.md` | **Atualizar** — adicionar entradas ness., rex., convenções |
| `.cursor/rules/ness-branding.mdc` | **Criar** — regra Cursor para aplicar branding em código e docs |

### 4.2 Conteúdo do guia de branding (`.context/docs/ness-branding.md`)

- Hierarquia de marca (§1)
- Convenções de nomenclatura (§2)
- Mapeamento agentes (§3)
- Instrução: "Ao gerar UI, docs ou texto para usuário, usar **ness.** (ness.OS, ness.FIN, ness.Advisor, etc.). Ao referenciar código interno de agentes (prompts, Edge Functions), usar **rex.** (rex.fin, rex.ops)."

### 4.3 Atualização do glossary

Adicionar:

- **ness.** — Empresa; usa ponto: "ness.".
- **ness.OS** — Produto; plataforma de gestão.
- **ness.FIN, ness.OPS, …** — Módulos; maiúsculas.
- **ness.Advisor, ness.Proposal, …** — Nomes de agentes na UI.
- **rex.*** — Nomes internos dos agentes conversacionais (código, prompts).

### 4.4 Regra Cursor (`.cursor/rules/ness-branding.mdc`)

```
Quando escrever texto visível ao usuário (UI, docs, emails):
- Usar "ness.OS" para o produto
- Usar "ness.FIN", "ness.OPS", etc. para módulos
- Usar "ness.Advisor", "ness.Proposal", "ness.Legal", etc. para agentes na UI
- Usar "ness." para a empresa (com ponto)
- Rodapé: © 2025 ness. Todos os direitos reservados.

Quando escrever código ou configs internos:
- Edge Functions de agentes: rex.fin, rex.ops, etc.
- Schemas, tabelas: fin, ops, growth (minúsculas)
```

---

## 5. Checklist de aplicação

### 5.1 Docs e AI-context

- [x] Criar `.context/docs/ness-branding.md`
- [x] Atualizar `.context/docs/glossary.md` com termos ness.
- [x] Criar `.cursor/rules/ness-branding.mdc` (em `.cursor/rules/` na raiz do workspace)
- [ ] Rodar **context buildSemantic** após alterações

### 5.2 Código e UI (auditoria)

- [ ] `layout.tsx`: title "ness.OS"
- [ ] `app-layout.tsx`: footer/copyright com ness.
- [ ] Páginas de módulo: "ness.FIN", "ness.OPS", etc. nos títulos
- [ ] Agentes na UI: ness.Advisor, ness.Proposal, ness.Legal, ness.Mentor, ness.PostMortem
- [ ] `tailwind.config.ts`: cores ness. já definidas
- [ ] `globals.css`: comentário Montserrat para ness.

### 5.3 Inconsistências conhecidas

| Local | Atual | Ação |
|-------|-------|------|
| README módulos | FIN, OPS (sem ness.) | Preferir ness.FIN, ness.OPS em títulos |
| DEVELOPMENT_PLAN | rex.fin, rex.ops | Manter (código interno) |
| Pages (growth, jur, people) | ness.Proposal, ness.Legal, ness.Mentor | OK |
| DATABASE_SCHEMA | rex.master, rex.fin… | OK (interno) |

---

## 6. Referências

- [ARCHITECTURE](ARCHITECTURE.md)
- [README](../README.md)
- [docs/agents/agents-specification](agents/agents-specification.md)
- [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md) — rex.* em Fase 6
- [.context/docs/glossary](../.context/docs/glossary.md)
