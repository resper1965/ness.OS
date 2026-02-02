-- ness.JUR: Seed de frameworks de conformidade

INSERT INTO public.compliance_frameworks (name, code)
SELECT 'LGPD', 'lgpd' WHERE NOT EXISTS (SELECT 1 FROM public.compliance_frameworks WHERE code = 'lgpd');
INSERT INTO public.compliance_frameworks (name, code)
SELECT 'Marco Civil da Internet', 'marco_civil' WHERE NOT EXISTS (SELECT 1 FROM public.compliance_frameworks WHERE code = 'marco_civil');
INSERT INTO public.compliance_frameworks (name, code)
SELECT 'CLT', 'clt' WHERE NOT EXISTS (SELECT 1 FROM public.compliance_frameworks WHERE code = 'clt');
