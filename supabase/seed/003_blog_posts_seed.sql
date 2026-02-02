-- Seed posts do blog (public_posts)
-- Conteúdo do corp-site/home.json + exemplos

INSERT INTO public.public_posts (slug, title, content_markdown, seo_description, is_published, published_at)
VALUES
  (
    'tendencias-seguranca-operacional-2024',
    'Tendências em Segurança Operacional para 2024',
    E'Descubra as principais tendências e tecnologias que estão moldando o futuro da segurança operacional.\n\n## Principais tendências\n\n- SOC 24×7 com IA para triagem\n- XDR e integração de fontes\n- Zero Trust Architecture\n- Automação de resposta a incidentes',
    'Descubra as principais tendências e tecnologias que estão moldando o futuro da segurança operacional.',
    true,
    '2024-12-15'
  ),
  (
    'devops-pequenas-empresas',
    'Como Implementar DevOps em Pequenas Empresas',
    E'Guia prático para implementar práticas DevOps mesmo com recursos limitados.\n\n## Passos iniciais\n\n- CI/CD com ferramentas open source\n- Infraestrutura como código\n- Monitoramento essencial',
    'Guia prático para implementar práticas DevOps mesmo com recursos limitados.',
    true,
    '2024-12-12'
  ),
  (
    'blockchain-industria-casos-uso',
    'Blockchain na Indústria: Casos de Uso Reais',
    E'Explorando aplicações práticas de blockchain em diferentes setores industriais.\n\n## Casos de uso\n\n- Rastreabilidade de supply chain\n- Contratos inteligentes\n- Registro imutável de transações',
    'Explorando aplicações práticas de blockchain em diferentes setores industriais.',
    true,
    '2024-12-10'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  seo_description = EXCLUDED.seo_description,
  is_published = EXCLUDED.is_published,
  published_at = EXCLUDED.published_at;
