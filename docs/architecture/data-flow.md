# Fluxo de Dados do ness.OS

## Visão Geral

O ness.OS opera com um modelo de dados onde as informações fluem entre módulos, criando um ecossistema integrado de inteligência empresarial. Este documento detalha cada fluxo de dados crítico.

## Fluxos Principais

### 1. Fluxo OPS → FIN → GROWTH (Ciclo de Precificação)

Este é o fluxo mais crítico do sistema, pois garante que a precificação seja baseada em custos reais.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE PRECIFICAÇÃO INTELIGENTE                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ness.OPS   │────►│  ness.FIN   │────►│  ness.FIN   │────►│ness.GROWTH  │
│             │     │             │     │             │     │             │
│ Mapeamento  │     │ Custo Real  │     │ Overhead %  │     │ Precificação│
│ de Recursos │     │ por Contrato│     │ Calculado   │     │ Inteligente │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ • Horas     │     │ • RH        │     │ • % Fixo    │     │ • Preço     │
│   técnico   │     │ • Licenças  │     │   aplicável │     │   sugerido  │
│ • Licenças  │     │ • Nuvem     │     │ • Rateio    │     │ • Margem    │
│ • Cloud     │     │ • Impostos  │     │   calculado │     │   esperada  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

**Dados Transmitidos:**

| Origem | Destino | Dados | Frequência |
|--------|---------|-------|------------|
| OPS | FIN | Horas por contrato | Diário |
| OPS | FIN | Consumo de licenças | Mensal |
| OPS | FIN | Uso de cloud | Diário |
| FIN | FIN | Custo RH alocado | Mensal |
| FIN | GROWTH | Custo total por contrato | Sob demanda |
| FIN | GROWTH | % de overhead padrão | Mensal |

---

### 2. Fluxo OPS → PEOPLE (Ciclo de Aprendizado)

Falhas operacionais retroalimentam o desenvolvimento humano.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CICLO DE APRENDIZADO CONTÍNUO                        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ness.OPS   │────►│  Análise    │────►│ness.PEOPLE  │────►│ Treinamento │
│             │     │             │     │             │     │             │
│ Erro        │     │ Classificação│    │ Correlação  │     │ Aplicado    │
│ Detectado   │     │ do Erro     │     │ Colaborador │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                                                           │
      └───────────────────────────────────────────────────────────┘
                          Feedback de Eficácia
```

**Dados Transmitidos:**

| Origem | Destino | Dados | Trigger |
|--------|---------|-------|---------|
| OPS | PEOPLE | Erro identificado | Evento |
| OPS | PEOPLE | Colaborador envolvido | Evento |
| OPS | PEOPLE | Procedimento violado | Evento |
| PEOPLE | OPS | Status de treinamento | Após conclusão |

---

### 3. Fluxo OPS → GROWTH (Marketing de Conteúdo)

Casos de sucesso alimentam a geração de conteúdo.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PIPELINE DE CONTEÚDO                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ness.OPS   │────►│ KB Comercial│────►│ness.GROWTH  │────►│ Publicação  │
│             │     │             │     │             │     │             │
│ Caso de     │     │ Caso        │     │ Agente de   │     │ LinkedIn    │
│ Sucesso     │     │ Indexado    │     │ Marketing   │     │ Instagram   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │ Monitoramento│
                                        │ Engajamento │
                                        └─────────────┘
```

**Dados Transmitidos:**

| Origem | Destino | Dados | Frequência |
|--------|---------|-------|------------|
| OPS | KB | Descrição do caso | Evento |
| OPS | KB | Resultados obtidos | Evento |
| OPS | KB | Cliente (anonimizado) | Evento |
| KB | GROWTH | Casos indexados | Sob demanda |
| GROWTH | Externo | Post gerado | Semanal |
| Externo | GROWTH | Métricas de engajamento | Diário |

---

### 4. Fluxo FIN → Alertas (Ciclo de Vida do Contrato)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    GESTÃO DO CICLO DE VIDA                              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ness.FIN   │────►│  Agente de  │────►│  Alertas    │
│             │     │  Ciclo de   │     │             │
│ Datas de    │     │  Vida       │     │ • Renovação │
│ Vigência    │     │             │     │ • Reajuste  │
└─────────────┘     └─────────────┘     │ • Vencimento│
                                        └─────────────┘
                                              │
                          ┌───────────────────┼───────────────────┐
                          ▼                   ▼                   ▼
                    ┌──────────┐        ┌──────────┐        ┌──────────┐
                    │ E-mail   │        │ Dashboard│        │ Webhook  │
                    │ Gerente  │        │ ness.OS  │        │ Externo  │
                    └──────────┘        └──────────┘        └──────────┘
```

**Regras de Negócio:**

| Evento | Antecedência | Destinatários | Ação |
|--------|--------------|---------------|------|
| Renovação | 90 dias | Comercial + Cliente | Proposta de renovação |
| Reajuste IGPM | 30 dias | Financeiro + Cliente | Notificação de reajuste |
| Fim de Vigência | 60 dias | Comercial | Alerta de churn risk |
| Inadimplência | Imediato | Financeiro | Bloqueio de serviços |

---

### 5. Fluxo JUR ↔ Contratos (Análise de Riscos)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    BLINDAGEM CONTRATUAL                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Novo        │────►│  ness.JUR   │────►│  Análise    │────►│  Parecer    │
│ Contrato    │     │             │     │  NLP        │     │  Jurídico   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │                                       │
                          ▼                                       ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │ KB Legal    │                         │ • Aprovado  │
                    │ • LGPD      │                         │ • Ressalvas │
                    │ • Marco Civil│                        │ • Bloqueado │
                    │ • Cláusulas │                         └─────────────┘
                    └─────────────┘
```

**Riscos Analisados:**

| Categoria | Verificação | Severidade |
|-----------|-------------|------------|
| SLA | Prazos desproporcionais | Alta |
| Multas | Penalidades abusivas | Alta |
| LGPD | Tratamento de dados | Crítica |
| Rescisão | Cláusulas unilaterais | Média |
| Propriedade Intelectual | Cessão indevida | Alta |

---

### 6. Fluxo GOV → Colaboradores (Compliance Interno)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RASTREABILIDADE DE ACEITES                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Nova        │────►│  ness.GOV   │────►│ Distribuição│
│ Política    │     │             │     │ Automática  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                          ┌───────────────────┼───────────────────┐
                          ▼                   ▼                   ▼
                    ┌──────────┐        ┌──────────┐        ┌──────────┐
                    │Colaborador│       │Colaborador│       │Colaborador│
                    │    A      │       │    B      │       │    C      │
                    └──────────┘        └──────────┘        └──────────┘
                          │                   │                   │
                          ▼                   ▼                   ▼
                    ┌──────────────────────────────────────────────────┐
                    │              Registro de Aceites                 │
                    │  • Data/Hora  • IP  • Versão  • Assinatura      │
                    └──────────────────────────────────────────────────┘
```

**Documentos Rastreados:**

| Documento | Momento | Renovação |
|-----------|---------|-----------|
| NDA | Admissão | Anual |
| Política de Segurança | Admissão | A cada atualização |
| Código de Conduta | Admissão | Anual |
| Termo de Responsabilidade | Admissão | Anual |
| LGPD - Tratamento de Dados | Admissão | A cada atualização |

---

## Matriz de Integração

| Módulo Origem | Módulo Destino | Tipo de Dado | Protocolo |
|---------------|----------------|--------------|-----------|
| OPS | FIN | Recursos consumidos | API REST |
| OPS | PEOPLE | Erros operacionais | Event-driven |
| OPS | GROWTH | Casos de sucesso | Batch |
| FIN | GROWTH | Custos e overhead | API REST |
| FIN | Externo | Alertas | Webhook |
| JUR | GROWTH | Parecer contratual | API REST |
| GOV | PEOPLE | Status de compliance | API REST |
| Externo | FIN | Dados ERP | API REST |
| GROWTH | Externo | Posts | API REST |

---

## Considerações de Segurança

1. **Dados Sensíveis:** Informações de RH e financeiras são criptografadas em trânsito e em repouso
2. **Audit Trail:** Todos os fluxos são logados para auditoria
3. **RBAC:** Cada módulo possui controle de acesso baseado em perfis
4. **Data Masking:** Dados de clientes são anonimizados em contextos de marketing
