---
status: filled
generated: 2026-01-30
planVinculado: docs/FLUXO-INPUTS-EXPLICATIVOS.md
agents:
  - type: "frontend-specialist"
    role: "Implementar labels, help texts e placeholders nos formulários"
  - type: "feature-developer"
    role: "Aplicar padrão em todos os forms do app"
  - type: "documentation-writer"
    role: "Documentar especificação de inputs para manutenção"
docs:
  - "project-overview.md"
  - "glossary.md"
phases:
  - id: "phase-1"
    name: "Inventário e especificação"
    prevc: "P"
  - id: "phase-2"
    name: "Componente HelpText e padrão"
    prevc: "E"
  - id: "phase-3"
    name: "Aplicar em formulários"
    prevc: "E"
  - id: "phase-4"
    name: "Validação e ajustes"
    prevc: "V"
---

# Fluxo explicativo de etapas e inputs — labels, placeholders e exemplos

> Adicionar explicação em cada etapa dos fluxos e em cada input: o que é esperado, formato e exemplos. Melhora UX e reduz erros de preenchimento.

## Objetivo
- **Primary goal:** Cada input deve ter label claro, help text explicando o que preencher, placeholder com exemplo real.
- **Success signal:** Usuário entende o que inserir em qualquer campo sem consultar documentação.

---

## Inventário de formulários e inputs

### 1. Site público

#### Contato (`contact-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Nome | text | Nome completo do contato | João Silva | Seu nome ou da pessoa responsável |
| E-mail | email | E-mail corporativo | joao@empresa.com.br | Usaremos para responder sua mensagem |
| Empresa | text | Razão social ou nome fantasia | NESS Tecnologia | Opcional — ajuda na triagem |
| Mensagem | textarea | Dúvida, solicitação ou pedido de proposta | Gostaria de conhecer a solução de SecOps... | Descreva como podemos ajudar. Se for proposta, inclua porte da empresa e necessidade. |

#### Candidatura (`application-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Nome | text | Nome completo | Maria Santos | Nome como aparece no currículo |
| E-mail | email | E-mail principal | maria.santos@email.com | Usaremos para contato sobre a vaga |
| LinkedIn | url | URL do perfil LinkedIn | https://linkedin.com/in/mariasantos | Opcional — acelera a análise |
| Mensagem | textarea | Carta de apresentação ou observações | Tenho 5 anos em DevOps... | Opcional — destaque experiências relevantes à vaga |

---

### 2. App interno — OPS

#### Playbook (`playbook-editor-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Título | text | Nome descritivo do manual | Manual de SecOps — Checklist de Deploy | Nome legível. Aparece no catálogo e no Knowledge Bot. |
| Slug | text | Identificador único na URL, minúsculo, hífens | manual-secops-checklist | Sem espaços ou acentos. Ex.: `manual-secops-checklist` |
| Conteúdo | textarea | Markdown com procedimentos | ## Pré-requisitos\n- Acesso ao... | Procedimentos passo a passo. O Knowledge Bot usa esse texto para responder dúvidas. |

#### Métricas (`metricas-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Contrato | select | Cliente/contrato do mês | Cliente XYZ — jan/25 | Contrato que receberá a métrica |
| Mês | month | Mês de referência (YYYY-MM) | 2025-01 | Mês ao qual se referem horas e custos |
| Horas trabalhadas | number | Horas efetivas no contrato | 40 | Pode ser decimal (ex.: 37,5) |
| Custo (R$) | number | Custo operacional (cloud, horas, etc.) | 2500.00 | Valores que reduzem a rentabilidade |
| SLA atingido | checkbox | Sim/Não | Sim | Marque se o SLA do contrato foi cumprido no mês |

---

### 3. App interno — Growth

#### Serviço (`service-form.tsx`, `service-edit-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Nome | text | Nome comercial do serviço | N-SecOps | Nome exibido em /solucoes |
| Slug | text | Identificador na URL | n-secops | Minúsculo, hífens. Ex.: `n-secops` |
| Playbook | select | Playbook vinculado (obrigatório) | Manual SecOps | Serviço ativo exige playbook. Trava Growth×OPS. |
| Pitch | textarea | Frase de marketing para listagem | Segurança e compliance automatizados. | 1–2 frases. Aparece nos cards de soluções. |

#### Post (`post-editor-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Título | text | Título do artigo | Como migrar para cloud com segurança | Título que aparecerá no blog |
| Slug | text | URL do post | como-migrar-cloud-seguranca | Minúsculo, hífens. Ex.: `como-migrar-cloud-seguranca` |
| Meta description (SEO) | textarea | Descrição para buscadores (~155 chars) | Guia prático de migração cloud... | Breve resumo. Aparece no Google. |
| Conteúdo | textarea | Markdown ou HTML | ## Introdução\nMigrar para... | Corpo do artigo. Suporta Markdown. |
| Publicar no site | checkbox | Sim/Não | Sim | Se marcado, aparece em /blog |

---

### 4. App interno — FIN

#### Cliente (`client-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Nome | text | Razão social ou nome fantasia | Empresa XYZ Ltda | Nome do cliente para contratos e relatórios |

#### Contrato (`contract-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Cliente | select | Cliente existente | Empresa XYZ Ltda | Adicione o cliente antes, se necessário |
| MRR (R$) | number | Receita mensal recorrente | 5000.00 | Valor que o cliente paga por mês |
| Data início | date | Início da vigência | 2025-01-01 | Quando o contrato passa a valer |
| Data fim | date | Fim da vigência | 2025-12-31 | Opcional — deixe vazio se indefinido |

---

### 5. App interno — People

#### Vaga (`job-form.tsx`)
| Input | Tipo | Esperado | Exemplo | Help text sugerido |
|-------|------|----------|---------|-------------------|
| Título | text | Nome da vaga | Desenvolvedor Full Stack | Título exibido em /carreiras |
| Slug | text | Identificador na URL | desenvolvedor-fullstack | Minúsculo, hífens. Ex.: `desenvolvedor-fullstack` |
| Departamento | text | Área da vaga | Tecnologia | Ex.: Tecnologia, Comercial, OPS |
| Descrição | textarea | HTML com requisitos e benefícios | `<p>Procuramos...</p>` | Conteúdo da página da vaga. HTML permitido. |

---

### 6. Kanban de Leads (`lead-kanban.tsx`)
- Sem inputs de formulário — arrastar cards entre colunas.
- Adicionar descrição de cada coluna: Novo → Em Análise → Qualificado → Descartado.

---

## Padrão de UI proposto

Para cada input:
1. **Label** — já existe.
2. **Help text** — `<p class="text-xs text-slate-500 mt-1">...</p>` abaixo do input.
3. **Placeholder** — exemplo concreto (não genérico como "Digite...").

Componente reutilizável sugerido:

```tsx
// FormField com label, help, placeholder
<div>
  <label htmlFor={id} className="...">{label}</label>
  <input id={id} placeholder={placeholder} ... />
  {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
</div>
```

---

## Fases de execução

### Phase 1 — Inventário e especificação ✅
- Inventário completo (acima).
- Aprovação da tabela de inputs.

### Phase 2 — Componente e padrão
- Criar `FormField` ou similar em `src/components/ui/`.
- Definir props: `label`, `helpText`, `placeholder`, `required`, etc.

### Phase 3 — Aplicar em formulários
Ordem sugerida:
1. `contact-form.tsx`, `application-form.tsx` (site)
2. `playbook-editor-form.tsx`, `metricas-form.tsx` (OPS)
3. `service-form.tsx`, `service-edit-form.tsx`, `post-editor-form.tsx` (Growth)
4. `client-form.tsx`, `contract-form.tsx` (FIN)
5. `job-form.tsx` (People)
6. Adicionar legenda nas colunas do LeadKanban

### Phase 4 — Validação
- Revisar todos os formulários em dev.
- Verificar acessibilidade (label + aria-describedby para help).
- Atualizar `docs/glossary.md` com convenções de slug/placeholders.

---

## Referências
- [Documentation Index](../docs/README.md)
- [Glossary](../docs/glossary.md) — convenções de domínio
- [Plans Index](./README.md)
