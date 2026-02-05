# Fase P — Inventário e decisões (theme-customizer — resper1965/clone)

Plano: `bundui-theme-customizer-nessos`. Artefato da Fase 1. **Fonte:** [resper1965/clone](https://github.com/resper1965/clone) (obtido via MCP GitHub).

---

## 1. Lista real em components/theme-customizer (resper1965/clone)

| Arquivo | Tamanho (bytes) | Responsabilidade |
|---------|-----------------|------------------|
| color-mode-selector.tsx | 871 | Modo claro/escuro (Sun/Moon/System) |
| content-layout-selector.tsx | 946 | Layout do conteúdo |
| index.ts | 283 | Re-export |
| panel.tsx | 1217 | Painel do customizer |
| preset-selector.tsx | 1360 | Presets de tema |
| radius-selector.tsx | 1517 | Raio de borda |
| reset-theme.tsx | 461 | Reset do tema |
| scale-selector.tsx | 1222 | Escala (tamanho) |
| sidebar-mode-selector.tsx | 853 | Modo da sidebar |

**Nota:** clone também tem `components/active-theme.tsx` e `components/layout/header/theme-switch.tsx` — theme-switch pode ser usado como toggle simples no AppHeader.

---

## 2. Decisões registradas

### Escopo no ness.OS

- **Mínimo:** Modo light e dark; default = dark.
- **Opcional (Fase 2):** radius (radius-selector), acento; ness (#00ade8) primário.
- **Customizer UI completo:** panel + preset/radius/scale/sidebar-mode — opcional; Fase 2 pode ser só color-mode-selector ou theme-switch.

### Onde expor

- **AppHeader (ícone):** Sim — color-mode-selector ou theme-switch (clone: layout/header/theme-switch.tsx).
- Sidebar footer ou página /app/configuracoes: opcional.

### Persistência

- **next-themes (cookie):** Adotar; defaultTheme: dark, enableSystem: true.
- clone usa active-theme + themes.css; ness.OS pode usar next-themes + variáveis .light em globals.css.

### Variáveis CSS tema light

Adicionar .light em globals.css: --background, --foreground, --primary (ness), --muted, --border, --input, etc. (ver plano).

---

## 3. Estado atual do tema no ness.OS

- globals.css: apenas :root (dark); sem .light.
- Sem theme switcher.

---

## 4. Compatibilidade

- clone: Next 15, React 19; ao copiar, adaptar para Next 14, React 18.
- next-themes compatível com Next 14; attribute="class", defaultTheme="dark".

---

## DoD Fase 1

- [x] Lista real de arquivos em components/theme-customizer (resper1965/clone)
- [x] Escopo: light/dark; default dark; radius/acento opcional
- [x] Onde expor: AppHeader; persistência next-themes
- [x] Especificação variáveis .light

**Próximo:** Fase 2 (E) — ThemeProvider, .light em globals.css, ThemeToggle (color-mode-selector ou theme-switch) no AppHeader.
