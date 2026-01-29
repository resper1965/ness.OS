-- ============================================
-- ness.OS - Schema Inicial (ness.FIN)
-- Execute no SQL Editor do Supabase
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================
-- SCHEMA FIN
-- ============================================
CREATE SCHEMA IF NOT EXISTS fin;

-- --------------------------------------------
-- Tabela: Clientes
-- --------------------------------------------
CREATE TABLE fin.clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  omie_id BIGINT UNIQUE,
  codigo_integracao VARCHAR(50),
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  cnpj_cpf VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(20),
  tags TEXT[],
  ativo BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clientes_omie_id ON fin.clientes(omie_id);
CREATE INDEX idx_clientes_cnpj ON fin.clientes(cnpj_cpf);

-- --------------------------------------------
-- Tabela: Contratos
-- --------------------------------------------
CREATE TABLE fin.contratos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  omie_id BIGINT UNIQUE,
  codigo_integracao VARCHAR(50),
  cliente_id UUID REFERENCES fin.clientes(id),
  numero VARCHAR(50),
  descricao TEXT,
  valor_mensal DECIMAL(15,2),
  data_inicio DATE,
  data_fim DATE,
  data_reajuste DATE,
  indice_reajuste VARCHAR(10) DEFAULT 'IGPM', -- IGPM, IPCA, INPC
  periodicidade VARCHAR(20) DEFAULT 'MENSAL',
  status VARCHAR(20) DEFAULT 'ATIVO', -- ATIVO, SUSPENSO, ENCERRADO
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contratos_cliente ON fin.contratos(cliente_id);
CREATE INDEX idx_contratos_status ON fin.contratos(status);
CREATE INDEX idx_contratos_data_fim ON fin.contratos(data_fim);

-- --------------------------------------------
-- Tabela: Categorias (espelho do Omie)
-- --------------------------------------------
CREATE TABLE fin.categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(20) UNIQUE NOT NULL,
  descricao VARCHAR(255),
  tipo CHAR(1), -- R=Receita, D=Despesa
  natureza CHAR(1), -- F=Fixa, V=Variável
  conta_dre VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------
-- Tabela: Receitas (Contas a Receber)
-- --------------------------------------------
CREATE TABLE fin.receitas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  omie_id BIGINT UNIQUE,
  cliente_id UUID REFERENCES fin.clientes(id),
  contrato_id UUID REFERENCES fin.contratos(id),
  categoria_codigo VARCHAR(20),
  numero_documento VARCHAR(50),
  data_emissao DATE,
  data_vencimento DATE,
  data_pagamento DATE,
  valor_documento DECIMAL(15,2),
  valor_recebido DECIMAL(15,2),
  status VARCHAR(20), -- ABERTO, RECEBIDO, ATRASADO, CANCELADO
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_receitas_cliente ON fin.receitas(cliente_id);
CREATE INDEX idx_receitas_contrato ON fin.receitas(contrato_id);
CREATE INDEX idx_receitas_status ON fin.receitas(status);
CREATE INDEX idx_receitas_vencimento ON fin.receitas(data_vencimento);

-- --------------------------------------------
-- Tabela: Despesas (Contas a Pagar)
-- --------------------------------------------
CREATE TABLE fin.despesas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  omie_id BIGINT UNIQUE,
  fornecedor_nome VARCHAR(255),
  categoria_codigo VARCHAR(20),
  numero_documento VARCHAR(50),
  data_emissao DATE,
  data_vencimento DATE,
  data_pagamento DATE,
  valor_documento DECIMAL(15,2),
  valor_pago DECIMAL(15,2),
  status VARCHAR(20), -- ABERTO, PAGO, ATRASADO, CANCELADO
  rateio_contrato_id UUID REFERENCES fin.contratos(id), -- Se for custo direto
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_despesas_categoria ON fin.despesas(categoria_codigo);
CREATE INDEX idx_despesas_status ON fin.despesas(status);
CREATE INDEX idx_despesas_vencimento ON fin.despesas(data_vencimento);

-- --------------------------------------------
-- Tabela: Rentabilidade (calculada)
-- --------------------------------------------
CREATE TABLE fin.rentabilidade (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contrato_id UUID REFERENCES fin.contratos(id),
  periodo DATE NOT NULL, -- Primeiro dia do mês
  receita_total DECIMAL(15,2) DEFAULT 0,
  custo_direto DECIMAL(15,2) DEFAULT 0,
  custo_rh DECIMAL(15,2) DEFAULT 0,
  custo_ferramentas DECIMAL(15,2) DEFAULT 0,
  custo_cloud DECIMAL(15,2) DEFAULT 0,
  overhead DECIMAL(15,2) DEFAULT 0,
  impostos DECIMAL(15,2) DEFAULT 0,
  margem_liquida DECIMAL(15,2) DEFAULT 0,
  rentabilidade_percent DECIMAL(5,2) DEFAULT 0,
  calculado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contrato_id, periodo)
);

CREATE INDEX idx_rentabilidade_contrato ON fin.rentabilidade(contrato_id);
CREATE INDEX idx_rentabilidade_periodo ON fin.rentabilidade(periodo);

-- --------------------------------------------
-- Tabela: Alertas
-- --------------------------------------------
CREATE TABLE fin.alertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo VARCHAR(50) NOT NULL, -- VENCIMENTO_90D, VENCIMENTO_30D, REAJUSTE, INADIMPLENCIA, RENTABILIDADE_BAIXA
  contrato_id UUID REFERENCES fin.contratos(id),
  cliente_id UUID REFERENCES fin.clientes(id),
  mensagem TEXT,
  dados JSONB DEFAULT '{}',
  lido BOOLEAN DEFAULT false,
  lido_em TIMESTAMPTZ,
  lido_por UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alertas_tipo ON fin.alertas(tipo);
CREATE INDEX idx_alertas_lido ON fin.alertas(lido);
CREATE INDEX idx_alertas_created ON fin.alertas(created_at DESC);

-- --------------------------------------------
-- Tabela: Configurações
-- --------------------------------------------
CREATE TABLE fin.configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave VARCHAR(50) UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  descricao TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO fin.configuracoes (chave, valor, descricao) VALUES
  ('overhead_percent', '0.25', 'Percentual de overhead padrão (25%)'),
  ('margem_minima', '0.15', 'Margem mínima aceitável (15%)'),
  ('alerta_rentabilidade', '0.10', 'Alerta se rentabilidade < 10%'),
  ('impostos_servico', '0.1565', 'ISS + PIS + COFINS (15.65%)'),
  ('dias_alerta_vencimento', '[90, 30, 15, 7]', 'Dias antes do vencimento para alertar');

-- --------------------------------------------
-- Tabela: Log de Sync
-- --------------------------------------------
CREATE TABLE fin.sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo VARCHAR(50), -- CLIENTES, CONTRATOS, RECEITAS, DESPESAS
  status VARCHAR(20), -- SUCESSO, ERRO, PARCIAL
  registros_processados INT DEFAULT 0,
  registros_erro INT DEFAULT 0,
  detalhes JSONB DEFAULT '{}',
  iniciado_em TIMESTAMPTZ,
  finalizado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIEWS
-- ============================================

-- View: Resumo de rentabilidade por cliente
CREATE VIEW fin.vw_rentabilidade_cliente AS
SELECT 
  c.id AS cliente_id,
  c.razao_social,
  COUNT(DISTINCT ct.id) AS total_contratos,
  SUM(r.receita_total) AS receita_total,
  SUM(r.margem_liquida) AS margem_total,
  CASE 
    WHEN SUM(r.receita_total) > 0 
    THEN ROUND((SUM(r.margem_liquida) / SUM(r.receita_total)) * 100, 2)
    ELSE 0 
  END AS rentabilidade_media
FROM fin.clientes c
LEFT JOIN fin.contratos ct ON ct.cliente_id = c.id
LEFT JOIN fin.rentabilidade r ON r.contrato_id = ct.id
WHERE c.ativo = true
GROUP BY c.id, c.razao_social;

-- View: Contratos próximos do vencimento
CREATE VIEW fin.vw_contratos_vencendo AS
SELECT 
  ct.id,
  ct.numero,
  c.razao_social AS cliente,
  ct.valor_mensal,
  ct.data_fim,
  ct.data_fim - CURRENT_DATE AS dias_restantes,
  CASE 
    WHEN ct.data_fim - CURRENT_DATE <= 30 THEN 'CRITICO'
    WHEN ct.data_fim - CURRENT_DATE <= 60 THEN 'URGENTE'
    WHEN ct.data_fim - CURRENT_DATE <= 90 THEN 'ATENCAO'
    ELSE 'OK'
  END AS severidade
FROM fin.contratos ct
JOIN fin.clientes c ON c.id = ct.cliente_id
WHERE ct.status = 'ATIVO'
  AND ct.data_fim IS NOT NULL
  AND ct.data_fim <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY ct.data_fim;

-- View: Fluxo de caixa previsto
CREATE VIEW fin.vw_fluxo_caixa AS
SELECT 
  'RECEITA' AS tipo,
  data_vencimento AS data,
  SUM(valor_documento) AS valor
FROM fin.receitas
WHERE status = 'ABERTO'
GROUP BY data_vencimento
UNION ALL
SELECT 
  'DESPESA' AS tipo,
  data_vencimento AS data,
  SUM(valor_documento) AS valor
FROM fin.despesas
WHERE status = 'ABERTO'
GROUP BY data_vencimento
ORDER BY data;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Calcular rentabilidade de um contrato
CREATE OR REPLACE FUNCTION fin.calcular_rentabilidade(
  p_contrato_id UUID,
  p_periodo DATE
) RETURNS fin.rentabilidade AS $$
DECLARE
  v_result fin.rentabilidade;
  v_receita DECIMAL(15,2);
  v_overhead_pct DECIMAL(5,4);
  v_impostos_pct DECIMAL(5,4);
BEGIN
  -- Buscar configurações
  SELECT (valor::text)::DECIMAL INTO v_overhead_pct FROM fin.configuracoes WHERE chave = 'overhead_percent';
  SELECT (valor::text)::DECIMAL INTO v_impostos_pct FROM fin.configuracoes WHERE chave = 'impostos_servico';
  
  -- Calcular receita do período
  SELECT COALESCE(SUM(valor_recebido), 0) INTO v_receita
  FROM fin.receitas
  WHERE contrato_id = p_contrato_id
    AND data_pagamento >= p_periodo
    AND data_pagamento < p_periodo + INTERVAL '1 month';
  
  -- Montar resultado (custos virão do ness.OPS futuramente)
  v_result.contrato_id := p_contrato_id;
  v_result.periodo := p_periodo;
  v_result.receita_total := v_receita;
  v_result.custo_direto := 0; -- TODO: integrar com ness.OPS
  v_result.overhead := v_receita * v_overhead_pct;
  v_result.impostos := v_receita * v_impostos_pct;
  v_result.margem_liquida := v_receita - v_result.custo_direto - v_result.overhead - v_result.impostos;
  v_result.rentabilidade_percent := CASE 
    WHEN v_receita > 0 THEN (v_result.margem_liquida / v_receita) * 100
    ELSE 0
  END;
  v_result.calculado_em := NOW();
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Function: Gerar alertas de vencimento
CREATE OR REPLACE FUNCTION fin.gerar_alertas_vencimento() RETURNS INT AS $$
DECLARE
  v_dias INT[];
  v_dia INT;
  v_count INT := 0;
BEGIN
  SELECT ARRAY(SELECT jsonb_array_elements_text(valor)::INT FROM fin.configuracoes WHERE chave = 'dias_alerta_vencimento') INTO v_dias;
  
  FOREACH v_dia IN ARRAY v_dias LOOP
    INSERT INTO fin.alertas (tipo, contrato_id, cliente_id, mensagem, dados)
    SELECT 
      'VENCIMENTO_' || v_dia || 'D',
      ct.id,
      ct.cliente_id,
      'Contrato ' || ct.numero || ' vence em ' || v_dia || ' dias',
      jsonb_build_object('data_fim', ct.data_fim, 'valor_mensal', ct.valor_mensal)
    FROM fin.contratos ct
    WHERE ct.status = 'ATIVO'
      AND ct.data_fim = CURRENT_DATE + v_dia
      AND NOT EXISTS (
        SELECT 1 FROM fin.alertas a 
        WHERE a.contrato_id = ct.id 
          AND a.tipo = 'VENCIMENTO_' || v_dia || 'D'
          AND a.created_at > CURRENT_DATE - INTERVAL '1 day'
      );
    
    GET DIAGNOSTICS v_count = v_count + ROW_COUNT;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION fin.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_clientes_updated_at BEFORE UPDATE ON fin.clientes
  FOR EACH ROW EXECUTE FUNCTION fin.update_updated_at();

CREATE TRIGGER tr_contratos_updated_at BEFORE UPDATE ON fin.contratos
  FOR EACH ROW EXECUTE FUNCTION fin.update_updated_at();

CREATE TRIGGER tr_receitas_updated_at BEFORE UPDATE ON fin.receitas
  FOR EACH ROW EXECUTE FUNCTION fin.update_updated_at();

CREATE TRIGGER tr_despesas_updated_at BEFORE UPDATE ON fin.despesas
  FOR EACH ROW EXECUTE FUNCTION fin.update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE fin.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin.despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fin.alertas ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários autenticados podem ver tudo (ajustar conforme necessidade)
CREATE POLICY "Authenticated users can view all" ON fin.clientes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all" ON fin.contratos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all" ON fin.receitas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all" ON fin.despesas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all" ON fin.alertas
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- CRON JOBS (pg_cron)
-- ============================================

-- Job: Gerar alertas diariamente às 8h
SELECT cron.schedule(
  'gerar-alertas-vencimento',
  '0 8 * * *',
  'SELECT fin.gerar_alertas_vencimento()'
);

-- ============================================
-- GRANTS
-- ============================================

GRANT USAGE ON SCHEMA fin TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA fin TO authenticated;
GRANT INSERT, UPDATE ON fin.alertas TO authenticated;
