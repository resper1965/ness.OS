import type { MetadataRoute } from 'next';

/**
 * PWA manifest — ness.OS (Timer e app interno).
 * Permite "Adicionar à tela inicial" no mobile; start_url leva ao app (login se não autenticado).
 * Plano: .context/plans/mobile-timesheet-timer.md (PWA opcional).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ness.OS',
    short_name: 'ness.OS',
    description: 'ness.OS — Gestão empresarial. Timer, métricas, contratos.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    orientation: 'portrait-primary',
    lang: 'pt-BR',
    scope: '/',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
