# ness.OS — Schema Completo do Banco de Dados

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE (PostgreSQL)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  SYSTEM        │  FIN           │  OPS           │  GROWTH              │
│  ────────────  │  ────────────  │  ────────────  │  ────────────        │
│  users         │  clientes      │  recursos      │  leads               │
│  users_roles   │  contratos     │  alocacoes     │  oportunidades       │
│  permissions   │  receitas      │  timesheet     │  atividades          │
│  audit_logs    │  despesas      │  chamados      │  propostas           │
│  sync_logs     │  rentabilidade │  custos_cloud  │  proposta_itens      │
│  configs       │  alertas       │  licencas      │  servicos_catalogo   │
│  notifications │  indices_econ  │  servicos_mon  │                      │
├─────────────────────────────────────────────────────────────────────────┤
│  JUR           │  GOV           │  PEOPLE        │  AI                  │
│  ────────────  │  ────────────  │  ────────────  │  ────────────        │
│  contratos_jur │  frameworks    │  colaboradores │  conversations       │
│  clausulas     │  controles     │  historico_rh  │  messages            │
│  documentos    │  avaliacoes    │  ferias        │  embeddings          │
│  prazos        │  gaps          │  avaliacoes    │  agent_logs          │
│  processos     │  planos_acao   │  treinamentos  │  tokens_usage        │
│                │  politicas     │  certificacoes │                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# SCHEMA: SYSTEM (Núcleo)

## users
Extensão da tabela auth.users do Supabase

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  avatar_url TEXT,
  telefone TEXT,
  cargo TEXT,
  departamento TEXT,
  ativo BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMPTZ,
  preferencias JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_ativo ON users(ativo);

-- Trigger para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Campos JSONB preferencias:**
```json
{
  "tema": "light|dark",
  "idioma": "pt-BR",
  "notificacoes_email": true,
  "notificacoes_push": true,
  "dashboard_widgets": ["receita", "alertas", "chamados"],
  "modulo_padrao": "/dashboard"
}
```

---

## users_roles
Controle de acesso por módulo (RBAC)

```sql
CREATE TABLE public.users_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN (
    'admin',      -- Acesso total
    'ceo',        -- Todos módulos (leitura)
    'cfo',        -- FIN (total) + outros (leitura)
    'coo',        -- OPS (total) + FIN (leitura)
    'comercial',  -- GROWTH (total)
    'juridico',   -- JUR (total)
    'compliance', -- GOV (total)
    'rh',         -- PEOPLE (total)
    'analista',   -- Módulos específicos
    'viewer'      -- Somente leitura
  )),
  modulos TEXT[] DEFAULT '{}', -- Módulos permitidos para 'analista'
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  UNIQUE(user_id, role)
);

-- Índices
CREATE INDEX idx_users_roles_user ON users_roles(user_id);
CREATE INDEX idx_users_roles_role ON users_roles(role);
```

---

## permissions
Permissões granulares por recurso

```sql
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  modulo TEXT NOT NULL CHECK (modulo IN ('fin', 'ops', 'growth', 'jur', 'gov', 'people', 'admin')),
  recurso TEXT NOT NULL, -- Ex: 'contratos', 'alertas', 'propostas'
  acoes TEXT[] NOT NULL DEFAULT '{}', -- ['read', 'create', 'update', 'delete']
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dados iniciais
INSERT INTO permissions (role, modulo, recurso, acoes) VALUES
('admin', 'fin', '*', ARRAY['read', 'create', 'update', 'delete']),
('admin', 'ops', '*', ARRAY['read', 'create', 'update', 'delete']),
('cfo', 'fin', '*', ARRAY['read', 'create', 'update', 'delete']),
('cfo', 'ops', '*', ARRAY['read']),
('coo', 'ops', '*', ARRAY['read', 'create', 'update', 'delete']),
('coo', 'fin', 'rentabilidade', ARRAY['read']),
('comercial', 'growth', '*', ARRAY['read', 'create', 'update', 'delete']),
('viewer', 'fin', '*', ARRAY['read']),
('viewer', 'ops', '*', ARRAY['read']);
```

---

## audit_logs
Log de todas as alterações no sistema

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  acao TEXT NOT NULL CHECK (acao IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT')),
  tabela TEXT NOT NULL,
  registro_id UUID,
  dados_antes JSONB,
  dados_depois JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_tabela ON audit_logs(tabela);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Particionamento por mês (opcional para performance)
-- CREATE TABLE audit_logs_2025_01 PARTITION OF audit_logs
--   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

## sync_logs
Log de sincronizações com sistemas externos

```sql
CREATE TABLE public.sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sistema TEXT NOT NULL CHECK (sistema IN ('omie', 'clockify', 'glpi', 'aws', 'gcp', 'azure', 'wazuh')),
  tipo TEXT NOT NULL CHECK (tipo IN ('full', 'incremental', 'webhook')),
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'error', 'partial')),
  registros_processados INTEGER DEFAULT 0,
  registros_criados INTEGER DEFAULT 0,
  registros_atualizados INTEGER DEFAULT 0,
  registros_erro INTEGER DEFAULT 0,
  erro_mensagem TEXT,
  erro_detalhes JSONB,
  duracao_ms INTEGER,
  iniciado_em TIMESTAMPTZ DEFAULT now(),
  finalizado_em TIMESTAMPTZ,
  iniciado_por UUID REFERENCES users(id) -- NULL = automático
);

-- Índices
CREATE INDEX idx_sync_logs_sistema ON sync_logs(sistema);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_iniciado ON sync_logs(iniciado_em DESC);
```

---

## configs
Configurações globais do sistema

```sql
CREATE TABLE public.configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,
  valor JSONB NOT NULL,
  descricao TEXT,
  modulo TEXT, -- NULL = global
  editavel BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

-- Dados iniciais
INSERT INTO configs (chave, valor, descricao, modulo) VALUES
('empresa', '{"nome": "ness.", "cnpj": "...", "endereco": "..."}', 'Dados da empresa', NULL),
('fin_overhead_percent', '15', 'Percentual de overhead para cálculo de rentabilidade', 'fin'),
('fin_impostos_percent', '16.33', 'Percentual de impostos (Simples/Lucro Presumido)', 'fin'),
('fin_alerta_vencimento_dias', '[30, 60, 90]', 'Dias antes do vencimento para alertas', 'fin'),
('fin_alerta_rentabilidade_min', '10', 'Rentabilidade mínima (%) antes de alertar', 'fin'),
('ops_sla_critico_horas', '2', 'SLA para chamados críticos (horas)', 'ops'),
('ops_sla_alto_horas', '4', 'SLA para chamados de alta prioridade', 'ops'),
('ops_sla_medio_horas', '8', 'SLA para chamados de média prioridade', 'ops'),
('ops_sla_baixo_horas', '24', 'SLA para chamados de baixa prioridade', 'ops'),
('ai_modelo_padrao', '"claude-sonnet-4-20250514"', 'Modelo Claude padrão', 'ai'),
('ai_max_tokens_dia', '100000', 'Limite de tokens por dia', 'ai');
```

---

## notifications
Central de notificações

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('alerta', 'info', 'sucesso', 'erro', 'tarefa')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  link TEXT, -- URL para navegar
  modulo TEXT,
  referencia_tipo TEXT, -- 'contrato', 'chamado', 'proposta', etc.
  referencia_id UUID,
  lida BOOLEAN DEFAULT false,
  lida_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_lida ON notifications(user_id, lida);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

---

# SCHEMA: FIN (Financeiro)

## clientes
Cadastro de clientes (sync Omie)

```sql
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  omie_id BIGINT UNIQUE, -- ID no Omie
  codigo TEXT UNIQUE NOT NULL, -- Código interno
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  cnpj TEXT UNIQUE,
  inscricao_estadual TEXT,
  
  -- Endereço
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  uf CHAR(2),
  cep TEXT,
  
  -- Contato
  email TEXT,
  telefone TEXT,
  website TEXT,
  
  -- Contato principal
  contato_nome TEXT,
  contato_email TEXT,
  contato_telefone TEXT,
  contato_cargo TEXT,
  
  -- Classificação
  segmento TEXT CHECK (segmento IN ('energia', 'financeiro', 'saude', 'industria', 'varejo', 'tecnologia', 'governo', 'outros')),
  porte TEXT CHECK (porte IN ('micro', 'pequena', 'media', 'grande', 'enterprise')),
  tags TEXT[] DEFAULT '{}',
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  cliente_desde DATE,
  
  -- Metadados
  omie_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_clientes_omie ON clientes(omie_id);
CREATE INDEX idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX idx_clientes_segmento ON clientes(segmento);
CREATE INDEX idx_clientes_ativo ON clientes(ativo);
```

---

## contratos
Contratos de serviço recorrente

```sql
CREATE TABLE public.contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  omie_id BIGINT UNIQUE,
  numero TEXT UNIQUE NOT NULL,
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  
  -- Descrição
  titulo TEXT NOT NULL,
  descricao TEXT,
  escopo TEXT, -- Escopo detalhado
  
  -- Valores
  valor_mensal DECIMAL(15,2) NOT NULL,
  valor_hora_extra DECIMAL(15,2),
  horas_incluidas INTEGER, -- Horas mensais incluídas
  moeda TEXT DEFAULT 'BRL',
  
  -- Vigência
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  prazo_meses INTEGER,
  renovacao_automatica BOOLEAN DEFAULT false,
  aviso_renovacao_dias INTEGER DEFAULT 90,
  
  -- Reajuste
  indice_reajuste TEXT CHECK (indice_reajuste IN ('IGPM', 'IPCA', 'INPC', 'FIXO', 'NENHUM')),
  percentual_reajuste_fixo DECIMAL(5,2),
  data_ultimo_reajuste DATE,
  data_proximo_reajuste DATE,
  
  -- Faturamento
  dia_faturamento INTEGER CHECK (dia_faturamento BETWEEN 1 AND 28),
  dia_vencimento INTEGER CHECK (dia_vencimento BETWEEN 1 AND 28),
  forma_pagamento TEXT CHECK (forma_pagamento IN ('boleto', 'pix', 'transferencia', 'cartao')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('rascunho', 'ativo', 'suspenso', 'encerrado', 'cancelado')),
  motivo_encerramento TEXT,
  
  -- Responsáveis
  gestor_ness_id UUID REFERENCES users(id),
  gestor_cliente TEXT,
  gestor_cliente_email TEXT,
  
  -- Documentos
  documento_url TEXT, -- Link para contrato assinado
  
  -- Metadados
  omie_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_contratos_cliente ON contratos(cliente_id);
CREATE INDEX idx_contratos_status ON contratos(status);
CREATE INDEX idx_contratos_data_fim ON contratos(data_fim);
CREATE INDEX idx_contratos_omie ON contratos(omie_id);

-- View de contratos com dias até vencimento
CREATE VIEW vw_contratos_vencimento AS
SELECT 
  c.*,
  cl.razao_social as cliente_nome,
  (c.data_fim - CURRENT_DATE) as dias_ate_vencimento,
  CASE 
    WHEN (c.data_fim - CURRENT_DATE) <= 30 THEN 'critico'
    WHEN (c.data_fim - CURRENT_DATE) <= 60 THEN 'urgente'
    WHEN (c.data_fim - CURRENT_DATE) <= 90 THEN 'atencao'
    ELSE 'normal'
  END as status_vencimento
FROM contratos c
JOIN clientes cl ON c.cliente_id = cl.id
WHERE c.status = 'ativo';
```

---

## receitas
Receitas mensais por contrato

```sql
CREATE TABLE public.receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  omie_id BIGINT,
  contrato_id UUID NOT NULL REFERENCES contratos(id),
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  
  -- Período
  competencia DATE NOT NULL, -- Mês/ano de competência (sempre dia 01)
  
  -- Valores
  valor_contrato DECIMAL(15,2) NOT NULL, -- Valor base do contrato
  valor_horas_extras DECIMAL(15,2) DEFAULT 0,
  valor_outros DECIMAL(15,2) DEFAULT 0,
  valor_desconto DECIMAL(15,2) DEFAULT 0,
  valor_total DECIMAL(15,2) NOT NULL,
  
  -- Faturamento
  nf_numero TEXT,
  nf_data DATE,
  nf_url TEXT,
  
  -- Pagamento
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  valor_pago DECIMAL(15,2),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'faturado', 'pago', 'atrasado', 'cancelado')),
  
  -- Metadados
  omie_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_receitas_contrato ON receitas(contrato_id);
CREATE INDEX idx_receitas_cliente ON receitas(cliente_id);
CREATE INDEX idx_receitas_competencia ON receitas(competencia);
CREATE INDEX idx_receitas_status ON receitas(status);
CREATE INDEX idx_receitas_vencimento ON receitas(data_vencimento);

-- Constraint única
ALTER TABLE receitas ADD CONSTRAINT uq_receitas_contrato_competencia 
  UNIQUE (contrato_id, competencia);
```

---

## despesas
Despesas operacionais

```sql
CREATE TABLE public.despesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  omie_id BIGINT,
  
  -- Classificação
  categoria TEXT NOT NULL CHECK (categoria IN (
    'pessoal',        -- Salários, encargos, benefícios
    'infraestrutura', -- Cloud, datacenter, telecom
    'licencas',       -- Software, ferramentas
    'marketing',      -- Publicidade, eventos
    'administrativo', -- Aluguel, contador, jurídico
    'viagens',        -- Deslocamentos
    'treinamento',    -- Capacitação
    'outros'
  )),
  subcategoria TEXT,
  
  -- Descrição
  descricao TEXT NOT NULL,
  fornecedor TEXT,
  fornecedor_cnpj TEXT,
  
  -- Valores
  valor DECIMAL(15,2) NOT NULL,
  
  -- Período
  competencia DATE NOT NULL,
  data_vencimento DATE,
  data_pagamento DATE,
  
  -- Rateio (opcional)
  rateio JSONB, -- [{"contrato_id": "...", "percentual": 50}, ...]
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  
  -- Documento
  documento_url TEXT,
  
  -- Metadados
  omie_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_despesas_categoria ON despesas(categoria);
CREATE INDEX idx_despesas_competencia ON despesas(competencia);
CREATE INDEX idx_despesas_status ON despesas(status);
```

---

## rentabilidade
Rentabilidade calculada por contrato/mês

```sql
CREATE TABLE public.rentabilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES contratos(id),
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  competencia DATE NOT NULL,
  
  -- Receita
  receita_total DECIMAL(15,2) NOT NULL,
  
  -- Custos Diretos
  custo_horas DECIMAL(15,2) DEFAULT 0, -- Horas * custo/hora dos recursos
  custo_cloud DECIMAL(15,2) DEFAULT 0, -- Rateio de cloud
  custo_licencas DECIMAL(15,2) DEFAULT 0, -- Rateio de licenças
  custo_outros DECIMAL(15,2) DEFAULT 0,
  custo_direto_total DECIMAL(15,2) NOT NULL,
  
  -- Custos Indiretos
  overhead_percent DECIMAL(5,2) NOT NULL, -- % aplicado
  overhead_valor DECIMAL(15,2) NOT NULL,
  
  -- Impostos
  impostos_percent DECIMAL(5,2) NOT NULL,
  impostos_valor DECIMAL(15,2) NOT NULL,
  
  -- Resultado
  custo_total DECIMAL(15,2) NOT NULL,
  margem_valor DECIMAL(15,2) NOT NULL,
  margem_percent DECIMAL(5,2) NOT NULL,
  
  -- Detalhes de horas
  horas_trabalhadas DECIMAL(10,2) DEFAULT 0,
  horas_faturadas DECIMAL(10,2) DEFAULT 0,
  custo_hora_medio DECIMAL(10,2),
  
  -- Status
  status TEXT DEFAULT 'calculado' CHECK (status IN ('calculado', 'ajustado', 'aprovado')),
  ajuste_manual DECIMAL(15,2),
  ajuste_motivo TEXT,
  
  -- Metadados
  calculado_em TIMESTAMPTZ DEFAULT now(),
  aprovado_por UUID REFERENCES users(id),
  aprovado_em TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_rentabilidade_contrato ON rentabilidade(contrato_id);
CREATE INDEX idx_rentabilidade_cliente ON rentabilidade(cliente_id);
CREATE INDEX idx_rentabilidade_competencia ON rentabilidade(competencia);

-- Constraint única
ALTER TABLE rentabilidade ADD CONSTRAINT uq_rentabilidade_contrato_competencia 
  UNIQUE (contrato_id, competencia);

-- View de rentabilidade consolidada por cliente
CREATE VIEW vw_rentabilidade_cliente AS
SELECT 
  cliente_id,
  DATE_TRUNC('month', competencia) as mes,
  SUM(receita_total) as receita,
  SUM(custo_total) as custo,
  SUM(margem_valor) as margem,
  ROUND(AVG(margem_percent), 2) as margem_media_percent
FROM rentabilidade
GROUP BY cliente_id, DATE_TRUNC('month', competencia);
```

---

## alertas
Alertas financeiros automáticos

```sql
CREATE TABLE public.alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Classificação
  categoria TEXT NOT NULL CHECK (categoria IN (
    'vencimento_contrato',
    'rentabilidade_baixa',
    'inadimplencia',
    'reajuste_pendente',
    'faturamento_pendente',
    'custo_acima_budget'
  )),
  severidade TEXT NOT NULL CHECK (severidade IN ('critico', 'urgente', 'atencao', 'info')),
  
  -- Referência
  contrato_id UUID REFERENCES contratos(id),
  cliente_id UUID REFERENCES clientes(id),
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  dados JSONB, -- Dados adicionais específicos do alerta
  
  -- Ação
  acao_sugerida TEXT,
  acao_url TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'visualizado', 'em_andamento', 'resolvido', 'ignorado')),
  resolvido_por UUID REFERENCES users(id),
  resolvido_em TIMESTAMPTZ,
  resolucao_comentario TEXT,
  
  -- Notificação
  notificar_usuarios UUID[] DEFAULT '{}',
  notificado_em TIMESTAMPTZ,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ -- Alerta expira após essa data
);

-- Índices
CREATE INDEX idx_alertas_categoria ON alertas(categoria);
CREATE INDEX idx_alertas_severidade ON alertas(severidade);
CREATE INDEX idx_alertas_status ON alertas(status);
CREATE INDEX idx_alertas_contrato ON alertas(contrato_id);
CREATE INDEX idx_alertas_created ON alertas(created_at DESC);
```

---

## indices_economicos
Cache de índices para cálculo de reajuste

```sql
CREATE TABLE public.indices_economicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indice TEXT NOT NULL CHECK (indice IN ('IGPM', 'IPCA', 'INPC', 'SELIC', 'CDI')),
  competencia DATE NOT NULL, -- Mês/ano
  valor DECIMAL(10,6) NOT NULL, -- Valor percentual
  acumulado_12m DECIMAL(10,6), -- Acumulado 12 meses
  fonte TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Constraint única
ALTER TABLE indices_economicos ADD CONSTRAINT uq_indices_competencia 
  UNIQUE (indice, competencia);

-- Índices
CREATE INDEX idx_indices_indice ON indices_economicos(indice);
CREATE INDEX idx_indices_competencia ON indices_economicos(competencia DESC);
```

---

# SCHEMA: OPS (Operações)

## recursos
Equipe técnica

```sql
CREATE TABLE public.recursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id), -- Vincula ao login (opcional)
  
  -- Dados pessoais
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  
  -- Profissional
  cargo TEXT NOT NULL,
  nivel TEXT CHECK (nivel IN ('estagiario', 'junior', 'pleno', 'senior', 'especialista', 'gerente')),
  area TEXT CHECK (area IN ('soc', 'pentest', 'grc', 'ot_security', 'vulnerabilidades', 'suporte', 'desenvolvimento', 'gestao')),
  
  -- Custos
  custo_hora DECIMAL(10,2) NOT NULL, -- Custo interno por hora
  valor_hora_cliente DECIMAL(10,2), -- Valor cobrado do cliente
  regime TEXT CHECK (regime IN ('clt', 'pj', 'estagio', 'terceiro')),
  
  -- Capacidade
  horas_mes_contrato INTEGER DEFAULT 168, -- Horas contratuais
  horas_mes_disponiveis INTEGER DEFAULT 160, -- Descontando férias, feriados
  
  -- Skills
  skills TEXT[] DEFAULT '{}',
  certificacoes JSONB DEFAULT '[]', -- [{"nome": "CEH", "validade": "2025-12-31"}]
  
  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'ferias', 'licenca', 'desligado')),
  data_admissao DATE,
  data_desligamento DATE,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_recursos_area ON recursos(area);
CREATE INDEX idx_recursos_status ON recursos(status);
CREATE INDEX idx_recursos_user ON recursos(user_id);
```

---

## alocacoes
Alocação de recursos em contratos/projetos

```sql
CREATE TABLE public.alocacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recurso_id UUID NOT NULL REFERENCES recursos(id),
  contrato_id UUID REFERENCES contratos(id),
  cliente_id UUID REFERENCES clientes(id),
  
  -- Período
  data_inicio DATE NOT NULL,
  data_fim DATE,
  
  -- Dedicação
  percentual_alocacao INTEGER CHECK (percentual_alocacao BETWEEN 0 AND 100),
  horas_mes_previstas INTEGER,
  
  -- Tipo
  tipo TEXT CHECK (tipo IN ('dedicado', 'compartilhado', 'sob_demanda')),
  papel TEXT, -- Papel no projeto
  
  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'encerrado')),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_alocacoes_recurso ON alocacoes(recurso_id);
CREATE INDEX idx_alocacoes_contrato ON alocacoes(contrato_id);
CREATE INDEX idx_alocacoes_status ON alocacoes(status);
```

---

## timesheet
Registro de horas trabalhadas

```sql
CREATE TABLE public.timesheet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clockify_id TEXT UNIQUE, -- ID no Clockify
  
  -- Recurso
  recurso_id UUID NOT NULL REFERENCES recursos(id),
  
  -- Alocação
  contrato_id UUID REFERENCES contratos(id),
  cliente_id UUID REFERENCES clientes(id),
  projeto TEXT, -- Nome do projeto (livre)
  atividade TEXT, -- Descrição da atividade
  
  -- Tempo
  data DATE NOT NULL,
  hora_inicio TIME,
  hora_fim TIME,
  duracao_minutos INTEGER NOT NULL,
  
  -- Classificação
  tipo TEXT NOT NULL CHECK (tipo IN ('faturavel', 'interno', 'comercial', 'treinamento', 'ferias', 'licenca')),
  categoria TEXT, -- Categoria da atividade
  
  -- Aprovação
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'faturado')),
  aprovado_por UUID REFERENCES users(id),
  aprovado_em TIMESTAMPTZ,
  
  -- Metadados
  clockify_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_timesheet_recurso ON timesheet(recurso_id);
CREATE INDEX idx_timesheet_contrato ON timesheet(contrato_id);
CREATE INDEX idx_timesheet_data ON timesheet(data);
CREATE INDEX idx_timesheet_tipo ON timesheet(tipo);
CREATE INDEX idx_timesheet_status ON timesheet(status);
CREATE INDEX idx_timesheet_clockify ON timesheet(clockify_id);

-- View de timesheet consolidado por mês
CREATE VIEW vw_timesheet_mensal AS
SELECT 
  recurso_id,
  contrato_id,
  cliente_id,
  DATE_TRUNC('month', data) as competencia,
  tipo,
  SUM(duracao_minutos) / 60.0 as horas,
  COUNT(*) as registros
FROM timesheet
GROUP BY recurso_id, contrato_id, cliente_id, DATE_TRUNC('month', data), tipo;
```

---

## chamados
Chamados de suporte (sync GLPI)

```sql
CREATE TABLE public.chamados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  glpi_id BIGINT UNIQUE,
  
  -- Identificação
  numero TEXT UNIQUE NOT NULL,
  
  -- Cliente
  cliente_id UUID REFERENCES clientes(id),
  contrato_id UUID REFERENCES contratos(id),
  solicitante_nome TEXT,
  solicitante_email TEXT,
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT CHECK (categoria IN ('incidente', 'requisicao', 'mudanca', 'problema')),
  subcategoria TEXT,
  
  -- Prioridade e SLA
  prioridade TEXT NOT NULL CHECK (prioridade IN ('critica', 'alta', 'media', 'baixa')),
  sla_horas INTEGER,
  sla_vencimento TIMESTAMPTZ,
  sla_status TEXT CHECK (sla_status IN ('dentro', 'risco', 'violado')),
  
  -- Status
  status TEXT NOT NULL CHECK (status IN ('aberto', 'em_andamento', 'aguardando_cliente', 'aguardando_terceiro', 'resolvido', 'fechado', 'cancelado')),
  
  -- Atribuição
  responsavel_id UUID REFERENCES recursos(id),
  equipe TEXT,
  
  -- Datas
  data_abertura TIMESTAMPTZ NOT NULL,
  data_primeira_resposta TIMESTAMPTZ,
  data_resolucao TIMESTAMPTZ,
  data_fechamento TIMESTAMPTZ,
  
  -- Tempo
  tempo_resposta_minutos INTEGER,
  tempo_resolucao_minutos INTEGER,
  tempo_total_minutos INTEGER,
  
  -- Resolução
  resolucao TEXT,
  causa_raiz TEXT,
  
  -- Metadados
  glpi_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_chamados_cliente ON chamados(cliente_id);
CREATE INDEX idx_chamados_contrato ON chamados(contrato_id);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_prioridade ON chamados(prioridade);
CREATE INDEX idx_chamados_responsavel ON chamados(responsavel_id);
CREATE INDEX idx_chamados_abertura ON chamados(data_abertura DESC);
CREATE INDEX idx_chamados_glpi ON chamados(glpi_id);
```

---

## custos_cloud
Custos de infraestrutura cloud

```sql
CREATE TABLE public.custos_cloud (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Provider
  provider TEXT NOT NULL CHECK (provider IN ('aws', 'gcp', 'azure', 'oracle', 'outros')),
  conta TEXT, -- ID da conta/projeto
  
  -- Período
  competencia DATE NOT NULL,
  
  -- Serviço
  servico TEXT NOT NULL, -- EC2, S3, BigQuery, etc.
  regiao TEXT,
  
  -- Valores
  valor_usd DECIMAL(15,2),
  valor_brl DECIMAL(15,2) NOT NULL,
  taxa_cambio DECIMAL(10,4),
  
  -- Rateio
  cliente_id UUID REFERENCES clientes(id),
  contrato_id UUID REFERENCES contratos(id),
  tags JSONB, -- Tags do recurso cloud
  
  -- Metadados
  sync_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_custos_cloud_provider ON custos_cloud(provider);
CREATE INDEX idx_custos_cloud_competencia ON custos_cloud(competencia);
CREATE INDEX idx_custos_cloud_cliente ON custos_cloud(cliente_id);
CREATE INDEX idx_custos_cloud_contrato ON custos_cloud(contrato_id);
```

---

## licencas
Licenças de software

```sql
CREATE TABLE public.licencas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  nome TEXT NOT NULL,
  fornecedor TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('perpetua', 'assinatura', 'por_usuario', 'por_dispositivo', 'por_volume')),
  
  -- Quantidades
  quantidade_contratada INTEGER NOT NULL,
  quantidade_em_uso INTEGER DEFAULT 0,
  
  -- Valores
  custo_unitario DECIMAL(15,2),
  custo_total_mensal DECIMAL(15,2) NOT NULL,
  moeda TEXT DEFAULT 'BRL',
  
  -- Vigência
  data_inicio DATE NOT NULL,
  data_vencimento DATE,
  renovacao_automatica BOOLEAN DEFAULT false,
  
  -- Rateio
  rateio JSONB, -- [{"contrato_id": "...", "quantidade": 5}]
  
  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'vencido', 'cancelado')),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_licencas_fornecedor ON licencas(fornecedor);
CREATE INDEX idx_licencas_vencimento ON licencas(data_vencimento);
CREATE INDEX idx_licencas_status ON licencas(status);
```

---

## servicos_monitorados
Status de serviços gerenciados

```sql
CREATE TABLE public.servicos_monitorados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  nome TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('siem', 'firewall', 'endpoint', 'backup', 'vpn', 'aplicacao', 'banco', 'servidor', 'rede')),
  
  -- Cliente
  cliente_id UUID REFERENCES clientes(id),
  contrato_id UUID REFERENCES contratos(id),
  
  -- Monitoramento
  url_health TEXT, -- URL para health check
  intervalo_check_segundos INTEGER DEFAULT 300,
  
  -- Status atual
  status TEXT DEFAULT 'desconhecido' CHECK (status IN ('online', 'degradado', 'offline', 'manutencao', 'desconhecido')),
  ultimo_check TIMESTAMPTZ,
  ultimo_status_change TIMESTAMPTZ,
  
  -- Métricas
  uptime_mes_percent DECIMAL(5,2),
  incidentes_mes INTEGER DEFAULT 0,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_servicos_cliente ON servicos_monitorados(cliente_id);
CREATE INDEX idx_servicos_status ON servicos_monitorados(status);
```

---

# SCHEMA: GROWTH (Comercial)

## leads
Leads e prospects

```sql
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  omie_id BIGINT,
  
  -- Empresa
  empresa TEXT NOT NULL,
  cnpj TEXT,
  website TEXT,
  segmento TEXT,
  porte TEXT,
  
  -- Contato
  contato_nome TEXT NOT NULL,
  contato_cargo TEXT,
  contato_email TEXT,
  contato_telefone TEXT,
  contato_linkedin TEXT,
  
  -- Origem
  origem TEXT CHECK (origem IN ('indicacao', 'website', 'linkedin', 'evento', 'cold_call', 'marketing', 'parceiro', 'outros')),
  campanha TEXT,
  indicado_por UUID REFERENCES clientes(id),
  
  -- Qualificação
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  temperatura TEXT CHECK (temperatura IN ('frio', 'morno', 'quente')),
  budget_estimado DECIMAL(15,2),
  prazo_decisao TEXT,
  
  -- Status
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'qualificado', 'desqualificado', 'convertido')),
  motivo_desqualificacao TEXT,
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  
  -- Datas
  data_primeiro_contato DATE,
  data_ultimo_contato DATE,
  proximo_contato DATE,
  
  -- Conversão
  oportunidade_id UUID, -- Preenchido quando converte
  cliente_id UUID REFERENCES clientes(id), -- Preenchido quando converte
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_responsavel ON leads(responsavel_id);
CREATE INDEX idx_leads_temperatura ON leads(temperatura);
CREATE INDEX idx_leads_origem ON leads(origem);
```

---

## oportunidades
Pipeline de vendas

```sql
CREATE TABLE public.oportunidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  titulo TEXT NOT NULL,
  
  -- Lead/Cliente
  lead_id UUID REFERENCES leads(id),
  cliente_id UUID REFERENCES clientes(id),
  
  -- Pipeline
  etapa TEXT NOT NULL CHECK (etapa IN (
    'qualificacao',  -- 10%
    'descoberta',    -- 20%
    'proposta',      -- 40%
    'negociacao',    -- 60%
    'fechamento',    -- 80%
    'ganho',         -- 100%
    'perdido'        -- 0%
  )),
  probabilidade INTEGER CHECK (probabilidade BETWEEN 0 AND 100),
  
  -- Valores
  valor_estimado DECIMAL(15,2),
  valor_proposta DECIMAL(15,2),
  valor_fechado DECIMAL(15,2),
  recorrencia TEXT CHECK (recorrencia IN ('unico', 'mensal', 'anual')),
  
  -- Serviços
  servicos_interesse TEXT[], -- ['pentest', 'soc', 'consultoria']
  
  -- Datas
  data_criacao DATE DEFAULT CURRENT_DATE,
  data_previsao_fechamento DATE,
  data_fechamento DATE,
  
  -- Concorrência
  concorrentes TEXT[],
  diferencial TEXT,
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  
  -- Resultado
  motivo_perda TEXT,
  feedback_cliente TEXT,
  
  -- Proposta vinculada
  proposta_id UUID, -- FK para propostas
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_oportunidades_etapa ON oportunidades(etapa);
CREATE INDEX idx_oportunidades_responsavel ON oportunidades(responsavel_id);
CREATE INDEX idx_oportunidades_cliente ON oportunidades(cliente_id);
CREATE INDEX idx_oportunidades_previsao ON oportunidades(data_previsao_fechamento);

-- View de forecast
CREATE VIEW vw_forecast AS
SELECT 
  DATE_TRUNC('month', data_previsao_fechamento) as mes,
  etapa,
  COUNT(*) as quantidade,
  SUM(valor_estimado) as valor_total,
  SUM(valor_estimado * probabilidade / 100) as valor_ponderado
FROM oportunidades
WHERE etapa NOT IN ('ganho', 'perdido')
GROUP BY DATE_TRUNC('month', data_previsao_fechamento), etapa;
```

---

## atividades
Registro de interações comerciais

```sql
CREATE TABLE public.atividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referência
  lead_id UUID REFERENCES leads(id),
  oportunidade_id UUID REFERENCES oportunidades(id),
  cliente_id UUID REFERENCES clientes(id),
  
  -- Tipo
  tipo TEXT NOT NULL CHECK (tipo IN ('ligacao', 'email', 'reuniao', 'apresentacao', 'proposta', 'follow_up', 'visita', 'evento', 'outro')),
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  descricao TEXT,
  resultado TEXT,
  
  -- Participantes
  participantes TEXT[],
  
  -- Data
  data_atividade TIMESTAMPTZ NOT NULL,
  duracao_minutos INTEGER,
  
  -- Próximos passos
  proximo_passo TEXT,
  data_proximo_passo DATE,
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_atividades_lead ON atividades(lead_id);
CREATE INDEX idx_atividades_oportunidade ON atividades(oportunidade_id);
CREATE INDEX idx_atividades_data ON atividades(data_atividade DESC);
CREATE INDEX idx_atividades_tipo ON atividades(tipo);
```

---

## propostas
Propostas comerciais

```sql
CREATE TABLE public.propostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  numero TEXT UNIQUE NOT NULL, -- PROP-2025-001
  versao INTEGER DEFAULT 1,
  
  -- Cliente
  cliente_id UUID REFERENCES clientes(id),
  oportunidade_id UUID REFERENCES oportunidades(id),
  
  -- Contato
  contato_nome TEXT,
  contato_cargo TEXT,
  contato_email TEXT,
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  introducao TEXT,
  escopo TEXT,
  exclusoes TEXT,
  premissas TEXT,
  entregaveis TEXT,
  cronograma TEXT,
  equipe TEXT,
  
  -- Valores
  valor_total DECIMAL(15,2) NOT NULL,
  desconto_percent DECIMAL(5,2) DEFAULT 0,
  valor_final DECIMAL(15,2) NOT NULL,
  forma_pagamento TEXT,
  condicoes_pagamento TEXT,
  
  -- Validade
  data_emissao DATE DEFAULT CURRENT_DATE,
  validade_dias INTEGER DEFAULT 30,
  data_validade DATE,
  
  -- Status
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'em_revisao', 'enviada', 'em_negociacao', 'aceita', 'recusada', 'expirada', 'cancelada')),
  
  -- Resultado
  data_resposta DATE,
  motivo_recusa TEXT,
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  aprovador_id UUID REFERENCES users(id),
  
  -- Documento
  documento_url TEXT, -- PDF gerado
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_propostas_cliente ON propostas(cliente_id);
CREATE INDEX idx_propostas_oportunidade ON propostas(oportunidade_id);
CREATE INDEX idx_propostas_status ON propostas(status);
CREATE INDEX idx_propostas_numero ON propostas(numero);
```

---

## proposta_itens
Itens/serviços de uma proposta

```sql
CREATE TABLE public.proposta_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id UUID NOT NULL REFERENCES propostas(id) ON DELETE CASCADE,
  
  -- Serviço
  servico_id UUID REFERENCES servicos_catalogo(id),
  
  -- Descrição
  titulo TEXT NOT NULL,
  descricao TEXT,
  
  -- Quantidade e valores
  quantidade DECIMAL(10,2) DEFAULT 1,
  unidade TEXT DEFAULT 'un', -- un, hora, mes, projeto
  valor_unitario DECIMAL(15,2) NOT NULL,
  valor_total DECIMAL(15,2) NOT NULL,
  
  -- Esforço
  horas_estimadas DECIMAL(10,2),
  
  -- Ordem
  ordem INTEGER DEFAULT 0,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_proposta_itens_proposta ON proposta_itens(proposta_id);
```

---

## servicos_catalogo
Catálogo de serviços padronizados

```sql
CREATE TABLE public.servicos_catalogo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT CHECK (categoria IN ('consultoria', 'projeto', 'recorrente', 'treinamento', 'produto')),
  
  -- Descrição
  descricao_curta TEXT,
  descricao_completa TEXT,
  entregaveis TEXT,
  
  -- Precificação
  tipo_precificacao TEXT CHECK (tipo_precificacao IN ('hora', 'projeto', 'mensal', 'anual', 'por_usuario')),
  valor_minimo DECIMAL(15,2),
  valor_referencia DECIMAL(15,2),
  valor_maximo DECIMAL(15,2),
  
  -- Esforço
  horas_estimadas_min INTEGER,
  horas_estimadas_max INTEGER,
  
  -- Recursos
  perfil_recursos TEXT[], -- ['senior', 'pleno']
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Dados iniciais
INSERT INTO servicos_catalogo (codigo, nome, categoria, tipo_precificacao, valor_referencia) VALUES
('PENTEST-WEB', 'Pentest Aplicação Web', 'projeto', 'projeto', 25000),
('PENTEST-INFRA', 'Pentest Infraestrutura', 'projeto', 'projeto', 35000),
('PENTEST-MOBILE', 'Pentest Aplicação Mobile', 'projeto', 'projeto', 30000),
('SOC-8X5', 'SOC Monitoramento 8x5', 'recorrente', 'mensal', 15000),
('SOC-24X7', 'SOC Monitoramento 24x7', 'recorrente', 'mensal', 45000),
('VULN-MGMT', 'Gestão de Vulnerabilidades', 'recorrente', 'mensal', 8000),
('LGPD-ASSESS', 'Assessment LGPD', 'projeto', 'projeto', 40000),
('LGPD-IMPL', 'Implementação LGPD', 'projeto', 'projeto', 80000),
('ISO27001-GAP', 'Gap Analysis ISO 27001', 'projeto', 'projeto', 35000),
('ISO27001-IMPL', 'Implementação ISO 27001', 'projeto', 'projeto', 120000),
('AWARENESS', 'Programa de Conscientização', 'projeto', 'projeto', 25000),
('CONSULTORIA-HR', 'Consultoria por Hora', 'consultoria', 'hora', 350);
```

---

# SCHEMA: JUR (Jurídico)

## contratos_jur
Gestão de contratos jurídicos

```sql
CREATE TABLE public.contratos_jur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  numero TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('cliente', 'fornecedor', 'parceria', 'nda', 'trabalho', 'locacao', 'outros')),
  
  -- Partes
  parte_contratante TEXT NOT NULL, -- ness. ou cliente
  parte_contratada TEXT NOT NULL,
  cnpj_contratada TEXT,
  
  -- Referência
  cliente_id UUID REFERENCES clientes(id),
  contrato_comercial_id UUID REFERENCES contratos(id),
  
  -- Valores
  valor_total DECIMAL(15,2),
  moeda TEXT DEFAULT 'BRL',
  
  -- Vigência
  data_assinatura DATE,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  prazo_indeterminado BOOLEAN DEFAULT false,
  
  -- Renovação
  renovacao_automatica BOOLEAN DEFAULT false,
  aviso_denuncia_dias INTEGER DEFAULT 90,
  
  -- Status
  status TEXT DEFAULT 'vigente' CHECK (status IN ('minuta', 'em_negociacao', 'assinado', 'vigente', 'suspenso', 'encerrado', 'rescindido')),
  
  -- Documentos
  documento_minuta_url TEXT,
  documento_assinado_url TEXT,
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_contratos_jur_tipo ON contratos_jur(tipo);
CREATE INDEX idx_contratos_jur_status ON contratos_jur(status);
CREATE INDEX idx_contratos_jur_cliente ON contratos_jur(cliente_id);
CREATE INDEX idx_contratos_jur_data_fim ON contratos_jur(data_fim);
```

---

## clausulas
Cláusulas extraídas de contratos

```sql
CREATE TABLE public.clausulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_jur_id UUID NOT NULL REFERENCES contratos_jur(id) ON DELETE CASCADE,
  
  -- Identificação
  numero TEXT, -- "3.1", "5.2.1"
  titulo TEXT NOT NULL,
  
  -- Conteúdo
  texto TEXT NOT NULL,
  resumo TEXT, -- Gerado por IA
  
  -- Classificação
  tipo TEXT CHECK (tipo IN ('objeto', 'valor', 'prazo', 'rescisao', 'confidencialidade', 'propriedade_intelectual', 'responsabilidade', 'penalidade', 'foro', 'outros')),
  risco TEXT CHECK (risco IN ('baixo', 'medio', 'alto', 'critico')),
  
  -- Prazos
  tem_prazo BOOLEAN DEFAULT false,
  prazo_data DATE,
  prazo_descricao TEXT,
  
  -- Embedding para busca semântica
  embedding VECTOR(1536), -- OpenAI ada-002
  
  -- Metadados
  extraido_por TEXT CHECK (extraido_por IN ('manual', 'ia')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_clausulas_contrato ON clausulas(contrato_jur_id);
CREATE INDEX idx_clausulas_tipo ON clausulas(tipo);
CREATE INDEX idx_clausulas_risco ON clausulas(risco);
```

---

## documentos
Repositório de documentos jurídicos

```sql
CREATE TABLE public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  titulo TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('contrato', 'aditivo', 'distrato', 'procuracao', 'ata', 'estatuto', 'nda', 'termo', 'parecer', 'outros')),
  
  -- Referências
  contrato_jur_id UUID REFERENCES contratos_jur(id),
  cliente_id UUID REFERENCES clientes(id),
  
  -- Arquivo
  arquivo_nome TEXT NOT NULL,
  arquivo_url TEXT NOT NULL,
  arquivo_tamanho INTEGER,
  arquivo_tipo TEXT, -- MIME type
  
  -- Versionamento
  versao INTEGER DEFAULT 1,
  versao_anterior_id UUID REFERENCES documentos(id),
  
  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('rascunho', 'em_revisao', 'aprovado', 'ativo', 'obsoleto')),
  
  -- Aprovação
  aprovado_por UUID REFERENCES users(id),
  aprovado_em TIMESTAMPTZ,
  
  -- Conteúdo extraído
  conteudo_texto TEXT, -- Texto extraído do PDF
  embedding VECTOR(1536),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_documentos_tipo ON documentos(tipo);
CREATE INDEX idx_documentos_contrato ON documentos(contrato_jur_id);
CREATE INDEX idx_documentos_status ON documentos(status);
```

---

## prazos
Prazos e obrigações contratuais

```sql
CREATE TABLE public.prazos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referência
  contrato_jur_id UUID REFERENCES contratos_jur(id),
  clausula_id UUID REFERENCES clausulas(id),
  
  -- Descrição
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT CHECK (tipo IN ('renovacao', 'denuncia', 'entrega', 'pagamento', 'obrigacao', 'vencimento', 'outros')),
  
  -- Data
  data_limite DATE NOT NULL,
  recorrencia TEXT CHECK (recorrencia IN ('unica', 'mensal', 'trimestral', 'anual')),
  
  -- Alertas
  alertar_dias_antes INTEGER[] DEFAULT '{30, 15, 7}',
  
  -- Status
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'cumprido', 'atrasado', 'cancelado')),
  cumprido_em DATE,
  cumprido_por UUID REFERENCES users(id),
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_prazos_data ON prazos(data_limite);
CREATE INDEX idx_prazos_status ON prazos(status);
CREATE INDEX idx_prazos_contrato ON prazos(contrato_jur_id);
```

---

## processos
Processos judiciais/administrativos

```sql
CREATE TABLE public.processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  numero TEXT UNIQUE NOT NULL, -- Número CNJ ou administrativo
  tipo TEXT CHECK (tipo IN ('judicial_civil', 'judicial_trabalhista', 'judicial_tributario', 'administrativo', 'arbitragem')),
  
  -- Partes
  polo_ativo TEXT NOT NULL,
  polo_passivo TEXT NOT NULL,
  posicao_ness TEXT CHECK (posicao_ness IN ('autor', 'reu', 'terceiro', 'interessado')),
  
  -- Detalhes
  assunto TEXT NOT NULL,
  descricao TEXT,
  valor_causa DECIMAL(15,2),
  vara TEXT,
  comarca TEXT,
  uf CHAR(2),
  
  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'suspenso', 'arquivado', 'encerrado')),
  fase TEXT,
  
  -- Datas
  data_distribuicao DATE,
  data_citacao DATE,
  data_ultimo_andamento DATE,
  proxima_audiencia DATE,
  
  -- Advogado
  advogado_responsavel TEXT,
  escritorio TEXT,
  
  -- Provisão
  provisao_valor DECIMAL(15,2),
  risco TEXT CHECK (risco IN ('remoto', 'possivel', 'provavel')),
  
  -- Referência
  cliente_id UUID REFERENCES clientes(id),
  contrato_jur_id UUID REFERENCES contratos_jur(id),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_processos_tipo ON processos(tipo);
CREATE INDEX idx_processos_status ON processos(status);
CREATE INDEX idx_processos_cliente ON processos(cliente_id);
```

---

# SCHEMA: GOV (Governança)

## frameworks
Frameworks de compliance

```sql
CREATE TABLE public.frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  codigo TEXT UNIQUE NOT NULL, -- ISO27001, NIST-CSF, CIS-V8
  nome TEXT NOT NULL,
  versao TEXT,
  
  -- Descrição
  descricao TEXT,
  escopo TEXT,
  
  -- Organização
  organizacao TEXT, -- ISO, NIST, CIS, etc.
  website TEXT,
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dados iniciais
INSERT INTO frameworks (codigo, nome, versao, organizacao) VALUES
('ISO27001', 'ISO/IEC 27001', '2022', 'ISO'),
('ISO27002', 'ISO/IEC 27002', '2022', 'ISO'),
('NIST-CSF', 'NIST Cybersecurity Framework', '2.0', 'NIST'),
('CIS-V8', 'CIS Controls', 'v8.1', 'CIS'),
('LGPD', 'Lei Geral de Proteção de Dados', 'Lei 13.709', 'Brasil'),
('SOC2', 'SOC 2 Type II', '2017', 'AICPA'),
('PCI-DSS', 'PCI Data Security Standard', 'v4.0', 'PCI SSC'),
('IEC62443', 'IEC 62443', '2018', 'IEC');
```

---

## controles
Controles de cada framework

```sql
CREATE TABLE public.controles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID NOT NULL REFERENCES frameworks(id),
  
  -- Identificação
  codigo TEXT NOT NULL, -- A.5.1, CSF.ID.AM-1
  titulo TEXT NOT NULL,
  
  -- Descrição
  descricao TEXT,
  objetivo TEXT,
  implementacao TEXT, -- Guia de implementação
  
  -- Hierarquia
  controle_pai_id UUID REFERENCES controles(id),
  nivel INTEGER DEFAULT 1, -- 1=domínio, 2=objetivo, 3=controle
  ordem INTEGER,
  
  -- Classificação
  categoria TEXT, -- Organizacional, Técnico, Físico, Legal
  obrigatorio BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(framework_id, codigo)
);

-- Índices
CREATE INDEX idx_controles_framework ON controles(framework_id);
CREATE INDEX idx_controles_pai ON controles(controle_pai_id);
```

---

## avaliacoes
Avaliações de maturidade

```sql
CREATE TABLE public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Escopo
  framework_id UUID NOT NULL REFERENCES frameworks(id),
  cliente_id UUID REFERENCES clientes(id), -- NULL = avaliação interna ness.
  
  -- Identificação
  titulo TEXT NOT NULL,
  descricao TEXT,
  
  -- Período
  data_inicio DATE NOT NULL,
  data_fim DATE,
  
  -- Status
  status TEXT DEFAULT 'em_andamento' CHECK (status IN ('planejada', 'em_andamento', 'em_revisao', 'concluida', 'cancelada')),
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  
  -- Resultado
  score_geral DECIMAL(5,2), -- 0-100
  maturidade_geral TEXT CHECK (maturidade_geral IN ('inexistente', 'inicial', 'repetivel', 'definido', 'gerenciado', 'otimizado')),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_avaliacoes_framework ON avaliacoes(framework_id);
CREATE INDEX idx_avaliacoes_cliente ON avaliacoes(cliente_id);
CREATE INDEX idx_avaliacoes_status ON avaliacoes(status);
```

---

## avaliacao_controles
Avaliação de cada controle

```sql
CREATE TABLE public.avaliacao_controles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliacao_id UUID NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
  controle_id UUID NOT NULL REFERENCES controles(id),
  
  -- Avaliação
  maturidade INTEGER CHECK (maturidade BETWEEN 0 AND 5),
  -- 0=Inexistente, 1=Inicial, 2=Repetível, 3=Definido, 4=Gerenciado, 5=Otimizado
  
  aplicavel BOOLEAN DEFAULT true,
  motivo_nao_aplicavel TEXT,
  
  -- Evidências
  evidencias TEXT,
  observacoes TEXT,
  
  -- Gaps identificados
  tem_gap BOOLEAN DEFAULT false,
  gap_descricao TEXT,
  gap_risco TEXT CHECK (gap_risco IN ('baixo', 'medio', 'alto', 'critico')),
  
  -- Avaliador
  avaliado_por UUID REFERENCES users(id),
  avaliado_em TIMESTAMPTZ,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_avaliacao_controles_avaliacao ON avaliacao_controles(avaliacao_id);
CREATE INDEX idx_avaliacao_controles_controle ON avaliacao_controles(controle_id);
CREATE INDEX idx_avaliacao_controles_gap ON avaliacao_controles(tem_gap);
```

---

## gaps
Gaps identificados nas avaliações

```sql
CREATE TABLE public.gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referência
  avaliacao_id UUID NOT NULL REFERENCES avaliacoes(id),
  avaliacao_controle_id UUID REFERENCES avaliacao_controles(id),
  controle_id UUID NOT NULL REFERENCES controles(id),
  
  -- Descrição
  titulo TEXT NOT NULL,
  descricao TEXT,
  impacto TEXT,
  
  -- Classificação
  risco TEXT NOT NULL CHECK (risco IN ('baixo', 'medio', 'alto', 'critico')),
  prioridade INTEGER CHECK (prioridade BETWEEN 1 AND 5),
  
  -- Status
  status TEXT DEFAULT 'identificado' CHECK (status IN ('identificado', 'em_tratamento', 'tratado', 'aceito', 'transferido')),
  
  -- Tratamento
  plano_acao_id UUID, -- FK para planos_acao
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_gaps_avaliacao ON gaps(avaliacao_id);
CREATE INDEX idx_gaps_risco ON gaps(risco);
CREATE INDEX idx_gaps_status ON gaps(status);
```

---

## planos_acao
Planos de ação para tratar gaps

```sql
CREATE TABLE public.planos_acao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  titulo TEXT NOT NULL,
  descricao TEXT,
  
  -- Referência
  gap_id UUID REFERENCES gaps(id),
  avaliacao_id UUID REFERENCES avaliacoes(id),
  
  -- Ações
  acoes JSONB DEFAULT '[]', -- [{descricao, responsavel, prazo, status}]
  
  -- Prazo
  data_inicio DATE,
  data_prevista DATE NOT NULL,
  data_conclusao DATE,
  
  -- Status
  status TEXT DEFAULT 'planejado' CHECK (status IN ('planejado', 'em_andamento', 'atrasado', 'concluido', 'cancelado')),
  percentual_conclusao INTEGER DEFAULT 0 CHECK (percentual_conclusao BETWEEN 0 AND 100),
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_planos_acao_gap ON planos_acao(gap_id);
CREATE INDEX idx_planos_acao_status ON planos_acao(status);
CREATE INDEX idx_planos_acao_prazo ON planos_acao(data_prevista);
```

---

## politicas
Repositório de políticas e normas

```sql
CREATE TABLE public.politicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  codigo TEXT UNIQUE NOT NULL, -- POL-001, NRM-005
  titulo TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('politica', 'norma', 'procedimento', 'guideline', 'manual')),
  
  -- Conteúdo
  objetivo TEXT,
  escopo TEXT,
  conteudo TEXT, -- Markdown
  
  -- Versionamento
  versao TEXT NOT NULL DEFAULT '1.0',
  versao_anterior_id UUID REFERENCES politicas(id),
  
  -- Aprovação
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'em_revisao', 'aprovada', 'obsoleta')),
  aprovada_por UUID REFERENCES users(id),
  aprovada_em DATE,
  data_vigencia DATE,
  proxima_revisao DATE,
  
  -- Documento
  documento_url TEXT,
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  area_responsavel TEXT,
  
  -- Conformidade
  frameworks_relacionados UUID[] DEFAULT '{}', -- IDs de frameworks
  controles_relacionados UUID[] DEFAULT '{}', -- IDs de controles
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_politicas_tipo ON politicas(tipo);
CREATE INDEX idx_politicas_status ON politicas(status);
```

---

# SCHEMA: PEOPLE (RH)

## colaboradores
Cadastro completo de colaboradores

```sql
CREATE TABLE public.colaboradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  recurso_id UUID REFERENCES recursos(id), -- Link com OPS
  
  -- Dados pessoais
  nome_completo TEXT NOT NULL,
  cpf TEXT UNIQUE,
  rg TEXT,
  data_nascimento DATE,
  genero TEXT CHECK (genero IN ('masculino', 'feminino', 'outro', 'nao_informado')),
  estado_civil TEXT,
  
  -- Contato
  email_pessoal TEXT,
  email_corporativo TEXT,
  telefone TEXT,
  celular TEXT,
  
  -- Endereço
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  uf CHAR(2),
  cep TEXT,
  
  -- Documentos
  pis TEXT,
  ctps_numero TEXT,
  ctps_serie TEXT,
  
  -- Contratação
  tipo_contrato TEXT CHECK (tipo_contrato IN ('clt', 'pj', 'estagio', 'temporario', 'aprendiz')),
  data_admissao DATE NOT NULL,
  data_demissao DATE,
  
  -- Cargo atual
  cargo TEXT NOT NULL,
  departamento TEXT,
  gestor_id UUID REFERENCES colaboradores(id),
  nivel TEXT CHECK (nivel IN ('estagiario', 'junior', 'pleno', 'senior', 'especialista', 'coordenador', 'gerente', 'diretor', 'ceo')),
  
  -- Remuneração
  salario_base DECIMAL(15,2),
  moeda TEXT DEFAULT 'BRL',
  
  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'ferias', 'licenca', 'afastado', 'desligado')),
  motivo_desligamento TEXT,
  
  -- Foto
  foto_url TEXT,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_colaboradores_status ON colaboradores(status);
CREATE INDEX idx_colaboradores_departamento ON colaboradores(departamento);
CREATE INDEX idx_colaboradores_gestor ON colaboradores(gestor_id);
CREATE INDEX idx_colaboradores_user ON colaboradores(user_id);
```

---

## historico_rh
Histórico de movimentações

```sql
CREATE TABLE public.historico_rh (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id),
  
  -- Tipo de movimentação
  tipo TEXT NOT NULL CHECK (tipo IN ('admissao', 'promocao', 'transferencia', 'merito', 'ajuste', 'ferias', 'licenca', 'retorno', 'demissao')),
  
  -- Detalhes
  descricao TEXT,
  
  -- Valores anteriores e novos
  cargo_anterior TEXT,
  cargo_novo TEXT,
  departamento_anterior TEXT,
  departamento_novo TEXT,
  salario_anterior DECIMAL(15,2),
  salario_novo DECIMAL(15,2),
  gestor_anterior_id UUID REFERENCES colaboradores(id),
  gestor_novo_id UUID REFERENCES colaboradores(id),
  
  -- Data
  data_efetivacao DATE NOT NULL,
  
  -- Aprovação
  aprovado_por UUID REFERENCES users(id),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_historico_colaborador ON historico_rh(colaborador_id);
CREATE INDEX idx_historico_tipo ON historico_rh(tipo);
CREATE INDEX idx_historico_data ON historico_rh(data_efetivacao DESC);
```

---

## ferias
Controle de férias

```sql
CREATE TABLE public.ferias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id),
  
  -- Período aquisitivo
  periodo_aquisitivo_inicio DATE NOT NULL,
  periodo_aquisitivo_fim DATE NOT NULL,
  
  -- Férias
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias_gozados INTEGER NOT NULL,
  dias_vendidos INTEGER DEFAULT 0,
  
  -- Abono
  abono_pecuniario BOOLEAN DEFAULT false,
  valor_abono DECIMAL(15,2),
  
  -- Status
  status TEXT DEFAULT 'programada' CHECK (status IN ('programada', 'aprovada', 'em_gozo', 'concluida', 'cancelada')),
  
  -- Aprovação
  aprovado_por UUID REFERENCES users(id),
  aprovado_em DATE,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_ferias_colaborador ON ferias(colaborador_id);
CREATE INDEX idx_ferias_status ON ferias(status);
CREATE INDEX idx_ferias_data ON ferias(data_inicio);
```

---

## avaliacoes_desempenho
Ciclos de avaliação de desempenho

```sql
CREATE TABLE public.avaliacoes_desempenho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ciclo
  ciclo_nome TEXT NOT NULL, -- "2024-S2", "2025-Q1"
  ciclo_inicio DATE NOT NULL,
  ciclo_fim DATE NOT NULL,
  
  -- Colaborador
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id),
  gestor_id UUID REFERENCES colaboradores(id),
  
  -- Metas
  metas JSONB DEFAULT '[]', -- [{titulo, descricao, peso, nota, comentario}]
  
  -- Competências
  competencias JSONB DEFAULT '[]', -- [{nome, descricao, nota_auto, nota_gestor}]
  
  -- Scores
  nota_metas DECIMAL(4,2), -- 0-10
  nota_competencias DECIMAL(4,2), -- 0-10
  nota_final DECIMAL(4,2), -- Média ponderada
  
  -- Classificação (9-box)
  performance TEXT CHECK (performance IN ('baixa', 'media', 'alta')),
  potencial TEXT CHECK (potencial IN ('baixo', 'medio', 'alto')),
  nine_box TEXT, -- "1A", "2B", "3C", etc.
  
  -- Feedback
  autoavaliacao_comentario TEXT,
  gestor_comentario TEXT,
  plano_desenvolvimento TEXT,
  
  -- Status
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'autoavaliacao', 'avaliacao_gestor', 'calibracao', 'feedback', 'concluida')),
  
  -- Datas
  autoavaliacao_em TIMESTAMPTZ,
  avaliacao_gestor_em TIMESTAMPTZ,
  feedback_em TIMESTAMPTZ,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_avaliacoes_desemp_colaborador ON avaliacoes_desempenho(colaborador_id);
CREATE INDEX idx_avaliacoes_desemp_ciclo ON avaliacoes_desempenho(ciclo_nome);
CREATE INDEX idx_avaliacoes_desemp_status ON avaliacoes_desempenho(status);
```

---

## treinamentos
Catálogo de treinamentos

```sql
CREATE TABLE public.treinamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  codigo TEXT UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  
  -- Classificação
  categoria TEXT CHECK (categoria IN ('tecnico', 'comportamental', 'lideranca', 'compliance', 'certificacao', 'onboarding')),
  modalidade TEXT CHECK (modalidade IN ('presencial', 'online', 'hibrido', 'autoestudo')),
  
  -- Carga horária
  carga_horaria INTEGER, -- Horas
  
  -- Fornecedor
  interno BOOLEAN DEFAULT true,
  fornecedor TEXT,
  
  -- Custo
  custo_pessoa DECIMAL(15,2),
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_treinamentos_categoria ON treinamentos(categoria);
CREATE INDEX idx_treinamentos_ativo ON treinamentos(ativo);
```

---

## inscricoes_treinamento
Inscrições em treinamentos

```sql
CREATE TABLE public.inscricoes_treinamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id),
  treinamento_id UUID NOT NULL REFERENCES treinamentos(id),
  
  -- Turma
  turma TEXT,
  data_inicio DATE,
  data_fim DATE,
  
  -- Status
  status TEXT DEFAULT 'inscrito' CHECK (status IN ('inscrito', 'em_andamento', 'concluido', 'reprovado', 'cancelado', 'no_show')),
  
  -- Resultado
  nota DECIMAL(5,2),
  frequencia_percent DECIMAL(5,2),
  certificado_url TEXT,
  
  -- Custo
  custo DECIMAL(15,2),
  
  -- Aprovação
  aprovado_por UUID REFERENCES users(id),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_inscricoes_colaborador ON inscricoes_treinamento(colaborador_id);
CREATE INDEX idx_inscricoes_treinamento ON inscricoes_treinamento(treinamento_id);
CREATE INDEX idx_inscricoes_status ON inscricoes_treinamento(status);
```

---

## certificacoes
Certificações profissionais

```sql
CREATE TABLE public.certificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id),
  
  -- Certificação
  nome TEXT NOT NULL, -- CISSP, CEH, ISO 27001 LA, etc.
  emissor TEXT NOT NULL, -- ISC2, EC-Council, etc.
  codigo_credencial TEXT,
  
  -- Validade
  data_obtencao DATE NOT NULL,
  data_validade DATE,
  
  -- Status
  status TEXT DEFAULT 'valida' CHECK (status IN ('valida', 'expirando', 'expirada', 'renovada')),
  
  -- Custo
  custo_exame DECIMAL(15,2),
  custo_manutencao_anual DECIMAL(15,2),
  pago_pela_empresa BOOLEAN DEFAULT true,
  
  -- Documento
  certificado_url TEXT,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_certificacoes_colaborador ON certificacoes(colaborador_id);
CREATE INDEX idx_certificacoes_status ON certificacoes(status);
CREATE INDEX idx_certificacoes_validade ON certificacoes(data_validade);

-- View de certificações vencendo
CREATE VIEW vw_certificacoes_vencendo AS
SELECT 
  c.*,
  col.nome_completo as colaborador_nome,
  (c.data_validade - CURRENT_DATE) as dias_ate_vencimento
FROM certificacoes c
JOIN colaboradores col ON c.colaborador_id = col.id
WHERE c.data_validade IS NOT NULL
  AND c.status = 'valida'
  AND (c.data_validade - CURRENT_DATE) <= 90;
```

---

# SCHEMA: AI (Inteligência Artificial)

## conversations
Conversas com agentes IA

```sql
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Agente
  agente TEXT NOT NULL CHECK (agente IN ('rex.master', 'rex.fin', 'rex.ops', 'rex.growth', 'rex.jur', 'rex.gov', 'rex.people', 'rex.kb')),
  
  -- Contexto
  titulo TEXT,
  contexto JSONB, -- Dados de contexto inicial
  
  -- Status
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'encerrada', 'arquivada')),
  
  -- Métricas
  total_mensagens INTEGER DEFAULT 0,
  total_tokens_input INTEGER DEFAULT 0,
  total_tokens_output INTEGER DEFAULT 0,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_agente ON conversations(agente);
CREATE INDEX idx_conversations_created ON conversations(created_at DESC);
```

---

## messages
Mensagens das conversas

```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Papel
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  
  -- Conteúdo
  content TEXT NOT NULL,
  
  -- Tool calls (para function calling)
  tool_calls JSONB, -- [{id, name, arguments}]
  tool_call_id TEXT, -- ID quando é resposta de tool
  
  -- Métricas
  tokens_input INTEGER,
  tokens_output INTEGER,
  latency_ms INTEGER,
  
  -- Modelo usado
  model TEXT,
  
  -- Feedback
  feedback_positivo BOOLEAN,
  feedback_comentario TEXT,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_created ON messages(created_at);
```

---

## embeddings
Embeddings para RAG

```sql
CREATE TABLE public.embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Fonte
  fonte_tipo TEXT NOT NULL CHECK (fonte_tipo IN ('documento', 'politica', 'contrato', 'clausula', 'kb_artigo', 'proposta')),
  fonte_id UUID NOT NULL,
  
  -- Conteúdo
  conteudo TEXT NOT NULL,
  chunk_index INTEGER DEFAULT 0, -- Para documentos divididos
  
  -- Embedding
  embedding VECTOR(1536) NOT NULL, -- OpenAI ada-002 ou similar
  
  -- Metadados
  metadata JSONB DEFAULT '{}',
  
  -- Modelo
  modelo TEXT DEFAULT 'text-embedding-ada-002',
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para busca por similaridade
CREATE INDEX idx_embeddings_vector ON embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_embeddings_fonte ON embeddings(fonte_tipo, fonte_id);
```

---

## agent_logs
Logs de execução dos agentes

```sql
CREATE TABLE public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  message_id UUID REFERENCES messages(id),
  
  -- Agente
  agente TEXT NOT NULL,
  
  -- Ação
  acao TEXT NOT NULL, -- 'query_database', 'search_documents', 'calculate', etc.
  parametros JSONB,
  resultado JSONB,
  
  -- Status
  sucesso BOOLEAN NOT NULL,
  erro TEXT,
  
  -- Performance
  duracao_ms INTEGER,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_agent_logs_conversation ON agent_logs(conversation_id);
CREATE INDEX idx_agent_logs_agente ON agent_logs(agente);
CREATE INDEX idx_agent_logs_acao ON agent_logs(acao);
```

---

## tokens_usage
Uso de tokens para controle de custos

```sql
CREATE TABLE public.tokens_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  -- Período
  data DATE NOT NULL,
  
  -- Uso
  modelo TEXT NOT NULL,
  tokens_input INTEGER NOT NULL,
  tokens_output INTEGER NOT NULL,
  
  -- Custo estimado
  custo_estimado_usd DECIMAL(10,6),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para agregação
CREATE INDEX idx_tokens_usage_user_data ON tokens_usage(user_id, data);
CREATE INDEX idx_tokens_usage_data ON tokens_usage(data);

-- View de uso diário
CREATE VIEW vw_tokens_uso_diario AS
SELECT 
  data,
  user_id,
  modelo,
  SUM(tokens_input) as total_input,
  SUM(tokens_output) as total_output,
  SUM(custo_estimado_usd) as custo_total
FROM tokens_usage
GROUP BY data, user_id, modelo;
```

---

# Funções e Triggers

## Função: update_updated_at_column

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';
```

## Função: calcular_rentabilidade

```sql
CREATE OR REPLACE FUNCTION calcular_rentabilidade(
  p_contrato_id UUID,
  p_competencia DATE
) RETURNS TABLE (
  receita_total DECIMAL,
  custo_direto DECIMAL,
  overhead DECIMAL,
  impostos DECIMAL,
  margem DECIMAL,
  margem_percent DECIMAL
) AS $$
DECLARE
  v_receita DECIMAL;
  v_custo_horas DECIMAL;
  v_custo_cloud DECIMAL;
  v_custo_licencas DECIMAL;
  v_overhead_percent DECIMAL;
  v_impostos_percent DECIMAL;
BEGIN
  -- Buscar configs
  SELECT (valor::TEXT)::DECIMAL INTO v_overhead_percent 
  FROM configs WHERE chave = 'fin_overhead_percent';
  
  SELECT (valor::TEXT)::DECIMAL INTO v_impostos_percent 
  FROM configs WHERE chave = 'fin_impostos_percent';
  
  -- Buscar receita
  SELECT COALESCE(SUM(valor_total), 0) INTO v_receita
  FROM receitas
  WHERE contrato_id = p_contrato_id AND competencia = p_competencia;
  
  -- Calcular custo de horas
  SELECT COALESCE(SUM(t.duracao_minutos / 60.0 * r.custo_hora), 0) INTO v_custo_horas
  FROM timesheet t
  JOIN recursos r ON t.recurso_id = r.id
  WHERE t.contrato_id = p_contrato_id 
    AND DATE_TRUNC('month', t.data) = p_competencia
    AND t.tipo = 'faturavel';
  
  -- Calcular custo de cloud
  SELECT COALESCE(SUM(valor_brl), 0) INTO v_custo_cloud
  FROM custos_cloud
  WHERE contrato_id = p_contrato_id AND competencia = p_competencia;
  
  -- TODO: Calcular custo de licenças rateado
  v_custo_licencas := 0;
  
  -- Retornar
  RETURN QUERY SELECT
    v_receita,
    v_custo_horas + v_custo_cloud + v_custo_licencas,
    (v_custo_horas + v_custo_cloud + v_custo_licencas) * v_overhead_percent / 100,
    v_receita * v_impostos_percent / 100,
    v_receita - (v_custo_horas + v_custo_cloud + v_custo_licencas) 
      - ((v_custo_horas + v_custo_cloud + v_custo_licencas) * v_overhead_percent / 100)
      - (v_receita * v_impostos_percent / 100),
    CASE WHEN v_receita > 0 THEN
      ((v_receita - (v_custo_horas + v_custo_cloud + v_custo_licencas) 
        - ((v_custo_horas + v_custo_cloud + v_custo_licencas) * v_overhead_percent / 100)
        - (v_receita * v_impostos_percent / 100)) / v_receita) * 100
    ELSE 0 END;
END;
$$ LANGUAGE plpgsql;
```

## Função: gerar_alertas_vencimento

```sql
CREATE OR REPLACE FUNCTION gerar_alertas_vencimento()
RETURNS INTEGER AS $$
DECLARE
  v_dias_alerta INTEGER[];
  v_contrato RECORD;
  v_alertas_criados INTEGER := 0;
BEGIN
  -- Buscar configuração de dias
  SELECT ARRAY(SELECT jsonb_array_elements_text(valor)::INTEGER)
  INTO v_dias_alerta
  FROM configs WHERE chave = 'fin_alerta_vencimento_dias';
  
  -- Para cada contrato vencendo nos próximos dias configurados
  FOR v_contrato IN
    SELECT c.*, cl.razao_social as cliente_nome,
           (c.data_fim - CURRENT_DATE) as dias_ate_vencimento
    FROM contratos c
    JOIN clientes cl ON c.cliente_id = cl.id
    WHERE c.status = 'ativo'
      AND (c.data_fim - CURRENT_DATE) = ANY(v_dias_alerta)
      AND NOT EXISTS (
        SELECT 1 FROM alertas a
        WHERE a.contrato_id = c.id
          AND a.categoria = 'vencimento_contrato'
          AND a.status = 'pendente'
          AND DATE(a.created_at) = CURRENT_DATE
      )
  LOOP
    INSERT INTO alertas (
      categoria, severidade, contrato_id, cliente_id,
      titulo, mensagem, dados
    ) VALUES (
      'vencimento_contrato',
      CASE 
        WHEN v_contrato.dias_ate_vencimento <= 30 THEN 'critico'
        WHEN v_contrato.dias_ate_vencimento <= 60 THEN 'urgente'
        ELSE 'atencao'
      END,
      v_contrato.id,
      v_contrato.cliente_id,
      'Contrato vencendo em ' || v_contrato.dias_ate_vencimento || ' dias',
      'O contrato ' || v_contrato.numero || ' com ' || v_contrato.cliente_nome || 
        ' vence em ' || TO_CHAR(v_contrato.data_fim, 'DD/MM/YYYY'),
      jsonb_build_object(
        'numero_contrato', v_contrato.numero,
        'cliente', v_contrato.cliente_nome,
        'data_vencimento', v_contrato.data_fim,
        'valor_mensal', v_contrato.valor_mensal
      )
    );
    
    v_alertas_criados := v_alertas_criados + 1;
  END LOOP;
  
  RETURN v_alertas_criados;
END;
$$ LANGUAGE plpgsql;
```

---

# Row Level Security (RLS)

## Políticas básicas

```sql
-- Habilitar RLS nas tabelas principais
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

-- Política para admins (acesso total)
CREATE POLICY admin_all ON clientes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Política para CFO no módulo FIN
CREATE POLICY cfo_fin ON contratos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin', 'cfo', 'ceo')
    )
  );

-- Política de leitura para viewers
CREATE POLICY viewer_read ON contratos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin', 'cfo', 'coo', 'ceo', 'viewer')
    )
  );

-- Política para usuários verem apenas seus alertas
CREATE POLICY user_own_notifications ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());
```

---

# Extensões Necessárias

```sql
-- UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vetores para IA/RAG
CREATE EXTENSION IF NOT EXISTS "vector";

-- Busca full-text
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Cron jobs
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Estatísticas
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

---

# Jobs Agendados (pg_cron)

```sql
-- Sync Omie diário às 03:00
SELECT cron.schedule('sync-omie', '0 3 * * *', 
  'SELECT net.http_post(
    url := ''https://your-project.supabase.co/functions/v1/sync-omie'',
    headers := ''{"Authorization": "Bearer YOUR_SERVICE_KEY"}''::jsonb
  );'
);

-- Gerar alertas de vencimento às 06:00
SELECT cron.schedule('alertas-vencimento', '0 6 * * *', 
  'SELECT gerar_alertas_vencimento();'
);

-- Calcular rentabilidade no dia 5 de cada mês
SELECT cron.schedule('calc-rentabilidade', '0 4 5 * *', 
  'SELECT net.http_post(
    url := ''https://your-project.supabase.co/functions/v1/calcular-rentabilidade'',
    headers := ''{"Authorization": "Bearer YOUR_SERVICE_KEY"}''::jsonb
  );'
);

-- Limpar logs antigos (> 90 dias) semanalmente
SELECT cron.schedule('cleanup-logs', '0 2 * * 0', 
  'DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL ''90 days'';
   DELETE FROM sync_logs WHERE iniciado_em < NOW() - INTERVAL ''90 days'';'
);
```

---

# Resumo de Tabelas

| Schema | Tabelas | Descrição |
|--------|---------|-----------|
| **SYSTEM** | 6 | users, users_roles, permissions, audit_logs, sync_logs, configs, notifications |
| **FIN** | 6 | clientes, contratos, receitas, despesas, rentabilidade, alertas, indices_economicos |
| **OPS** | 6 | recursos, alocacoes, timesheet, chamados, custos_cloud, licencas, servicos_monitorados |
| **GROWTH** | 6 | leads, oportunidades, atividades, propostas, proposta_itens, servicos_catalogo |
| **JUR** | 5 | contratos_jur, clausulas, documentos, prazos, processos |
| **GOV** | 6 | frameworks, controles, avaliacoes, avaliacao_controles, gaps, planos_acao, politicas |
| **PEOPLE** | 6 | colaboradores, historico_rh, ferias, avaliacoes_desempenho, treinamentos, inscricoes_treinamento, certificacoes |
| **AI** | 5 | conversations, messages, embeddings, agent_logs, tokens_usage |
| **TOTAL** | **46** | |

---

*Documento gerado em: Janeiro 2025*
*Versão: 1.0*
