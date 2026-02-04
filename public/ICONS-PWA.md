# Ícones PWA — ness.OS

O manifest do ness.OS referencia os seguintes ícones para "Adicionar à tela inicial" (PWA):

- **`/icon-192.png`** — 192×192 px
- **`/icon-512.png`** — 512×512 px

Coloque os arquivos `icon-192.png` e `icon-512.png` nesta pasta (`public/`). Eles serão servidos na raiz do site.

Se os arquivos não existirem, o PWA ainda pode ser instalado; o dispositivo usará um ícone genérico.

## Como gerar

- Exportar do Figma/design (192 e 512 px).
- [Favicon.io](https://favicon.io/) ou [RealFaviconGenerator](https://realfavicongenerator.net/) — gerar a partir de um logo.
- Manter proporção quadrada e fundo opaco (ou transparente) para boa leitura na home screen.

Branding: ness.OS — ver `.cursor/rules/ness-branding.mdc` e `docs/` para tokens de cor (ex.: `#0f172a` como theme_color).
