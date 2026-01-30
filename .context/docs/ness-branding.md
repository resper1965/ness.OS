---
type: doc
name: ness-branding
description: Branding guidelines for ness. (company, product, modules, agents)
category: reference
---

# ness. Branding — Guia para AI-context

## Hierarquia de marca

| Nível | Formato | Exemplos |
|-------|---------|----------|
| Empresa | `ness.` | ness. (34 anos, cybersecurity) |
| Produto | `ness.OS` | ness.OS |
| Módulos | `ness.MODULO` | ness.FIN, ness.OPS, ness.GROWTH, ness.JUR, ness.GOV, ness.PEOPLE |
| Agentes (UI) | `ness.Nome` | ness.Advisor, ness.Proposal, ness.Legal, ness.Mentor |
| Agentes (código) | `rex.modulo` | rex.fin, rex.ops, rex.growth (interno) |

## Regras para geração de conteúdo

1. **Texto para usuário (UI, docs, marketing):** usar `ness.OS`, `ness.FIN`, `ness.Advisor`, etc.
2. **Código interno (prompts, Edge Functions):** usar `rex.fin`, `rex.ops`, etc.
3. **Empresa:** sempre `ness.` (com ponto).
4. **Rodapé:** `© 2025 ness. Todos os direitos reservados.`
5. **Domínio:** app.ness.com.br | **Email:** *@ness.com.br

## Cores e tipografia

- Cores: `theme.colors.ness.cyan` (#00ade8), `ness.dark`, `ness.gray`
- Fonte: Montserrat (identidade ness.)

## Mapeamento agentes

- rex.fin → ness.Advisor / ness.Analyst
- rex.ops → ness.PostMortem
- rex.growth → ness.Proposal, ness.Pricing
- rex.jur → ness.Legal
- rex.gov → ness.Compliance
- rex.people → ness.Mentor

Ver [docs/plan-ness-branding-ai-context](../../docs/plan-ness-branding-ai-context.md) para plano completo.

## Integração com site institucional

Site como apps/site no projeto ness.OS. **Páginas imutáveis** — copiadas sem alteração. Preservar theme, animações, Framer Motion. ness.OS publica o site; corp-site-ness descontinuado. Ver [plan-integracao-nessos-site-institucional](../../docs/plan-integracao-nessos-site-institucional.md) §2 e §11.
