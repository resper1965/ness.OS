# Etapa 4 — Bundui layout: Breadcrumb no header (decisão)

Workflow: **workflow-unico-etapas-abertas-nessos**. Etapa 4.

## Decisão

**Manter texto atual** no AppHeader (getBreadcrumb: módulo / label como texto). Não adotar `ui/breadcrumb` com links por segmento nesta rodada.

## Justificativa

- Breadcrumb atual já atende navegação hierárquica (Módulo / Página) e está alinhado ao nav-config.
- Adicionar links por segmento exigiria mapear pathname → segmentos clicáveis e manter sincronia com rotas; benefício marginal para o escopo atual.
- Plano bundui-layout-components-nessos mantém Breadcrumb como **opcional** para Fase 2; pode ser retomado em ciclo posterior.

## Status

Etapa 4 marcada como **concluída por decisão** (não implementar breadcrumb com links).
