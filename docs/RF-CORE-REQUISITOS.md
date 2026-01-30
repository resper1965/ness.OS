# RF.CORE — Requisitos Core (ness.OS)

Requisitos fundamentais que se aplicam a todos os módulos do ness.OS.

---

## RF.CORE.01 — Auth Guard

**Descrição:** A rota `/app` deve exigir sessão ativa. Redirecionar para `/login` quando não autenticado.

**Estado atual:** Parcialmente implementado — `app/layout.tsx` já verifica `getUser()` e redireciona. Garantir que:
- Todas as rotas sob `/app/*` herdam essa proteção (via layout)
- Middleware ou layout cobre edge cases (token expirado, etc.)

**Entregas:**
- Verificar e documentar que o layout `/app` é a única porta de entrada
- Garantir redirect para `/login` com `?redirect=/app` ou similar para retorno pós-login
- Testes: acesso a `/app` sem sessão → redirect `/login`

---

## RF.CORE.02 — Dashboard Personalizado

**Descrição:** A Home (`/app`) exibe widgets diferentes baseados na Role do usuário.

**Roles existentes:** admin, sales, ops, fin, employee, superadmin (e legal no JUR)

**Mapeamento sugerido:**

| Role | Widgets exibidos |
|------|------------------|
| admin, superadmin | Todos os widgets (Growth, OPS, FIN, People) + visão geral |
| sales | Leads, Serviços, Propostas, Knowledge Bot |
| ops | Playbooks, Métricas, Knowledge Bot, Assets |
| fin | Contratos, Rentabilidade, Clientes |
| legal | (futuro) JUR: Análise de Risco, Conformidade |
| employee | Dashboard reduzido: Knowledge Bot, meus gaps, feedback |

**Entregas:**
- Buscar `profile.role` do usuário logado na página `/app`
- Renderizar widgets condicionalmente por role
- Manter fallback para roles não mapeados (ex.: mostrar todos ou subset padrão)
- Sidebar já pode ser filtrada por role (opcional)

---

## Dependência entre planos

Os planos de módulo (GROWTH-IC, OPS-EP, FIN-CFO, JUR-CP, GOV-PN, PPL-TC) assumem RF.CORE.01 e RF.CORE.02 como base. Implementar RF.CORE antes ou em paralelo às fases iniciais de cada módulo.
