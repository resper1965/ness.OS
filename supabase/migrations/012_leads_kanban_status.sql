-- RF.GRO.02: Colunas Kanban Leads — Novo, Qualificado, Proposta, Ganho, Perdido

-- Migrar status antigos para os novos
UPDATE public.inbound_leads SET status = 'qualified' WHERE status = 'contacted';
UPDATE public.inbound_leads SET status = 'lost' WHERE status = 'discarded';
