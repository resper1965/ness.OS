# PWA — Status (ness.OS)

> Estado atual do PWA para Timer / app interno. Plano: [mobile-timesheet-timer](../.context/plans/mobile-timesheet-timer.md).

## Implementado

- **Manifest:** `src/app/manifest.ts` — rota `/manifest.webmanifest`; name, short_name, start_url `/app`, display standalone, theme_color/background_color, ícones 192/512.
- **Ícones:** `public/icon-192.png` e `public/icon-512.png` (se existirem); caso contrário, Next gera ou usa fallback. Ver [public/ICONS-PWA.md](../public/ICONS-PWA.md) se existir.
- **Add to home screen:** Em dispositivos compatíveis, o usuário pode "Adicionar à tela inicial"; abre o app em `/app` (ou login).

## Adiado

- **Service Worker / offline:** Não implementado. Decisão: adiar cache offline e funcionamento sem rede até requisito explícito. O app funciona online; PWA instalável já oferece ícone na home e abertura em janela standalone.
- **Push notifications:** Não no escopo atual.

## Validação

- Ver [VALIDACAO-MANUAL.md](./VALIDACAO-MANUAL.md) seção 3 (PWA opcional): manifest, ícones, start URL.
