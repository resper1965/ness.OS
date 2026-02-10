# 📚 Guia: Entendendo a Hierarquia de Serviços

> **Para:** Todos os usuários do nessOS  
> **Objetivo:** Explicar como funciona a composição de serviços em 4 níveis

---

## 🎯 Visão Geral

O nessOS organiza o trabalho técnico em **4 níveis hierárquicos**, do mais simples ao mais complexo. Pense como blocos de LEGO: você monta peças pequenas para criar estruturas maiores.

```
🧱 Task (Tarefa)
    ↓ agrupa em
📋 Playbook (Procedimento)
    ↓ agrupa em
💼 Service Action (Job/Entrega)
    ↓ agrupa em
📦 Service (Produto/Serviço Vendável)
```

---

## 📖 Os 4 Níveis Explicados

### Nível 1: 🧱 Task (Tarefa)

**O que é?** A menor unidade de trabalho possível. Uma ação específica e atômica.

**Exemplo:**

- "Instalar certificado SSL"
- "Criar backup do banco de dados"
- "Revisar log de segurança"

**Informação obrigatória:**

- Tempo estimado (em minutos) **OU** Custo (em R$)
- Pelo menos uma dessas métricas deve existir

**Analogia:** É como uma única etapa de uma receita de bolo.

---

### Nível 2: 📋 Playbook (SOP - Standard Operating Procedure)

**O que é?** Um manual técnico que agrupa várias Tasks em uma sequência lógica.

**Exemplo:** _Playbook "Deploy em Produção"_

1. Task: Fazer backup do banco
2. Task: Rodar testes automatizados
3. Task: Aplicar migração de schema
4. Task: Deploy da aplicação
5. Task: Validar health checks

**Características:**

- **Reutilizável:** O mesmo Playbook pode ser usado em diferentes projetos
- **Métrica agregada:** O tempo/custo total é a **soma** de todas as Tasks
- **Documentação:** Pode ter markdown explicativo, tags, data da última revisão

**Analogia:** É a receita completa do bolo.

---

### Nível 3: 💼 Service Action (Job)

**O que é?** Um conjunto de Playbooks que representa uma **entrega de valor** ao cliente.

**Exemplo:** _Service Action "Hardening Completo de Infraestrutura"_

- Playbook: n.secops (Análise de vulnerabilidades + Patches)
- Playbook: n.infraops (Provisionamento + Backup + Monitoramento)

**Como funciona:**

- **Composição:** Você escolhe quais Playbooks compõem esse Job
- **Fator de Complexidade:** Multiplicador para ajustar margem de risco (ex: 1.3x)
- **Custo Final:** (Soma dos Playbooks) × Fator de Complexidade

**Por que existe?**

- Nem sempre você vende um Playbook isolado
- Às vezes, o cliente precisa de um "pacote" técnico
- Permite precificar entregas mais complexas com margem adequada

**Analogia:** É um kit de bolo + decoração + embalagem premium que você vende como produto completo.

---

### Nível 4: 📦 Service (Produto/Serviço)

**O que é?** O item final do **catálogo comercial**. É o que aparece na proposta para o cliente.

**Exemplo:** _Service "Plataforma de E-commerce Completa"_

- Service Action: Setup de infraestrutura
- Service Action: Desenvolvimento frontend
- Service Action: Integração de pagamentos
- Service Action: Treinamento da equipe

**Características:**

- **Vendável:** Tem nome de marketing, pitch comercial, imagem de capa
- **Preço base:** Pode ter um preço fixo ou derivado da soma dos Jobs
- **Conteúdo rico:** Descrição em markdown, features destacadas
- **Catálogo público:** Pode ser exibido no site institucional

**Analogia:** É a vitrine da confeitaria com o bolo já pronto e precificado.

---

## 🔄 Como os Números Sobem Automaticamente

O nessOS calcula tudo **de baixo para cima** automaticamente usando triggers no banco de dados:

```
Task 1: 30min / R$ 200
Task 2: 60min / R$ 400
Task 3: 45min / R$ 300
         ↓ (soma automática)
Playbook: 135min / R$ 900
         ↓ (agregação + complexidade)
Service Action: 135min / R$ 900 × 1.2 = R$ 1.080
         ↓ (soma de múltiplos Jobs)
Service: Preço final calculado ou customizado
```

**Importante:** Você **não precisa** atualizar manualmente. Quando você:

- Adiciona uma Task → O Playbook recalcula sozinho
- Vincula um Playbook → O Service Action recalcula sozinho
- Muda a complexidade → O custo final ajusta automaticamente

---

## 💡 Casos de Uso Reais

### Cenário 1: Serviço Recorrente Simples

**Cliente:** Pequena empresa quer monitoramento 24/7

**Estrutura:**

- **Service:** "Monitoramento Gerenciado"
  - **Service Action:** "Setup Inicial de Monitoramento"
    - **Playbook:** Instalação de agentes
    - **Playbook:** Configuração de dashboards
  - **Service Action:** "Manutenção Mensal"
    - **Playbook:** Revisão de alertas
    - **Playbook:** Ajuste de thresholds

---

### Cenário 2: Projeto de Implementação

**Cliente:** Startup quer MVP de app mobile

**Estrutura:**

- **Service:** "MVP Mobile App (iOS + Android)"
  - **Service Action:** "Backend API"
    - **Playbook:** Setup de banco de dados
    - **Playbook:** Desenvolvimento de endpoints
    - **Playbook:** Deploy em produção
  - **Service Action:** "Apps Nativos"
    - **Playbook:** UI/UX design
    - **Playbook:** Desenvolvimento iOS
    - **Playbook:** Desenvolvimento Android
  - **Service Action:** "Testes e Homologação"
    - **Playbook:** Testes automatizados
    - **Playbook:** Beta testing

---

## 🎨 Onde Usar Cada Nível

| Nível              | Usado por             | Onde fica no sistema                      |
| ------------------ | --------------------- | ----------------------------------------- |
| **Task**           | Time de Operações     | `/app/ops/playbooks/[id]` (seção "Tasks") |
| **Playbook**       | Time de Operações     | `/app/ops/playbooks`                      |
| **Service Action** | Operações + Comercial | `/app/ops/service-actions`                |
| **Service**        | Comercial             | `/app/growth/services` (Catálogo)         |

---

## ❓ FAQ

### "Por que não usar só Playbooks?"

**R:** Playbooks são técnicos. Service Actions permitem:

- Agrupar múltiplos Playbooks em uma entrega
- Aplicar fator de complexidade (margem de risco)
- Mapear com códigos do ERP (Omie)

### "Posso vender um Playbook direto?"

**R:** Tecnicamente sim, mas não é recomendado:

- Crie um Service Action com apenas 1 Playbook
- Assim você mantém rastreabilidade e pode adicionar complexidade

### "O que é o 'Fator de Complexidade'?"

**R:** É um multiplicador que ajusta o preço final:

- `1.0` = Simples, sem riscos
- `1.3` = Médio, alguma complexidade
- `1.5+` = Alto risco, muitas variáveis

### "Preciso preencher tudo de uma vez?"

**R:** Não! Você pode:

1. Criar Tasks básicas
2. Montar Playbooks conforme necessário
3. Criar Service Actions para comercializar
4. Compor Services para o catálogo

---

## 🚀 Primeiros Passos

1. **Comece pelas Tasks:** Documente atividades atômicas da sua operação
2. **Monte Playbooks:** Agrupe Tasks que sempre andam juntas
3. **Crie Service Actions:** Defina entregas técnicas completas
4. **Publique Services:** Lance no catálogo para vendas

---

## 📊 Integração com Outros Módulos

### ness.FIN (Financeiro)

- Contratos podem ter múltiplos Service Actions vinculados
- Dashboard CFO mostra "Budget vs Real" comparando custo estimado (Tasks) com custo real (Timer)

### ness.DATA (ERP/Omie)

- Service Actions podem ser mapeados com códigos de serviço do Omie
- Sincronização bidirecional para manter catálogo alinhado

### ness.OPS (Timesheet)

- Timers podem ser vinculados a Playbooks (futuro: Service Actions)
- Custo real é calculado baseado nas horas trabalhadas

---

## 🎓 Resumo Visual

```
┌─────────────────────────────────────────────────┐
│  📦 SERVICE (Catálogo Comercial)                │
│  "Plataforma E-commerce Completa"               │
│  💰 Preço: R$ 45.000                            │
└─────────────────────────────────────────────────┘
         ▲
         │ composto por
         │
┌─────────────────────────────────────────────────┐
│  💼 SERVICE ACTION (Job/Entrega)                │
│  "Backend API Escalável"                        │
│  ⏱️ 320min × 1.3 = 416min                       │
│  💰 R$ 8.000 × 1.3 = R$ 10.400                  │
└─────────────────────────────────────────────────┘
         ▲
         │ composto por
         │
┌─────────────────────────────────────────────────┐
│  📋 PLAYBOOK (Procedimento)                     │
│  "Deploy em Produção"                           │
│  ⏱️ 180min (soma das tasks)                     │
│  💰 R$ 4.500 (soma das tasks)                   │
└─────────────────────────────────────────────────┘
         ▲
         │ composto por
         │
┌─────────────────────────────────────────────────┐
│  🧱 TASK (Unidade Atômica)                      │
│  "Aplicar migração de schema"                   │
│  ⏱️ 45min                                        │
│  💰 R$ 1.200                                     │
└─────────────────────────────────────────────────┘
```

---

📌 **Dica Final:** Use o **HierarchyVisualizer** no sistema para ver a estrutura completa de qualquer Service Action e entender o custo total de forma visual.
