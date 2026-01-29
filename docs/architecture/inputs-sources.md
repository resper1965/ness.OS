# Inputs e Fontes de Dados

> Mapeamento de todos os dados necessários para alimentar o ecossistema ness.OS

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FONTES DE DADOS                                  │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────────┤
│   Financeiro │  Operacional │    Pessoas   │    Legal     │    Comercial    │
│   Omie ERP   │  Ferramentas │   RH/Ponto   │  Contratos   │   CRM/Propostas │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┴────────┬────────┘
       │              │              │              │                │
       ▼              ▼              ▼              ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ness.OS                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. ness.FIN — Inputs Financeiros

| Input | Fonte Primária | Fonte Alternativa | Frequência |
|-------|----------------|-------------------|------------|
| Receitas por cliente | Omie (Contas a Receber) | Planilha Excel | Diária |
| Despesas por categoria | Omie (Contas a Pagar) | Planilha Excel | Diária |
| Fluxo de caixa | Omie (Extrato) | OFX bancário | Diária |
| Contratos vigentes | Omie (Contratos) | Pasta Google Drive | Semanal |
| Notas fiscais emitidas | Omie (NFS-e) | XML do contador | Diária |
| Índices econômicos (IGPM/IPCA) | API IBGE/FGV | Inserção manual | Mensal |
| Tabela de impostos | Configuração interna | Contador | Anual |
| Custos de folha | Omie ou DP | Planilha RH | Mensal |

---

## 2. ness.OPS — Inputs Operacionais

| Input | Fonte Primária | Fonte Alternativa | Frequência |
|-------|----------------|-------------------|------------|
| **Horas trabalhadas** | | | |
| Timesheet por contrato | Clockify / Toggl | Planilha Excel | Diária |
| Horas por técnico | Sistema de ponto | Planilha | Semanal |
| **Consumo de recursos** | | | |
| Licenças de software | Inventário GLPI | Planilha | Mensal |
| Consumo AWS | AWS Cost Explorer API | CSV exportado | Diária |
| Consumo Azure | Azure Cost Management API | CSV exportado | Diária |
| Consumo GCP | GCP Billing API | CSV exportado | Diária |
| **Operação** | | | |
| Chamados/incidentes | GLPI / Freshdesk / Zendesk | Planilha | Tempo real |
| Alertas de monitoramento | Zabbix / Wazuh | API ou webhook | Tempo real |
| Logs de auditoria | SIEM (Wazuh) | Arquivos de log | Tempo real |
| **Processos** | | | |
| Manuais de procedimento | Confluence / Notion | Google Docs | Manual |
| Evidências de execução | ITSM | Pasta compartilhada | Por execução |
| Relatórios de backup | Ferramenta de backup | E-mail automático | Diária |

---

## 3. ness.GROWTH — Inputs Comerciais

| Input | Fonte Primária | Fonte Alternativa | Frequência |
|-------|----------------|-------------------|------------|
| **Vendas** | | | |
| Oportunidades | Omie CRM / Pipedrive / HubSpot | Planilha | Tempo real |
| Propostas enviadas | Pasta Google Drive | E-mail | Por evento |
| Histórico de contratos ganhos | Omie | Planilha | Mensal |
| **Marketing** | | | |
| Métricas de redes sociais | LinkedIn API / Meta API | Planilha manual | Semanal |
| Engajamento de posts | LinkedIn Analytics | Export manual | Semanal |
| Visitas ao site | Google Analytics | — | Diária |
| **Precificação** | | | |
| Custos por contrato | ness.OPS + ness.FIN | — | Sob demanda |
| Tabela de SLA e riscos | Configuração interna | Planilha | Manual |
| Margem desejada | Configuração interna | — | Manual |

---

## 4. ness.JUR — Inputs Jurídicos

| Input | Fonte Primária | Fonte Alternativa | Frequência |
|-------|----------------|-------------------|------------|
| Contratos para análise | Upload manual | E-mail | Por evento |
| Contratos vigentes | Omie / Google Drive | — | Semanal |
| Legislação atualizada | Sites oficiais (Planalto) | Jurídico externo | Manual |
| Jurisprudência | JusBrasil / Tribunais | — | Manual |
| Templates de cláusulas | Repositório interno | — | Manual |

---

## 5. ness.GOV — Inputs de Governança

| Input | Fonte Primária | Fonte Alternativa | Frequência |
|-------|----------------|-------------------|------------|
| Políticas internas | Google Drive / SharePoint | — | Por atualização |
| Lista de colaboradores | RH / AD | Planilha | Por admissão |
| Status de aceites | Sistema próprio | Planilha | Tempo real |
| Documentos de onboarding | RH | Google Forms | Por admissão |
| NDAs assinados | DocuSign / ClickSign | PDF manual | Por evento |

---

## 6. ness.PEOPLE — Inputs de Pessoas

| Input | Fonte Primária | Fonte Alternativa | Frequência |
|-------|----------------|-------------------|------------|
| **Avaliações** | | | |
| Avaliação 360º | Qulture.Rocks / Feedz | Google Forms | Semestral |
| Feedback de gestores | Sistema de RH | Formulário | Trimestral |
| Pesquisa de clima | Pulses / Google Forms | — | Trimestral |
| **Desenvolvimento** | | | |
| Catálogo de treinamentos | Alura / Udemy Business | Planilha | Manual |
| Certificações obtidas | LinkedIn / Credly | Planilha | Por evento |
| Histórico de treinamentos | LMS interno | Planilha | Por conclusão |
| **Erros operacionais** | | | |
| Incidentes com RCA | ness.OPS | GLPI | Por evento |
| Falhas de procedimento | ness.OPS | Registro manual | Por evento |

---

## Matriz de Fontes por Tipo

### ERPs e Sistemas Financeiros
| Sistema | APIs Disponíveis | Dados |
|---------|------------------|-------|
| **Omie** | REST/JSON | Financeiro, Contratos, Clientes, NF |
| Conta Azul | REST | Financeiro básico |
| Bling | REST | Financeiro, Estoque |
| Netsuite | REST | Financeiro completo |

### Timesheet e Produtividade
| Sistema | APIs Disponíveis | Dados |
|---------|------------------|-------|
| **Clockify** | REST | Horas por projeto/tarefa |
| Toggl | REST | Horas por projeto |
| Harvest | REST | Horas + custos |
| Jira (worklogs) | REST | Horas por issue |

### ITSM e Service Desk
| Sistema | APIs Disponíveis | Dados |
|---------|------------------|-------|
| **GLPI** | REST | Chamados, Inventário |
| Freshdesk | REST | Tickets, SLA |
| Zendesk | REST | Tickets, métricas |
| ServiceNow | REST | ITSM completo |

### Cloud Providers
| Sistema | APIs Disponíveis | Dados |
|---------|------------------|-------|
| **AWS** | Cost Explorer API | Custos detalhados |
| **Azure** | Cost Management API | Custos detalhados |
| **GCP** | Billing API | Custos detalhados |
| DigitalOcean | REST | Custos básicos |

### Monitoramento e Segurança
| Sistema | APIs Disponíveis | Dados |
|---------|------------------|-------|
| **Wazuh** | REST | Alertas, logs, compliance |
| **Zabbix** | REST | Métricas, alertas |
| Grafana | REST | Dashboards, alertas |
| Datadog | REST | APM, logs, métricas |

### CRM e Vendas
| Sistema | APIs Disponíveis | Dados |
|---------|------------------|-------|
| **Omie CRM** | REST | Oportunidades, contatos |
| Pipedrive | REST | Pipeline, deals |
| HubSpot | REST | CRM completo |
| RD Station | REST | Marketing + CRM |

### RH e Pessoas
| Sistema | APIs Disponíveis | Dados |
|---------|------------------|-------|
| Gupy | REST | Recrutamento |
| Qulture.Rocks | REST | Avaliações, PDI |
| Feedz | REST | Feedback, engajamento |
| Convenia | REST | DP, ponto |

### Documentos e Assinaturas
| Sistema | APIs Disponíveis | Dados |
|---------|------------------|-------|
| **DocuSign** | REST | Assinaturas, status |
| ClickSign | REST | Assinaturas |
| Google Drive | REST | Documentos |
| SharePoint | REST/Graph | Documentos |

---

## Inputs Manuais (Fallback)

Quando não há integração disponível:

| Tipo | Formato | Frequência Recomendada |
|------|---------|------------------------|
| Timesheet | Excel/CSV | Semanal |
| Custos de cloud | CSV exportado | Mensal |
| Propostas | PDF/DOCX upload | Por evento |
| Contratos | PDF upload | Por evento |
| Avaliações | Google Forms | Ciclo de avaliação |
| Políticas | DOCX/PDF upload | Por atualização |

---

## Prioridade de Implementação

### Fase 1 — Essenciais
1. ✅ Omie ERP (Financeiro + Contratos)
2. ⬜ Timesheet (Clockify ou manual)
3. ⬜ GLPI (Chamados + Inventário)

### Fase 2 — Operacionais
4. ⬜ Cloud billing (AWS/Azure/GCP)
5. ⬜ Wazuh/Zabbix (Monitoramento)
6. ⬜ Google Drive (Documentos)

### Fase 3 — Pessoas e Compliance
7. ⬜ Sistema de RH
8. ⬜ DocuSign/ClickSign
9. ⬜ LMS (Treinamentos)

### Fase 4 — Comercial
10. ⬜ CRM (se não usar Omie CRM)
11. ⬜ LinkedIn API
12. ⬜ Google Analytics
