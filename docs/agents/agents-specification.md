# Especificação dos Agentes de IA

## Visão Geral

O ness.OS opera com **10 agentes de IA especializados**, cada um com responsabilidades bem definidas. Este documento especifica inputs, outputs, triggers e dependências de cada agente.

---

## 1. Agente de Vendas (Smart Proposals)

**Módulo:** ness.GROWTH  
**Tipo:** Generativo  
**Função:** Gerar propostas técnicas baseadas no histórico de sucesso

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Briefing do cliente, escopo desejado, contexto da oportunidade |
| **Output** | Proposta técnica estruturada em formato padrão |
| **Trigger** | Solicitação do comercial via interface |
| **Dependências** | KB Comercial (contratos de sucesso), Agente de Precificação |

### Lógica de Operação

```
1. Recebe briefing do cliente
2. Busca no KB Comercial casos similares (RAG)
3. Identifica "modelo ideal" baseado em:
   - Porte do cliente
   - Setor de atuação
   - Escopo requisitado
4. Gera proposta adaptando o modelo
5. Solicita precificação ao Agente de Precificação
6. Consolida proposta final
```

### Métricas de Sucesso

- Taxa de conversão de propostas geradas
- Tempo médio de geração
- Aderência ao modelo padrão

---

## 2. Agente de Precificação

**Módulo:** ness.GROWTH  
**Tipo:** Analítico/Calculador  
**Função:** Definir preços considerando custos reais e riscos

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Escopo do serviço, dados de recursos estimados, SLAs desejados |
| **Output** | Preço sugerido, margem esperada, breakdown de custos |
| **Trigger** | Solicitação do Agente de Vendas ou usuário |
| **Dependências** | ness.FIN (overhead, custos), ness.OPS (consumo de recursos) |

### Fórmula Base

```
Preço = (Custo_RH + Custo_Ferramentas + Custo_Cloud) × (1 + %Overhead) × (1 + %Margem) × (1 + %Risco_SLA)
```

### Parâmetros

| Parâmetro | Fonte | Atualização |
|-----------|-------|-------------|
| Custo_RH | ness.OPS | Mensal |
| Custo_Ferramentas | ness.OPS | Mensal |
| Custo_Cloud | ness.OPS | Diário |
| %Overhead | ness.FIN | Mensal |
| %Margem | Configuração | Manual |
| %Risco_SLA | Tabela de SLAs | Manual |

---

## 3. Agente de Marketing

**Módulo:** ness.GROWTH  
**Tipo:** Generativo + Monitoramento  
**Função:** Criar conteúdo e monitorar engajamento

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Casos de sucesso, novidades operacionais, calendário editorial |
| **Output** | Posts para redes sociais, artigos para site, sugestões de temas |
| **Trigger** | Agendamento (calendário) ou evento (novo caso de sucesso) |
| **Dependências** | KB Comercial, APIs de redes sociais |

### Funcionalidades

1. **Geração de Conteúdo**
   - Posts LinkedIn (formato profissional)
   - Posts Instagram (formato visual)
   - Artigos técnicos para blog

2. **Monitoramento**
   - Coleta métricas de engajamento
   - Analisa comentários
   - Sugere respostas
   - Identifica temas trending

### Templates de Conteúdo

| Tipo | Estrutura | Frequência |
|------|-----------|------------|
| Case Study | Desafio → Solução → Resultado | Quinzenal |
| Thought Leadership | Tendência → Análise → Recomendação | Semanal |
| Behind the Scenes | Bastidores da operação | Mensal |

---

## 4. Agente de Homogeneização

**Módulo:** ness.OPS  
**Tipo:** Estruturador  
**Função:** Padronizar processos entre contratos

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Processos atuais de cada contrato, melhores práticas |
| **Output** | Manuais de Procedimentos padronizados |
| **Trigger** | Novo contrato ou revisão periódica |
| **Dependências** | KB Operacional |

### Processo de Homogeneização

```
1. Mapeia processos existentes por contrato
2. Identifica variações e inconsistências
3. Define "padrão ouro" baseado em:
   - Eficiência comprovada
   - Conformidade com normas
   - Feedback da operação
4. Gera Manual de Procedimento
5. Distribui para times
6. Monitora aderência
```

### Rituais Mapeados

| Categoria | Rituais | Periodicidade |
|-----------|---------|---------------|
| Backup | Full, Incremental, Teste de Restore | Diário/Semanal/Mensal |
| Patch | Avaliação, Teste, Deploy | Mensal |
| Firewall | Revisão de regras, Análise de logs | Semanal |
| Monitoramento | Revisão de alertas, Tuning | Diário |

---

## 5. Agente de Mapeamento de Recursos

**Módulo:** ness.OPS  
**Tipo:** Coletor/Analítico  
**Função:** Medir consumo exato de recursos por contrato

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Timesheet, logs de sistemas, APIs de cloud |
| **Output** | Relatório de consumo por contrato |
| **Trigger** | Coleta automática (batch) ou sob demanda |
| **Dependências** | Integrações externas (Timesheet, AWS, Azure, GCP) |

### Recursos Mapeados

| Recurso | Fonte | Granularidade |
|---------|-------|---------------|
| Horas técnicas | Timesheet | Por tarefa |
| Licenças | Inventário | Por usuário |
| Cloud compute | API providers | Por hora |
| Cloud storage | API providers | Por GB |
| Ferramentas SaaS | Billing APIs | Por licença |

### Saída de Dados

```json
{
  "contrato_id": "CTR-2025-001",
  "periodo": "2025-01",
  "recursos": {
    "horas_tecnicas": 120,
    "licencas_ativas": 5,
    "cloud_compute_hrs": 720,
    "cloud_storage_gb": 500,
    "ferramentas": ["Wazuh", "Zabbix", "GLPI"]
  },
  "custo_estimado": 15000.00
}
```

---

## 6. Agente de Rentabilidade

**Módulo:** ness.FIN  
**Tipo:** Analítico  
**Função:** Calcular margem líquida por cliente

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Receita por contrato, custos mapeados (OPS), overhead |
| **Output** | Margem líquida, rentabilidade %, alertas de desvio |
| **Trigger** | Fechamento mensal ou sob demanda |
| **Dependências** | ness.OPS (recursos), ERP (receita), Tabela de impostos |

### Fórmula de Rentabilidade

```
Custo_Total = Custo_Direto + (Receita × %Overhead) + (Receita × %Impostos)
Margem_Bruta = Receita - Custo_Direto
Margem_Liquida = Receita - Custo_Total
Rentabilidade% = (Margem_Liquida / Receita) × 100
```

### Alertas Configuráveis

| Condição | Alerta | Destinatário |
|----------|--------|--------------|
| Rentabilidade < 10% | Crítico | Diretoria |
| Rentabilidade < 20% | Atenção | Gerente Comercial |
| Custo > Receita | Emergência | Diretoria + Comercial |

---

## 7. Agente de Ciclo de Vida

**Módulo:** ness.FIN  
**Tipo:** Monitoramento/Automação  
**Função:** Gestão de vigências, renovações e reajustes

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Datas de vigência, índices econômicos (IGPM/IPCA), status de pagamento |
| **Output** | Alertas de renovação, cálculo de reajuste, notificações |
| **Trigger** | Cronograma (diário) ou evento (vencimento) |
| **Dependências** | KB Financeiro, APIs de índices econômicos |

### Calendário de Ações

| Evento | Antecedência | Ação |
|--------|--------------|------|
| Fim de vigência | 90 dias | Alerta comercial |
| Fim de vigência | 60 dias | E-mail cliente |
| Fim de vigência | 30 dias | Proposta renovação |
| Reajuste anual | 30 dias | Cálculo + Notificação |
| Inadimplência | 0 dias | Alerta financeiro |
| Inadimplência | 30 dias | Suspensão de serviços |

### Cálculo de Reajuste

```
Valor_Reajustado = Valor_Atual × (1 + Indice_Acumulado)

Índices suportados:
- IGPM (FGV)
- IPCA (IBGE)
- INPC (IBGE)
```

---

## 8. Agente de Análise Contratual

**Módulo:** ness.JUR  
**Tipo:** NLP/Analítico  
**Função:** Identificar riscos jurídicos em contratos

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Documento contratual (PDF/DOCX) |
| **Output** | Parecer jurídico, lista de riscos, sugestões de alteração |
| **Trigger** | Upload de novo contrato ou revisão periódica |
| **Dependências** | KB Legal (LGPD, Marco Civil, CLT, cláusulas padrão) |

### Categorias de Análise

| Categoria | Verificações |
|-----------|--------------|
| **SLA** | Prazos de atendimento, uptime garantido, penalidades |
| **Multas** | Valores, condições de aplicação, limitações |
| **LGPD** | Tratamento de dados, DPO, transferência internacional |
| **Rescisão** | Condições, prazos de aviso, multas rescisórias |
| **PI** | Propriedade intelectual, cessão de direitos |
| **Foro** | Jurisdição, arbitragem |

### Output Estruturado

```json
{
  "contrato": "Contrato_Cliente_X.pdf",
  "data_analise": "2025-01-29",
  "status": "RESSALVAS",
  "riscos": [
    {
      "categoria": "SLA",
      "clausula": "5.2",
      "risco": "Prazo de 2h para incidentes críticos é inviável",
      "severidade": "ALTA",
      "sugestao": "Negociar para 4h úteis"
    }
  ],
  "score_risco": 7.5
}
```

---

## 9. Agente de Compliance

**Módulo:** ness.GOV  
**Tipo:** Monitoramento/Rastreabilidade  
**Função:** Garantir conformidade interna e rastrear aceites

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Lista de colaboradores, políticas vigentes, status de aceites |
| **Output** | Dashboard de compliance, alertas de pendências |
| **Trigger** | Admissão, atualização de política, vencimento de aceite |
| **Dependências** | KB Governança, Sistema de RH |

### Documentos Rastreados

| Documento | Obrigatoriedade | Renovação | Validade |
|-----------|-----------------|-----------|----------|
| NDA | Admissão | Anual | 12 meses |
| Política de Segurança | Admissão | Atualização | Indeterminada |
| Código de Conduta | Admissão | Anual | 12 meses |
| Termo LGPD | Admissão | Atualização | Indeterminada |
| Termo de Equipamentos | Admissão | Devolução | Indeterminada |

### Registro de Aceite

```json
{
  "colaborador_id": "COL-001",
  "documento": "Política de Segurança v2.1",
  "data_aceite": "2025-01-15T14:30:00Z",
  "ip_origem": "192.168.1.100",
  "user_agent": "Chrome/120",
  "hash_documento": "sha256:abc123...",
  "assinatura_digital": true
}
```

---

## 10. Agente de Correlação de Treinamento

**Módulo:** ness.PEOPLE  
**Tipo:** Analítico/Recomendador  
**Função:** Cruzar falhas operacionais com necessidades de capacitação

### Especificação

| Atributo | Descrição |
|----------|-----------|
| **Input** | Erros operacionais (OPS), avaliações 360º, catálogo de treinamentos |
| **Output** | Plano de desenvolvimento individual, recomendações de treinamento |
| **Trigger** | Erro operacional, ciclo de avaliação, sob demanda |
| **Dependências** | ness.OPS (erros), KB Pessoas (avaliações), Catálogo de cursos |

### Matriz de Correlação

| Tipo de Erro (OPS) | Competência Relacionada | Treinamento Sugerido |
|--------------------|------------------------|---------------------|
| Falha em backup | Processos de DR | Curso de Backup & Recovery |
| Breach de segurança | Security awareness | Treinamento LGPD + Security |
| SLA não cumprido | Gestão de tempo | Workshop de priorização |
| Documentação incompleta | Comunicação técnica | Redação técnica |

### Lógica de Recomendação

```
1. Recebe evento de erro do ness.OPS
2. Classifica o erro por categoria
3. Identifica colaborador(es) envolvido(s)
4. Consulta histórico de erros similares
5. Consulta avaliações 360º do colaborador
6. Identifica gap de competência
7. Busca treinamento adequado no catálogo
8. Gera recomendação priorizada
9. Notifica gestor e colaborador
```

### Output de Recomendação

```json
{
  "colaborador_id": "COL-001",
  "data": "2025-01-29",
  "origem": "Erro operacional #ERR-2025-042",
  "gap_identificado": "Procedimentos de Patch Management",
  "treinamentos_recomendados": [
    {
      "curso": "Patch Management Essentials",
      "prioridade": "ALTA",
      "carga_horaria": "8h",
      "modalidade": "Online"
    }
  ],
  "prazo_conclusao": "2025-02-28"
}
```

---

## Matriz de Comunicação entre Agentes

```
┌────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│                │ Vendas  │ Precif. │ Market. │ Homog.  │ Mapeam. │ Rentab. │ Ciclo   │ Contrat.│ Compli. │ Treina. │
├────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Ag. Vendas     │    -    │   ►     │         │    ◄    │         │         │         │    ◄    │         │         │
│ Ag. Precific.  │    ◄    │    -    │         │         │    ◄    │    ◄    │         │         │         │         │
│ Ag. Marketing  │         │         │    -    │    ◄    │         │         │         │         │         │         │
│ Ag. Homogenei. │    ►    │         │    ►    │    -    │         │         │         │         │         │    ►    │
│ Ag. Mapeamento │         │    ►    │         │         │    -    │    ►    │         │         │         │         │
│ Ag. Rentabil.  │         │    ►    │         │         │    ◄    │    -    │         │         │         │         │
│ Ag. Ciclo Vida │         │         │         │         │         │         │    -    │         │         │         │
│ Ag. Contratual │    ►    │         │         │         │         │         │         │    -    │         │         │
│ Ag. Compliance │         │         │         │         │         │         │         │         │    -    │    ►    │
│ Ag. Treinam.   │         │         │         │    ◄    │         │         │         │         │    ◄    │    -    │
└────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

Legenda: ► Envia dados para | ◄ Recebe dados de
```

---

## Considerações de Implementação

### Tecnologias Recomendadas

| Componente | Tecnologia |
|------------|------------|
| LLM Base | Claude / GPT-4 / Llama |
| Vector DB | Pinecone / Weaviate / Qdrant |
| Orquestração | LangChain / LlamaIndex |
| Mensageria | RabbitMQ / Redis Streams |
| APIs | FastAPI / Node.js |

### Padrões de Comunicação

- **Síncrono:** Agente de Vendas → Agente de Precificação (resposta imediata)
- **Assíncrono:** Agente de Mapeamento → Agente de Rentabilidade (batch)
- **Event-driven:** Agente de Homogeneização → Agente de Treinamento (erro detectado)
