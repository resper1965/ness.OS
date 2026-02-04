# Fase V — Verificação: Adaptação layout Bundui → ness.OS

Plano: `adaptacao-layout-bundui-nessos`. Evidência de verificação automatizada e checklist.

---

## Step 1 — Rotas e navegação

**Ação:** Garantir que todas as entradas de nav (GROWTH, OPS, PEOPLE, FIN, JUR, GOV) têm página correspondente.

**Verificação:** Cruzamento `nav-config.ts` ↔ `src/app/app/**/page.tsx`.

| Módulo | Rotas no nav-config | Página existe |
|--------|---------------------|----------------|
| Início | /app | ✅ app/page.tsx |
| ness.GROWTH | /app/growth/leads, propostas, upsell, posts, casos, brand, services | ✅ Todas com page.tsx (services/[id], posts/[id], casos/[id], novo) |
| ness.OPS | /app/ops/playbooks, playbooks/chat, metricas, timer, assets | ✅ Todas com page.tsx (playbooks/[id], playbooks/novo) |
| ness.PEOPLE | /app/people/vagas, candidatos, gaps, avaliacao | ✅ Todas com page.tsx (vagas/[id]) |
| ness.FIN | /app/fin/contratos, rentabilidade, alertas | ✅ Todas com page.tsx |
| ness.JUR | /app/jur, jur/conformidade, jur/risco | ✅ Todas com page.tsx |
| ness.GOV | /app/gov, gov/politicas, gov/aceites | ✅ gov/politicas, politicas/[id], politicas/novo, aceites |

**Resultado:** Nenhuma rota da sidebar foi removida ou alterada; todas têm página correspondente.

---

## Step 2 — Build e lint

**Comando:** `npm run build` e `npm run lint`.

- **Build:** ✅ Exit code 0. Next.js 14.2.18; todas as rotas compiladas.
- **Lint:** ✅ "No ESLint warnings or errors".

**Resultado:** Sem regressão em compilação ou lint.

---

## Step 3 — Checklist de não-quebra

| Item | Status |
|------|--------|
| `nav-config.ts` não alterado em estrutura de módulos/itens | ✅ Apenas uso no AppSidebar e AppHeader; estrutura idêntica. |
| Auth redirect e RoleProvider intactos | ✅ layout.tsx mantém redirect se !user e RoleProvider envolvendo SidebarProvider. |
| Rotas em `app/app/**` acessíveis pela sidebar | ✅ Links em AppSidebar usam os mesmos hrefs de nav-config. |
| Nenhuma Server Action ou API route removida/alterada por causa do layout | ✅ Apenas layout, sidebar e header; actions e API inalterados. |
| Build e lint sem erros | ✅ Conforme step 2. |

---

## Step 4 — Responsivo e acessibilidade (checklist manual)

**Teste responsivo (a fazer manualmente):**

- [ ] Viewport &lt; 768px: sidebar vira drawer; trigger no header abre/fecha.
- [ ] Backdrop fecha o drawer; link no drawer fecha e navega.
- [ ] Desktop: sidebar expandida 224px; colapsada 48px; conteúdo desloca.

**Acessibilidade (a verificar manualmente):**

- [ ] SidebarTrigger com `aria-label="Abrir ou fechar menu"`.
- [ ] Drawer mobile: botão fechar com `aria-label="Fechar menu"`.
- [ ] Contraste e foco visível (tema dark existente).

**Resultado:** Build/lint e rotas OK. Responsivo e a11y dependem de teste manual em browser.

---

**DoD Fase V:** Verificação automatizada (rotas, build, lint, checklist) concluída. Teste manual em dispositivo real recomendado antes de considerar 100% fechado.
