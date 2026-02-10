# Correlação de dados — ness.OS

Análise do esquema de dados, relações entre entidades e fluxos entre módulos. Objetivo: verificar se as correlações fazem sentido e identificar lacunas ou inconsistências.

---

## 1. Mapa de entidades e relações (FK)

### 1.1 Núcleo (Auth + Pessoas)

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **auth.users** | — | profiles |
| **profiles** | auth.users | public_posts (author_id), playbooks (created_by), time_entries (user_id), training_gaps (employee_id), job_applications (implícito via candidato) |

**Sentido:** Usuários do sistema; perfis com role (admin, sales, ops, fin, employee, legal). Autoria de posts e playbooks; tempo lançado por user; gaps por colaborador.

---

### 1.2 ness.FIN — Clientes e contratos

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **clients** | — | contracts, erp_sync (match por omie_codigo/document) |
| **contracts** | clients | performance_metrics, time_entries, indicators, upsell_alerts, public_jobs (contract_id opcional) |

**Sentido:** Cliente é a base; contrato pertence a um cliente (MRR, vigência, renewal_date, adjustment_index). **clients.omie_codigo** correlaciona com Omie para sync e reconciliação MRR × faturamento Omie.

**Correlação Omie:**  
- **clients**: sync Omie preenche/atualiza por `omie_codigo` ou `document`.  
- **erp_revenue_snapshot**: faturamento por `omie_codigo` (não é FK; é chave de negócio).  
- **getReconciliationAlerts (fin.ts):** compara MRR (contracts por client_id) com faturamento Omie (por clients.omie_codigo). **Faz sentido:** mesmo cliente no ness.OS e no Omie via omie_codigo.

---

### 1.3 ness.OPS — Playbooks, tempo, métricas

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **playbooks** | profiles (created_by) | services_playbooks, time_entries (playbook_id), tasks |
| **tasks** | playbooks | — (time_entries.task_id ainda não existe; opcional no plano) |
| **time_entries** | profiles (user_id), contracts (contract_id), playbooks (playbook_id) | v_time_entries_by_contract_month, sync_performance_metrics_from_time_entries |
| **performance_metrics** | contracts | contract_rentability (view) |

**Sentido:**  
- **Timer:** usuário lança tempo por **contrato** e opcionalmente **playbook**. Contrato pertence a cliente → horas ficam atreladas a cliente/contrato. **Faz sentido.**  
- **performance_metrics:** por contrato e mês (hours_worked, hourly_rate, cost_input). View **contract_rentability** junta contracts + clients + performance_metrics (receita − custo). **Faz sentido.**  
- **sync_performance_metrics_from_timer:** agrega time_entries por contract_id + mês e preenche performance_metrics.hours_worked. **Correlação correta:** tempo → contrato → métrica mensal.

**Tasks:** Task → Playbook; Service → N Playbooks (services_playbooks). Não há FK de **time_entries** para **tasks** (opcional no plano de composição). Hoje o tempo é só por playbook, não por task.

---

### 1.4 Catálogo e oferta (ness.GROWTH)

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **services_catalog** | — | services_playbooks |
| **services_playbooks** | services_catalog, playbooks | services_primary_playbook (view), GROWTH (formulário serviços) |

**Sentido:** Serviço = produto vendável; N playbooks por serviço (N:N). Trava de catálogo: vender só o que está documentado (playbooks). **Faz sentido.**

**inbound_leads:** sem FK para client ou contract. São leads do site (nome, email, company, status, origin_url). Correlação com cliente/contrato é feita no funil comercial (status won → virar cliente/contrato manualmente ou por processo). **Faz sentido** que lead não aponte para contract até virar negócio.

---

### 1.5 Conteúdo e marketing (ness.WEB / ness.GROWTH)

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **public_posts** | profiles (author_id) | RAG (document_embeddings), site blog |
| **success_cases** | — | RAG, site casos, GROWTH (lista/edição) |

**Sentido:** Posts = blog (autor = profile). Casos de sucesso = conteúdo de marketing; **não têm FK para client/contract**. Isso é intencional: caso pode ser anonimizado ou genérico. Se no futuro quiser “caso do cliente X”, pode-se adicionar client_id opcional em success_cases.

---

### 1.6 ness.PEOPLE

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **public_jobs** | contracts (contract_id opcional) | job_applications |
| **job_applications** | public_jobs | — |
| **training_gaps** | profiles (employee_id) | — |

**Sentido:** Vaga pode estar vinculada a um contrato (ex.: vaga para atender o cliente X). **public_jobs.contract_id** faz essa correlação. **Faz sentido.**

---

### 1.7 ness.DATA — Snapshots, eventos, índices

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **erp_revenue_snapshot** | — (omie_codigo como dado) | getOmieRevenueFromSnapshot, reconciliação |
| **bcb_rates_snapshot** | — | getDollarRate, getIpcaRate, getIgpmRate |
| **indicators** | contracts (contract_id opcional) | getIndicators, OPS dashboard |
| **module_events** | — (module, event_type, entity_id) | event_aggregates, auditoria |
| **event_aggregates** | — (período, módulo, tipo) | getEventAggregates, ness.DATA |
| **data_indices** | — (período, índices derivados) | getDataIndices, ness.DATA |

**Sentido:**  
- **erp_revenue_snapshot:** período + omie_codigo + valor; correlação com **clients** é por omie_codigo (não FK). **Faz sentido.**  
- **indicators:** podem ser por contrato (contract_id opcional); OPS/FIN usam para métricas por cliente/contrato. **Faz sentido.**  
- **module_events / event_aggregates / data_indices:** correlação é por módulo e período (auditoria e massa). **Faz sentido.**

---

### 1.8 ness.JUR / ness.GOV

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **legal_docs** | — | contract_risk_analysis |
| **contract_risk_analysis** | legal_docs | — |
| **compliance_frameworks** | — | compliance_checks |
| **compliance_checks** | compliance_frameworks | — |

**Sentido:** JUR analisa **documentos jurídicos** (legal_docs), não a tabela contracts diretamente. contract_risk_analysis aponta para legal_doc_id (cláusula, severidade, sugestão). **Gap possível:** se um legal_doc for o contrato do cliente X, hoje não há FK de legal_docs → contracts; a ligação seria por processo (ex.: mesmo nome/título). Para correlacionar “risco do contrato Y”, seria útil **legal_docs.contract_id** opcional ou **contract_risk_analysis.contract_id** opcional.

**GOV:** políticas e aceites; sem FK para clients/contracts. **Faz sentido** (governança geral).

---

### 1.9 Outros

| Tabela | Referências (FK) | Referenciada por |
|--------|------------------|------------------|
| **upsell_alerts** | contracts | GROWTH (alertas de upsell por contrato) |

**Sentido:** Alerta de upsell ligado a um contrato. **Faz sentido.**

---

## 2. Fluxos de dados entre módulos

| Fluxo | Origem | Destino | Correlação |
|-------|--------|---------|------------|
| **OPS → FIN** | time_entries (contract_id, duration) | performance_metrics (hours_worked por contract + mês) | sync_performance_metrics_from_timer agrega time_entries → performance_metrics. contract_rentability usa contracts + clients + performance_metrics. **Faz sentido.** |
| **DATA → FIN** | erp_revenue_snapshot (omie_codigo), clients (omie_codigo) | Reconciliação MRR × Omie | getReconciliationAlerts compara MRR (contracts por client) com faturamento Omie (por clients.omie_codigo). **Faz sentido.** |
| **DATA → GROWTH** | clients, contracts, inbound_leads, erp_revenue_snapshot | Dashboard comercial | getGrowthDashboardData: totais de clientes, deals, receita, leads por status/origem, faturamento Omie do mês. **Faz sentido.** |
| **OPS → GROWTH** | playbooks, services_playbooks | Catálogo e propostas | Serviço = N playbooks; proposta pode referenciar serviço. IA (generateProposalWithAI) usa services + playbooks. **Faz sentido.** |
| **FIN → PEOPLE** | contracts | public_jobs (contract_id) | Vaga pode ser vinculada a contrato/cliente. **Faz sentido.** |
| **OPS → PEOPLE** | playbooks | training_gaps (via processo; não há FK direto) | Plano de treinamento pode referenciar playbooks; hoje é conceitual. |
| **Timer (OPS)** | contracts, playbooks | time_entries | Usuário escolhe contrato (do cliente) e opcionalmente playbook. **Faz sentido.** |

---

## 3. Views e agregações

| View / função | Correlação | Faz sentido? |
|---------------|------------|--------------|
| **contract_rentability** | contracts ⟷ clients, contracts ⟷ performance_metrics | Sim: receita e custo por contrato. |
| **v_time_entries_by_contract_month** | time_entries ⟷ contracts ⟷ clients | Sim: horas por contrato e mês; RLS de time_entries se aplica. |
| **services_primary_playbook** | services_playbooks (primeiro playbook por serviço) | Sim: compatibilidade com código que espera “um” playbook por serviço. |
| **sync_performance_metrics_from_time_entries()** | time_entries → performance_metrics por contract_id + mês | Sim: fonte única de horas é o timer. |

---

## 4. Lacunas e recomendações

### 4.1 Correlações que fazem sentido (resumo)

- **Cliente → Contrato → performance_metrics / time_entries:** núcleo FIN/OPS coerente.
- **Serviço → N playbooks (services_playbooks); Playbook → N tasks:** composição oferta e execução.
- **clients.omie_codigo** como ponte para Omie (sync, erp_revenue_snapshot, reconciliação).
- **Timer:** user + contract + playbook; agregação em performance_metrics por contrato/mês.
- **Vagas (public_jobs.contract_id):** vaga atrelada a contrato/cliente.
- **indicators.contract_id** opcional: métricas por contrato.
- **upsell_alerts.contract_id:** alerta por contrato.

### 4.2 Lacunas ou melhorias

| Item | Descrição | Recomendação |
|------|-----------|--------------|
| **time_entries.task_id** | Plano de composição prevê opcional task_id; hoje só playbook_id. | Implementar quando quiser lançar tempo por task (granularidade maior). |
| **success_cases × client/contract** | Casos de sucesso sem FK para client/contract. | Opcional: adicionar client_id ou contract_id em success_cases para “caso do cliente X” e relatórios. |
| **legal_docs / contract_risk_analysis × contracts** | JUR analisa legal_docs; não há vínculo formal com contracts. | Opcional: legal_docs.contract_id ou contract_risk_analysis.contract_id para “risco do contrato Y”. |
| **inbound_leads × client** | Lead não vira client automaticamente; não há FK. | Mantido por processo (won → criar client/contract). Opcional: lead_id em clients ou contract para rastreio. |

### 4.3 Consistência de nomes e tipos

- **profiles.role:** enum user_role (admin, sales, ops, fin, employee, legal). Usado em RLS e ações. Coerente.
- **contracts:** client_id, mrr, start_date, end_date, renewal_date, adjustment_index. FIN e DATA usam de forma alinhada.
- **Contratos ativos:** definidos por start_date/end_date e “hoje” em getContractsByClient e getClientsForTimer. **Faz sentido.**

---

## 5. Conclusão

As correlações principais **fazem sentido**:

1. **FIN:** clients ↔ contracts ↔ performance_metrics; Omie via omie_codigo e erp_revenue_snapshot.
2. **OPS:** playbooks ↔ tasks; time_entries por user/contract/playbook; agregação em performance_metrics.
3. **GROWTH:** services_catalog ↔ services_playbooks ↔ playbooks; leads independentes; dashboard usa clients, contracts, leads, faturamento Omie.
4. **DATA:** snapshots e índices por período/omie_codigo; indicators opcionalmente por contract; eventos por módulo.
5. **PEOPLE:** vagas com contract_id opcional; candidaturas e gaps por job/employee.

Lacunas são **opcionais** (task_id em time_entries, success_cases/legal_docs ligados a client/contract, rastreio lead→client) e não quebram a consistência atual. O desenho está coerente com a ideia de “Sistema Nervoso”: dados operacionais (timer, contratos, clientes, oferta) correlacionados e consumidos por FIN, OPS, GROWTH, PEOPLE, JUR e GOV de forma consistente.
