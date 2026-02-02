-- RF.FIN.01: renewal_date e adjustment_index em contracts

ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS renewal_date date,
  ADD COLUMN IF NOT EXISTS adjustment_index text;

COMMENT ON COLUMN public.contracts.renewal_date IS 'Data de renovação do contrato';
COMMENT ON COLUMN public.contracts.adjustment_index IS 'Índice de reajuste (IGPM, IPCA, etc.)';
