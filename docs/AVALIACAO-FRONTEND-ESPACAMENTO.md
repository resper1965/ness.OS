# Avaliação — Distanciamento e Altura (frontend-specialist)

**Data:** 2026-01-29  
**Referência:** Imagem da página Casos de Sucesso + especificação "alturas absolutamente iguais", "espacamento entre ness.OS e itens do menu"

---

## Erros identificados

### 1. Altura do header da página ≠ header da sidebar

**Regra:** `as alturas dos headers devem ser absolutamente iguais` (56px).

**Situação:**
- Sidebar: header `h-14` (56px) com `ness.OS` — **correto**
- Página: `AppPageHeader` tem `h-14` (56px), mas **título + subtítulo** ocupam ~58px (text-xl + mt-0.5 + text-sm)
- Com `overflow-hidden`, o conteúdo é cortado ou o bloco visual parece maior por causa da altura implícita do texto

**Causa:** Título (text-xl) + subtítulo (text-sm) com `mt-0.5` excedem 56px em altura total.

**Correção:** Garantir que o header da página respeite 56px — usar layout em linha única ou ajustar fontes/line-height para caber em 56px.

---

### 2. Bloco visual do header da página maior que o da sidebar

**Situação:** O header da página tem `mb-6` (24px) abaixo; a sidebar tem `mb-2` (8px). O "bloco visual" da página fica 56+24=80px; o da sidebar 56+8=64px.

**Correção:** Alinhar `mb` do header da página ao `mb-2` da sidebar para manter o mesmo ritmo visual.

---

### 3. Role do usuário não visível

**Regra:** `o Role: superadmin deve aparecer em um modulo de usuario no canto direito do header da pagina`.

**Situação:** `UserRoleBadge` está no `AppPageHeader`, mas não aparece na captura.

**Possíveis causas:**
- `RoleProvider` não recebe `role` (profile null)
- Usuário sem `role` no profile
- Badge retorna `null` quando `!role`

**Correção:** Garantir fallback quando role for null (ex.: "—") e checar se o profile está sendo carregado.

---

### 4. Espaçamento entre ness.OS e itens do menu

**Regra:** `o espacamento entre o ness.OS do titulo do header do sidebarmenu é o mesmo que o distanciamento dos itens do menu`.

**Situação:**
- Sidebar: `mb-2` (8px) entre header e nav; nav com `gap-2` (8px) entre grupos — **ok**
- Dentro dos grupos: `mt-0.5` + `space-y-0.5` (2px) entre itens — **menor**
- Ritmo inconsistente: 8px (header↔nav, entre grupos) vs 2px (entre itens no grupo)

**Correção:** Padronizar espaçamento — usar `gap-2` ou `space-y-2` de forma consistente para o mesmo "nível" visual.

---

## Resumo de ajustes recomendados

| Item | Ação |
|------|------|
| Header página | Forçar altura 56px; título+subtitle em linha única ou fontes menores |
| Margin do header | `mb-6` → `mb-2` para alinhar com sidebar |
| Role badge | Fallback quando role null; validar RoleProvider |
| Sidebar spacing | Revisar `space-y-0.5` para alinhar com `gap-2` |
