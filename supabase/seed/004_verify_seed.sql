-- === VERIFICAÇÃO (legitima execução) ===
-- Exibe contagens e WARNING se esperado não bate. Mensagens em NOTICES.

DO $$
DECLARE
  n_playbooks int;
  n_services int;
  n_static int;
  n_posts int;
  ok boolean := true;
BEGIN
  SELECT COUNT(*) INTO n_playbooks FROM public.playbooks;
  SELECT COUNT(*) INTO n_services FROM public.services_catalog WHERE is_active = true;
  SELECT COUNT(*) INTO n_static FROM public.static_pages;
  SELECT COUNT(*) INTO n_posts FROM public.public_posts WHERE is_published = true;

  RAISE NOTICE '=== SEED VERIFICADO ===';
  RAISE NOTICE 'playbooks: % (esperado >= 11)', n_playbooks;
  RAISE NOTICE 'services_catalog (ativos): % (esperado >= 11)', n_services;
  RAISE NOTICE 'static_pages: % (esperado >= 6)', n_static;
  RAISE NOTICE 'public_posts (publicados): % (esperado >= 3)', n_posts;

  IF n_playbooks < 11 THEN
    RAISE WARNING 'playbooks abaixo do esperado';
    ok := false;
  END IF;
  IF n_services < 11 THEN
    RAISE WARNING 'services_catalog abaixo do esperado';
    ok := false;
  END IF;
  IF n_static < 6 THEN
    RAISE WARNING 'static_pages abaixo do esperado';
    ok := false;
  END IF;
  IF n_posts < 3 THEN
    RAISE WARNING 'public_posts abaixo do esperado';
    ok := false;
  END IF;

  IF ok THEN
    RAISE NOTICE 'Seed completo e verificado com sucesso.';
  END IF;
END $$;
