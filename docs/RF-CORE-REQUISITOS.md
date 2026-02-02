# RF.CORE — Requisitos Core (ness.OS)

Requisitos fundamentais que se aplicam a todos os módulos do ness.OS.

---

## RF.CORE.01 — Auth Guard

**Descrição:** A rota `/app` deve exigir sessão ativa. Redirecionar para `/login` quando não autenticado.

**Estado atual:** ✅ Implementado e validado.
- `app/layout.tsx` verifica `getUser()` e redireciona para `/login?redirect=/app`
- Todas as rotas sob `/app/*` herdam proteção via layout
- LoginForm recebe `redirect` da query e repassa ao signIn; pós-login redireciona para o path informado

**Entregas:**
- [x] Layout `/app` é a única porta de entrada
- [x] Redirect para `/login` com `?redirect=/app`; retorno pós-login usa o redirect

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

**Estado atual:** ✅ Implementado.
- Página `/app` busca `profile.role` do usuário
- Widgets renderizados condicionalmente por role (admin, superadmin, sales, ops, fin, employee, legal)
- Fallback para roles não mapeados: usa ROLE_WIDGETS.admin (todos)

**Entregas:**
- [x] Buscar profile.role na página /app
- [x] Renderizar widgets condicionalmente por role
- [x] Fallback para roles não mapeados

---

## Dependência entre planos

Os planos de módulo (GROWTH-IC, OPS-EP, FIN-CFO, JUR-CP, GOV-PN, PPL-TC) assumem RF.CORE.01 e RF.CORE.02 como base. Implementar RF.CORE antes ou em paralelo às fases iniciais de cada módulo.
