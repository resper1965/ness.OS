# ness.OS — Plano de Desenvolvimento Completo

## Visão Geral

**Produto:** Sistema de gestão empresarial inteligente para consultoria de cybersecurity
**Empresa:** ness. (34 anos de experiência em segurança)
**Objetivo:** Centralizar operações, finanças, comercial, jurídico, governança e pessoas em uma plataforma unificada com IA

---

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    Next.js 14 + shadcn/ui                       │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐ │
│  │   FIN   │   OPS   │ GROWTH  │   JUR   │   GOV   │ PEOPLE  │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                    Supabase (PostgreSQL)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Edge Functions  │  Realtime  │  Auth  │  Storage  │ RLS │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              pgvector (RAG) + pg_cron (Jobs)             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       INTEGRAÇÕES                                │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐ │
│  │  Omie   │Clockify │  GLPI   │AWS/GCP  │ Wazuh   │ Claude  │ │
│  │  ERP    │Timesheet│  ITSM   │Billing  │  SIEM   │   AI    │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Módulos e Agentes IA

| Módulo | Descrição | Agente IA |
|--------|-----------|-----------|
| **FIN** | Gestão Financeira | `rex.fin` — Analista financeiro |
| **OPS** | Operações e Recursos | `rex.ops` — Gestor operacional |
| **GROWTH** | Comercial e Propostas | `rex.growth` — Consultor comercial |
| **JUR** | Jurídico e Contratos | `rex.jur` — Assistente jurídico |
| **GOV** | Governança e Compliance | `rex.gov` — Oficial de compliance |
| **PEOPLE** | RH e Desenvolvimento | `rex.people` — Gestor de pessoas |
| **KB** | Knowledge Base | `rex.kb` — Pesquisador |
| **MASTER** | Orquestrador | `rex.master` — Coordenador geral |

---

## Roadmap de Fases

| Fase | Duração | Foco | Entregáveis |
|------|---------|------|-------------|
| **0** | 1 semana | Setup | Infraestrutura, CI/CD, Auth |
| **1** | 4 semanas | FIN | Finanças completo + Omie |
| **2** | 4 semanas | OPS | Operações completo |
| **3** | 3 semanas | GROWTH | Comercial + Propostas |
| **4** | 3 semanas | JUR + GOV | Jurídico e Governança |
| **5** | 3 semanas | PEOPLE | RH e Desenvolvimento |
| **6** | 2 semanas | IA | Agentes rex.* |
| **7** | 2 semanas | Polish | Refinamentos, mobile, performance |

**Total estimado:** 22 semanas (~5.5 meses)

---

# FASE 0 — FUNDAÇÃO

## Epic 0.1: Infraestrutura Base
**Duração:** 3 dias
**Objetivo:** Setup completo do ambiente de desenvolvimento e produção

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 0.1.1 | Como dev, quero projeto Supabase configurado para ter backend funcional | 3 | P0 |
| 0.1.2 | Como dev, quero deploy Vercel configurado para CI/CD automático | 2 | P0 |
| 0.1.3 | Como dev, quero variáveis de ambiente configuradas para separar dev/prod | 1 | P0 |
| 0.1.4 | Como dev, quero domínio configurado (app.ness.com.br) | 2 | P1 |
| 0.1.5 | Como dev, quero monitoramento básico (Vercel Analytics) | 1 | P2 |

### Tasks
- [ ] Criar projeto Supabase (região São Paulo)
- [ ] Executar schema SQL inicial
- [ ] Configurar secrets (Omie, etc)
- [ ] Conectar repo GitHub ao Vercel
- [ ] Configurar preview deployments
- [ ] Setup domínio customizado
- [ ] Configurar SSL

### Critérios de Aceite
- Supabase rodando com schema FIN
- Deploy automático a cada push
- URL de produção acessível

---

## Epic 0.2: Autenticação e Autorização
**Duração:** 4 dias
**Objetivo:** Sistema completo de login e controle de acesso

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 0.2.1 | Como usuário, quero fazer login com email/senha | 3 | P0 |
| 0.2.2 | Como usuário, quero fazer login com Google (SSO) | 2 | P1 |
| 0.2.3 | Como admin, quero definir roles para usuários (Admin, CFO, COO, etc) | 3 | P0 |
| 0.2.4 | Como sistema, quero restringir acesso a módulos por role | 3 | P0 |
| 0.2.5 | Como usuário, quero recuperar minha senha | 2 | P1 |
| 0.2.6 | Como admin, quero convidar novos usuários | 2 | P1 |

### Tasks
- [ ] Configurar Supabase Auth
- [ ] Criar página de login
- [ ] Implementar middleware de proteção de rotas
- [ ] Criar tabela `users_roles` com RBAC
- [ ] Implementar RLS policies por role
- [ ] Criar página de gerenciamento de usuários
- [ ] Configurar OAuth Google
- [ ] Implementar fluxo de reset de senha
- [ ] Criar fluxo de convite por email

### Critérios de Aceite
- Login funcional com email/senha
- Rotas protegidas por autenticação
- Acesso a módulos controlado por role
- Admin pode gerenciar usuários

---

# FASE 1 — ness.FIN (Financeiro)

## Epic 1.1: Dashboard Financeiro
**Duração:** 5 dias
**Objetivo:** Visão consolidada de saúde financeira

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 1.1.1 | Como CFO, quero ver receita mensal/anual em tempo real | 3 | P0 |
| 1.1.2 | Como CFO, quero ver despesas por categoria | 3 | P0 |
| 1.1.3 | Como CFO, quero ver margem líquida e tendência | 3 | P0 |
| 1.1.4 | Como CFO, quero ver fluxo de caixa projetado (30/60/90 dias) | 5 | P1 |
| 1.1.5 | Como CFO, quero filtrar por período (mês, trimestre, ano) | 2 | P0 |
| 1.1.6 | Como CFO, quero exportar relatórios em PDF/Excel | 3 | P2 |

### Tasks
- [ ] Conectar frontend ao Supabase
- [ ] Criar hooks de dados financeiros
- [ ] Implementar gráficos com dados reais
- [ ] Criar filtros de período
- [ ] Implementar cálculos de projeção
- [ ] Criar gerador de PDF com jsPDF
- [ ] Implementar export Excel com SheetJS

### Critérios de Aceite
- Dashboard carrega dados do Supabase
- KPIs calculados corretamente
- Gráficos interativos funcionando
- Filtros aplicam corretamente

---

## Epic 1.2: Integração Omie ERP
**Duração:** 7 dias
**Objetivo:** Sincronização automática com ERP

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 1.2.1 | Como sistema, quero sincronizar clientes do Omie diariamente | 5 | P0 |
| 1.2.2 | Como sistema, quero sincronizar contratos do Omie | 5 | P0 |
| 1.2.3 | Como sistema, quero sincronizar contas a receber | 5 | P0 |
| 1.2.4 | Como sistema, quero sincronizar contas a pagar | 5 | P0 |
| 1.2.5 | Como sistema, quero receber webhooks de eventos do Omie | 5 | P1 |
| 1.2.6 | Como admin, quero ver log de sincronizações | 3 | P1 |
| 1.2.7 | Como admin, quero forçar sync manual | 2 | P1 |

### Tasks
- [ ] Deploy Edge Function sync-omie
- [ ] Configurar cron job (03:00 diário)
- [ ] Implementar sync incremental (15 min)
- [ ] Criar endpoint webhook Omie
- [ ] Implementar tratamento de erros
- [ ] Criar página de logs de sync
- [ ] Implementar botão de sync manual
- [ ] Criar alertas de falha de sync

### Critérios de Aceite
- Sync automático rodando diariamente
- Dados do Omie refletidos no sistema
- Webhooks processados em tempo real
- Logs de sync visíveis no admin

---

## Epic 1.3: Gestão de Contratos
**Duração:** 5 dias
**Objetivo:** Controle completo de contratos de serviço

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 1.3.1 | Como gestor, quero listar todos contratos com filtros | 3 | P0 |
| 1.3.2 | Como gestor, quero ver detalhes de um contrato | 3 | P0 |
| 1.3.3 | Como gestor, quero receber alertas de contratos vencendo | 5 | P0 |
| 1.3.4 | Como gestor, quero calcular reajuste automático (IGPM/IPCA) | 5 | P1 |
| 1.3.5 | Como gestor, quero ver histórico de alterações do contrato | 3 | P2 |
| 1.3.6 | Como gestor, quero anexar documentos ao contrato | 3 | P2 |

### Tasks
- [ ] Criar página de detalhes do contrato
- [ ] Implementar função de alertas de vencimento
- [ ] Integrar API IBGE/FGV para índices
- [ ] Criar calculadora de reajuste
- [ ] Implementar audit log de contratos
- [ ] Configurar Supabase Storage para anexos
- [ ] Criar upload de documentos

### Critérios de Aceite
- Lista de contratos com filtros funcionando
- Alertas gerados automaticamente
- Reajuste calculado corretamente
- Documentos anexados e acessíveis

---

## Epic 1.4: Análise de Rentabilidade
**Duração:** 7 dias
**Objetivo:** Calcular margem real por contrato/cliente

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 1.4.1 | Como CFO, quero ver rentabilidade por contrato | 5 | P0 |
| 1.4.2 | Como CFO, quero ver rentabilidade por cliente (consolidado) | 5 | P0 |
| 1.4.3 | Como CFO, quero ver breakdown de custos (RH, cloud, licenças) | 5 | P0 |
| 1.4.4 | Como CFO, quero alertas de contratos com margem baixa (<10%) | 3 | P0 |
| 1.4.5 | Como CFO, quero comparar rentabilidade entre períodos | 3 | P1 |
| 1.4.6 | Como CFO, quero simular cenários (what-if) | 5 | P2 |

### Tasks
- [ ] Criar view de rentabilidade consolidada
- [ ] Implementar cálculo de custos diretos (do OPS)
- [ ] Aplicar overhead e impostos configuráveis
- [ ] Criar função de alertas de margem baixa
- [ ] Implementar comparativo temporal
- [ ] Criar simulador de cenários

### Critérios de Aceite
- Rentabilidade calculada por contrato
- Custos alocados corretamente
- Alertas de margem baixa funcionando
- Comparativo mostrando evolução

---

## Epic 1.5: Central de Alertas FIN
**Duração:** 3 dias
**Objetivo:** Notificações proativas de eventos financeiros

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 1.5.1 | Como gestor, quero ver todos alertas em um lugar | 2 | P0 |
| 1.5.2 | Como gestor, quero filtrar alertas por tipo/severidade | 2 | P0 |
| 1.5.3 | Como gestor, quero marcar alertas como resolvidos | 2 | P0 |
| 1.5.4 | Como gestor, quero receber alertas por email | 3 | P1 |
| 1.5.5 | Como gestor, quero configurar thresholds de alertas | 3 | P2 |

### Tasks
- [ ] Criar job de geração de alertas
- [ ] Implementar tipos: vencimento, inadimplência, reajuste, rentabilidade
- [ ] Criar filtros na UI
- [ ] Implementar ação de resolver
- [ ] Configurar Supabase Email
- [ ] Criar página de configuração de alertas

### Critérios de Aceite
- Alertas gerados automaticamente
- UI mostra alertas por categoria
- Ação de resolver funciona
- Emails enviados para alertas críticos

---

# FASE 2 — ness.OPS (Operações)

## Epic 2.1: Dashboard Operacional
**Duração:** 4 dias
**Objetivo:** Visão geral de operações e recursos

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 2.1.1 | Como COO, quero ver utilização da equipe | 3 | P0 |
| 2.1.2 | Como COO, quero ver horas faturadas vs trabalhadas | 3 | P0 |
| 2.1.3 | Como COO, quero ver SLA de atendimento | 3 | P0 |
| 2.1.4 | Como COO, quero ver custos de infraestrutura | 3 | P0 |
| 2.1.5 | Como COO, quero ver status de serviços monitorados | 3 | P1 |

### Tasks
- [ ] Criar schema OPS no Supabase
- [ ] Implementar KPIs de utilização
- [ ] Criar gráficos de horas
- [ ] Implementar indicadores de SLA
- [ ] Criar painel de custos cloud
- [ ] Implementar status de serviços

### Critérios de Aceite
- Dashboard com dados reais
- Cálculos de utilização corretos
- Indicadores visuais de SLA
- Status de serviços atualizado

---

## Epic 2.2: Integração Timesheet
**Duração:** 5 dias
**Objetivo:** Importar horas de ferramentas externas

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 2.2.1 | Como sistema, quero importar horas do Clockify | 5 | P0 |
| 2.2.2 | Como sistema, quero importar horas do Toggl (alternativa) | 3 | P2 |
| 2.2.3 | Como gestor, quero ver horas por recurso/projeto/cliente | 3 | P0 |
| 2.2.4 | Como gestor, quero classificar horas como faturáveis/internas | 3 | P0 |
| 2.2.5 | Como gestor, quero aprovar timesheet semanal | 3 | P1 |

### Tasks
- [ ] Criar Edge Function sync-clockify
- [ ] Mapear projetos Clockify → contratos ness.OS
- [ ] Criar tabelas de timesheet
- [ ] Implementar classificação de horas
- [ ] Criar fluxo de aprovação
- [ ] Implementar relatórios por recurso

### Critérios de Aceite
- Horas importadas do Clockify
- Classificação de horas funciona
- Relatórios por recurso/projeto disponíveis
- Aprovação de timesheet funcional

---

## Epic 2.3: Gestão de Recursos
**Duração:** 4 dias
**Objetivo:** Controle de equipe e alocação

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 2.3.1 | Como gestor, quero cadastrar recursos da equipe | 3 | P0 |
| 2.3.2 | Como gestor, quero definir custo/hora por recurso | 2 | P0 |
| 2.3.3 | Como gestor, quero alocar recursos em projetos | 3 | P0 |
| 2.3.4 | Como gestor, quero ver recursos em bench | 3 | P0 |
| 2.3.5 | Como gestor, quero ver skills/certificações por recurso | 3 | P2 |

### Tasks
- [ ] Criar tabela de recursos
- [ ] Implementar CRUD de recursos
- [ ] Criar sistema de alocação
- [ ] Implementar cálculo de utilização
- [ ] Criar dashboard de bench
- [ ] Implementar matriz de skills

### Critérios de Aceite
- Recursos cadastrados com custo/hora
- Alocação em projetos funciona
- Identificação de recursos em bench
- Utilização calculada corretamente

---

## Epic 2.4: Integração GLPI (Chamados)
**Duração:** 5 dias
**Objetivo:** Centralizar chamados de suporte

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 2.4.1 | Como sistema, quero importar chamados do GLPI | 5 | P0 |
| 2.4.2 | Como gestor, quero ver chamados por cliente/prioridade | 3 | P0 |
| 2.4.3 | Como gestor, quero ver métricas de SLA | 3 | P0 |
| 2.4.4 | Como gestor, quero ver tempo médio de resolução | 3 | P1 |
| 2.4.5 | Como gestor, quero alertas de SLA em risco | 3 | P1 |

### Tasks
- [ ] Criar Edge Function sync-glpi
- [ ] Mapear entidades GLPI → ness.OS
- [ ] Criar tabelas de chamados
- [ ] Implementar cálculos de SLA
- [ ] Criar dashboard de chamados
- [ ] Implementar alertas de SLA

### Critérios de Aceite
- Chamados importados do GLPI
- SLA calculado corretamente
- Dashboard de chamados funcional
- Alertas de SLA gerados

---

## Epic 2.5: Custos de Infraestrutura
**Duração:** 5 days
**Objetivo:** Consolidar custos de cloud e licenças

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 2.5.1 | Como sistema, quero importar custos AWS via Cost Explorer | 5 | P1 |
| 2.5.2 | Como sistema, quero importar custos GCP via Billing API | 5 | P1 |
| 2.5.3 | Como sistema, quero importar custos Azure | 5 | P2 |
| 2.5.4 | Como gestor, quero ratear custos por cliente/projeto | 5 | P0 |
| 2.5.5 | Como gestor, quero ver tendência de custos | 3 | P1 |
| 2.5.6 | Como gestor, quero alertas de custos acima do budget | 3 | P1 |

### Tasks
- [ ] Criar Edge Functions para cada cloud
- [ ] Implementar mapeamento de tags → clientes
- [ ] Criar tabelas de custos
- [ ] Implementar rateio por cliente
- [ ] Criar gráficos de tendência
- [ ] Implementar alertas de budget

### Critérios de Aceite
- Custos importados de AWS/GCP
- Rateio por cliente funcional
- Tendência visualizada
- Alertas de budget funcionando

---

## Epic 2.6: Integração OPS → FIN
**Duração:** 3 dias
**Objetivo:** Alimentar custos reais para cálculo de rentabilidade

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 2.6.1 | Como sistema, quero calcular custo de horas por contrato | 5 | P0 |
| 2.6.2 | Como sistema, quero alocar custos de cloud por contrato | 5 | P0 |
| 2.6.3 | Como sistema, quero alocar custos de licenças por contrato | 3 | P0 |
| 2.6.4 | Como CFO, quero ver rentabilidade com custos reais (não estimados) | 3 | P0 |

### Tasks
- [ ] Criar função de consolidação de custos
- [ ] Implementar alocação de horas
- [ ] Implementar rateio de cloud
- [ ] Implementar rateio de licenças
- [ ] Atualizar view de rentabilidade
- [ ] Criar job de consolidação diária

### Critérios de Aceite
- Custos de RH calculados por contrato
- Custos de cloud rateados
- Rentabilidade com dados reais
- Consolidação automática rodando

---

# FASE 3 — ness.GROWTH (Comercial)

## Epic 3.1: Pipeline Comercial
**Duração:** 5 dias
**Objetivo:** Gestão de oportunidades e funil de vendas

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 3.1.1 | Como comercial, quero cadastrar oportunidades | 3 | P0 |
| 3.1.2 | Como comercial, quero ver pipeline em kanban | 3 | P0 |
| 3.1.3 | Como comercial, quero registrar atividades/interações | 3 | P0 |
| 3.1.4 | Como gestor, quero ver forecast de receita | 5 | P1 |
| 3.1.5 | Como gestor, quero ver taxa de conversão por etapa | 3 | P1 |

### Tasks
- [ ] Criar schema GROWTH
- [ ] Implementar CRUD de oportunidades
- [ ] Criar componente Kanban
- [ ] Implementar registro de atividades
- [ ] Criar cálculo de forecast
- [ ] Implementar métricas de conversão

### Critérios de Aceite
- Pipeline em kanban funcional
- Oportunidades movem entre etapas
- Forecast calculado por probabilidade
- Métricas de conversão disponíveis

---

## Epic 3.2: Gerador de Propostas
**Duração:** 7 dias
**Objetivo:** Automatizar criação de propostas comerciais

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 3.2.1 | Como comercial, quero criar proposta a partir de template | 5 | P0 |
| 3.2.2 | Como comercial, quero precificar serviços com base em esforço | 5 | P0 |
| 3.2.3 | Como comercial, quero gerar PDF da proposta | 3 | P0 |
| 3.2.4 | Como comercial, quero versionar propostas | 3 | P1 |
| 3.2.5 | Como sistema, quero usar IA para sugerir escopo | 8 | P2 |

### Tasks
- [ ] Criar catálogo de serviços
- [ ] Implementar calculadora de precificação
- [ ] Criar templates de proposta
- [ ] Implementar gerador de PDF
- [ ] Criar sistema de versionamento
- [ ] Integrar Claude para sugestões

### Critérios de Aceite
- Proposta criada a partir de template
- Precificação calcula automaticamente
- PDF gerado com formatação correta
- Histórico de versões disponível

---

## Epic 3.3: Integração CRM
**Duração:** 4 dias
**Objetivo:** Sincronizar com Omie CRM ou LinkedIn

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 3.3.1 | Como sistema, quero importar leads do Omie CRM | 5 | P1 |
| 3.3.2 | Como comercial, quero importar contatos do LinkedIn | 5 | P2 |
| 3.3.3 | Como comercial, quero ver histórico de interações | 3 | P1 |
| 3.3.4 | Como gestor, quero ver origem dos leads | 3 | P1 |

### Tasks
- [ ] Criar Edge Function sync-omie-crm
- [ ] Implementar importação LinkedIn (manual/CSV)
- [ ] Criar tabela de interações
- [ ] Implementar tracking de origem
- [ ] Criar relatórios de origem

### Critérios de Aceite
- Leads importados do Omie
- Importação LinkedIn funcional
- Histórico de interações visível
- Relatório de origem disponível

---

# FASE 4 — ness.JUR + ness.GOV

## Epic 4.1: Gestão de Contratos Jurídicos
**Duração:** 5 days
**Objetivo:** Controle de documentos e prazos legais

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 4.1.1 | Como jurídico, quero cadastrar contratos com metadados | 3 | P0 |
| 4.1.2 | Como jurídico, quero upload de documentos (PDF) | 3 | P0 |
| 4.1.3 | Como jurídico, quero alertas de prazos (renovação, término) | 3 | P0 |
| 4.1.4 | Como jurídico, quero extrair cláusulas com IA | 8 | P2 |
| 4.1.5 | Como jurídico, quero buscar em todos contratos | 5 | P1 |

### Tasks
- [ ] Criar schema JUR
- [ ] Implementar upload para Supabase Storage
- [ ] Criar sistema de alertas de prazos
- [ ] Integrar Claude para extração de cláusulas
- [ ] Implementar busca full-text
- [ ] Criar embeddings para busca semântica

### Critérios de Aceite
- Contratos cadastrados com anexos
- Alertas de prazos funcionando
- Busca retorna resultados relevantes
- Extração de cláusulas funcional

---

## Epic 4.2: Compliance e Políticas
**Duração:** 5 dias
**Objetivo:** Gestão de conformidade e políticas internas

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 4.2.1 | Como compliance, quero cadastrar frameworks (ISO, NIST, CIS) | 3 | P0 |
| 4.2.2 | Como compliance, quero mapear controles por framework | 5 | P0 |
| 4.2.3 | Como compliance, quero avaliar maturidade por controle | 5 | P0 |
| 4.2.4 | Como compliance, quero gerar relatório de gaps | 5 | P1 |
| 4.2.5 | Como compliance, quero criar plano de ação para gaps | 3 | P1 |

### Tasks
- [ ] Criar schema GOV
- [ ] Importar controles de frameworks
- [ ] Implementar avaliação de maturidade
- [ ] Criar gerador de relatório de gaps
- [ ] Implementar plano de ação
- [ ] Criar dashboard de compliance

### Critérios de Aceite
- Frameworks cadastrados com controles
- Avaliação de maturidade funcional
- Relatório de gaps gerado
- Plano de ação rastreável

---

## Epic 4.3: Gestão de Documentos
**Duração:** 4 dias
**Objetivo:** Repositório central de políticas e procedimentos

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 4.3.1 | Como gestor, quero upload de políticas/procedimentos | 3 | P0 |
| 4.3.2 | Como gestor, quero controlar versões de documentos | 3 | P0 |
| 4.3.3 | Como gestor, quero fluxo de aprovação de documentos | 5 | P1 |
| 4.3.4 | Como colaborador, quero buscar documentos | 3 | P0 |
| 4.3.5 | Como gestor, quero rastrear leitura obrigatória | 5 | P2 |

### Tasks
- [ ] Criar estrutura de pastas no Storage
- [ ] Implementar versionamento de documentos
- [ ] Criar fluxo de aprovação
- [ ] Implementar busca full-text
- [ ] Criar sistema de leitura obrigatória
- [ ] Implementar notificações

### Critérios de Aceite
- Documentos organizados por categoria
- Versionamento funcional
- Aprovação com workflow
- Busca retorna documentos

---

# FASE 5 — ness.PEOPLE

## Epic 5.1: Cadastro de Colaboradores
**Duração:** 4 dias
**Objetivo:** Base de dados de RH

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 5.1.1 | Como RH, quero cadastrar colaboradores | 3 | P0 |
| 5.1.2 | Como RH, quero registrar histórico (cargo, salário) | 3 | P0 |
| 5.1.3 | Como RH, quero controlar férias e licenças | 3 | P0 |
| 5.1.4 | Como RH, quero gerar relatórios de headcount | 3 | P1 |
| 5.1.5 | Como colaborador, quero ver meu perfil e histórico | 2 | P1 |

### Tasks
- [ ] Criar schema PEOPLE
- [ ] Implementar CRUD de colaboradores
- [ ] Criar histórico de movimentações
- [ ] Implementar controle de férias
- [ ] Criar dashboard de headcount
- [ ] Implementar perfil do colaborador

### Critérios de Aceite
- Colaboradores cadastrados
- Histórico registrado
- Controle de férias funcional
- Relatórios disponíveis

---

## Epic 5.2: Avaliação de Desempenho
**Duração:** 5 dias
**Objetivo:** Ciclos de avaliação e feedback

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 5.2.1 | Como gestor, quero criar ciclo de avaliação | 3 | P0 |
| 5.2.2 | Como gestor, quero definir metas por colaborador | 3 | P0 |
| 5.2.3 | Como colaborador, quero fazer autoavaliação | 3 | P0 |
| 5.2.4 | Como gestor, quero avaliar equipe | 3 | P0 |
| 5.2.5 | Como RH, quero ver resultado consolidado (9-box) | 5 | P1 |

### Tasks
- [ ] Criar estrutura de ciclos
- [ ] Implementar cadastro de metas
- [ ] Criar formulário de avaliação
- [ ] Implementar cálculo de scores
- [ ] Criar visualização 9-box
- [ ] Implementar histórico de avaliações

### Critérios de Aceite
- Ciclo de avaliação criado
- Metas definidas por colaborador
- Avaliações preenchidas
- 9-box visualizado

---

## Epic 5.3: Desenvolvimento e Treinamentos
**Duração:** 4 dias
**Objetivo:** Gestão de capacitação

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 5.3.1 | Como RH, quero cadastrar treinamentos disponíveis | 3 | P0 |
| 5.3.2 | Como colaborador, quero me inscrever em treinamentos | 2 | P0 |
| 5.3.3 | Como gestor, quero ver certificações da equipe | 3 | P0 |
| 5.3.4 | Como RH, quero alertas de certificações vencendo | 3 | P1 |
| 5.3.5 | Como RH, quero gerar plano de desenvolvimento (PDI) | 5 | P2 |

### Tasks
- [ ] Criar catálogo de treinamentos
- [ ] Implementar inscrições
- [ ] Criar matriz de certificações
- [ ] Implementar alertas de vencimento
- [ ] Criar gerador de PDI

### Critérios de Aceite
- Treinamentos cadastrados
- Inscrições funcionando
- Matriz de certificações visível
- Alertas de vencimento gerando

---

# FASE 6 — Agentes IA (rex.*)

## Epic 6.1: Infraestrutura de IA
**Duração:** 5 dias
**Objetivo:** Base para agentes inteligentes

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 6.1.1 | Como sistema, quero integração com Claude API | 5 | P0 |
| 6.1.2 | Como sistema, quero RAG com pgvector | 8 | P0 |
| 6.1.3 | Como sistema, quero embeddings de documentos | 5 | P0 |
| 6.1.4 | Como sistema, quero histórico de conversas | 3 | P0 |
| 6.1.5 | Como admin, quero monitorar uso de tokens | 3 | P1 |

### Tasks
- [ ] Configurar Claude API
- [ ] Habilitar pgvector no Supabase
- [ ] Criar pipeline de embeddings
- [ ] Implementar busca semântica
- [ ] Criar tabela de conversas
- [ ] Implementar tracking de tokens

### Critérios de Aceite
- Claude API integrado
- Embeddings gerados para documentos
- Busca semântica funcional
- Uso de tokens rastreado

---

## Epic 6.2: Agente rex.fin
**Duração:** 3 dias
**Objetivo:** Assistente financeiro inteligente

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 6.2.1 | Como CFO, quero perguntar sobre finanças em linguagem natural | 5 | P0 |
| 6.2.2 | Como CFO, quero análises automáticas de anomalias | 5 | P1 |
| 6.2.3 | Como CFO, quero previsões de fluxo de caixa | 5 | P2 |

### Tasks
- [ ] Criar prompt de sistema para rex.fin
- [ ] Implementar tools (consulta SQL, cálculos)
- [ ] Criar interface de chat
- [ ] Implementar detecção de anomalias
- [ ] Criar modelo de previsão

### Critérios de Aceite
- Chat responde perguntas financeiras
- Análises proativas geradas
- Previsões com acurácia razoável

---

## Epic 6.3: Agente rex.ops
**Duração:** 3 dias
**Objetivo:** Assistente operacional inteligente

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 6.3.1 | Como COO, quero perguntar sobre operações | 5 | P0 |
| 6.3.2 | Como COO, quero sugestões de alocação de recursos | 5 | P1 |
| 6.3.3 | Como COO, quero alertas proativos de problemas | 5 | P1 |

### Tasks
- [ ] Criar prompt de sistema para rex.ops
- [ ] Implementar tools operacionais
- [ ] Criar algoritmo de alocação
- [ ] Implementar detecção de problemas

### Critérios de Aceite
- Chat responde perguntas operacionais
- Sugestões de alocação úteis
- Alertas proativos gerados

---

## Epic 6.4: Agente rex.growth
**Duração:** 3 dias
**Objetivo:** Assistente comercial inteligente

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 6.4.1 | Como comercial, quero ajuda para criar propostas | 5 | P0 |
| 6.4.2 | Como comercial, quero sugestões de precificação | 5 | P1 |
| 6.4.3 | Como comercial, quero análise de concorrência | 5 | P2 |

### Tasks
- [ ] Criar prompt de sistema para rex.growth
- [ ] Implementar gerador de propostas com IA
- [ ] Criar modelo de precificação
- [ ] Integrar web search para concorrência

### Critérios de Aceite
- IA ajuda a criar propostas
- Precificação sugerida com justificativa
- Análise de concorrência disponível

---

## Epic 6.5: Agente rex.master
**Duração:** 3 dias
**Objetivo:** Orquestrador que coordena outros agentes

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 6.5.1 | Como usuário, quero fazer perguntas que cruzam módulos | 5 | P0 |
| 6.5.2 | Como usuário, quero briefing diário personalizado | 5 | P1 |
| 6.5.3 | Como usuário, quero recomendações de ações prioritárias | 5 | P1 |

### Tasks
- [ ] Criar prompt de sistema para rex.master
- [ ] Implementar roteamento para sub-agentes
- [ ] Criar gerador de briefing diário
- [ ] Implementar priorizador de ações

### Critérios de Aceite
- Perguntas cross-módulo respondidas
- Briefing diário gerado
- Ações priorizadas corretamente

---

# FASE 7 — Polish e Refinamentos

## Epic 7.1: Mobile Responsivo
**Duração:** 4 days
**Objetivo:** Experiência otimizada para mobile

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 7.1.1 | Como usuário mobile, quero navegar facilmente | 3 | P0 |
| 7.1.2 | Como usuário mobile, quero ver dashboards adaptados | 3 | P0 |
| 7.1.3 | Como usuário mobile, quero receber notificações push | 5 | P2 |

### Tasks
- [ ] Auditar responsividade
- [ ] Adaptar componentes para mobile
- [ ] Otimizar gráficos para telas menores
- [ ] Implementar PWA
- [ ] Configurar push notifications

### Critérios de Aceite
- App funciona bem em mobile
- Dashboards legíveis em telas pequenas
- PWA instalável

---

## Epic 7.2: Performance e Otimização
**Duração:** 3 days
**Objetivo:** App rápido e eficiente

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 7.2.1 | Como usuário, quero páginas carregando em <2s | 3 | P0 |
| 7.2.2 | Como usuário, quero navegação sem travamentos | 3 | P0 |
| 7.2.3 | Como dev, quero cache otimizado | 3 | P1 |

### Tasks
- [ ] Implementar React Query para cache
- [ ] Otimizar queries SQL
- [ ] Implementar lazy loading
- [ ] Configurar ISR/SSG onde possível
- [ ] Auditar com Lighthouse

### Critérios de Aceite
- Lighthouse score >90
- Tempo de carregamento <2s
- Navegação fluida

---

## Epic 7.3: Testes e Qualidade
**Duração:** 4 days
**Objetivo:** Cobertura de testes e CI/CD

### User Stories

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| 7.3.1 | Como dev, quero testes unitários nos cálculos críticos | 5 | P0 |
| 7.3.2 | Como dev, quero testes e2e nos fluxos principais | 5 | P1 |
| 7.3.3 | Como dev, quero CI rodando testes antes do deploy | 3 | P0 |

### Tasks
- [ ] Configurar Jest para testes unitários
- [ ] Escrever testes para cálculos financeiros
- [ ] Configurar Playwright para e2e
- [ ] Escrever testes e2e críticos
- [ ] Configurar GitHub Actions

### Critérios de Aceite
- Cálculos financeiros testados
- Fluxos críticos com e2e
- CI bloqueia PRs com falhas

---

# Resumo de Estimativas

## Por Fase

| Fase | Épicos | Stories | Pontos | Duração |
|------|--------|---------|--------|---------|
| 0 - Fundação | 2 | 11 | 26 | 1 semana |
| 1 - FIN | 5 | 29 | 95 | 4 semanas |
| 2 - OPS | 6 | 30 | 102 | 4 semanas |
| 3 - GROWTH | 3 | 14 | 56 | 3 semanas |
| 4 - JUR/GOV | 3 | 15 | 58 | 3 semanas |
| 5 - PEOPLE | 3 | 15 | 50 | 3 semanas |
| 6 - IA | 5 | 15 | 68 | 2 semanas |
| 7 - Polish | 3 | 9 | 35 | 2 semanas |
| **TOTAL** | **30** | **138** | **490** | **22 semanas** |

## Por Prioridade

| Prioridade | Stories | Pontos | % do Total |
|------------|---------|--------|------------|
| P0 (Must Have) | 72 | 252 | 51% |
| P1 (Should Have) | 45 | 158 | 32% |
| P2 (Nice to Have) | 21 | 80 | 17% |

---

# Dependências e Riscos

## Dependências Externas

| Dependência | Impacto | Mitigação |
|-------------|---------|-----------|
| API Omie | Crítico para FIN | Ter dados mock para desenvolvimento |
| API Clockify | Importante para OPS | Suportar import manual CSV |
| API GLPI | Importante para OPS | Suportar import manual |
| APIs Cloud (AWS/GCP) | Médio | Implementar após core |
| Claude API | Importante para IA | Funcionalidades core funcionam sem IA |

## Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Mudanças na API Omie | Média | Alto | Criar camada de abstração |
| Complexidade de cálculos FIN | Média | Alto | Validar fórmulas com CFO |
| Performance com muito dado | Baixa | Médio | Implementar paginação e cache |
| Custo Claude API | Média | Baixo | Monitorar e limitar uso |
| Adoção pelos usuários | Média | Alto | Envolver usuários desde o início |

---

# Métricas de Sucesso

## KPIs do Projeto

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Tempo de resposta | <2s | Vercel Analytics |
| Uptime | 99.5% | Supabase + Vercel |
| Adoção | 80% equipe usando | Login analytics |
| Satisfação | NPS >40 | Survey trimestral |
| Bugs críticos | <2/mês | Issue tracker |

## KPIs de Negócio

| Métrica | Meta | Baseline |
|---------|------|----------|
| Tempo para gerar proposta | -50% | Medir atual |
| Tempo para calcular rentabilidade | -80% | Manual → automático |
| Alertas de vencimento perdidos | 0 | Quantificar atual |
| Decisões baseadas em dados | +100% | Qualitativo |

---

# Próximos Passos Imediatos

1. **Hoje:** Revogar token GitHub
2. **Hoje:** Criar projeto Supabase
3. **Semana 1:** Setup completo (Epic 0.1 + 0.2)
4. **Semana 2-5:** ness.FIN completo
5. **Semana 6-9:** ness.OPS completo

---

*Documento gerado em: Janeiro 2025*
*Versão: 1.0*
*Autor: Claude + Esper*
