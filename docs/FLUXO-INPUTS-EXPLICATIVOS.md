# Fluxo explicativo — inputs com labels, help texts e exemplos

Resumo do plano em `.context/plans/fluxo-explicativo-inputs.md` para referência rápida.

## Objetivo
Todo input deve ter:
- **Label** claro
- **Help text** explicando o que preencher
- **Placeholder** com exemplo real (não genérico)

## Inventário resumido

| Formulário | Local | Principais inputs |
|------------|-------|-------------------|
| Contato | Site /contato | Nome, E-mail, Empresa, Mensagem |
| Candidatura | Site /carreiras/[slug]/candidatar | Nome, E-mail, LinkedIn, Mensagem |
| Playbook | App OPS | Título, Slug, Conteúdo (Markdown) |
| Métricas | App OPS | Contrato, Mês, Horas, Custo, SLA |
| Serviço | App Growth | Nome, Slug, Playbook, Pitch |
| Post | App Growth | Título, Slug, SEO, Conteúdo, Publicar |
| Cliente | App FIN | Nome |
| Contrato | App FIN | Cliente, MRR, Datas |
| Vaga | App People | Título, Slug, Departamento, Descrição |

## Convenções de slug
- Minúsculo, hífens, sem acentos
- Exemplos: `manual-secops`, `n-secops`, `desenvolvedor-fullstack`

## Padrão de UI
```
[Label]
[Input com placeholder = exemplo]
<help text em text-xs text-slate-500>
```

## Próximos passos
1. ~~Criar componente FormField reutilizável~~ — já existe `InputField` em `shared/input-field.tsx` (label, helper, error).
2. Aplicar help texts e placeholders em cada formulário (em andamento: ContractForm, PolicyForm, ComplianceCheckForm, BrandAssetForm, JobForm, Feedback360Form já usam InputField + helper).
3. Adicionar legenda nas colunas do Kanban de leads (opcional).

## Checklist de validação manual (fluxo inputs)

Validar que cada formulário listado acima tem:

| Formulário | Label | Help text | Placeholder | Observação |
|------------|-------|-----------|-------------|------------|
| Contato | ✓ | ✓ | ✓ | contact-form |
| Candidatura | ✓ | — | ✓ | carreiras/[slug]/candidatar |
| Playbook | ✓ | ✓ | ✓ | playbook-editor-form |
| Métricas | ✓ | ✓ | ✓ | metricas-form |
| Serviço | ✓ | ✓ | ✓ | service-form / service-edit-form |
| Post | ✓ | ✓ | ✓ | post-editor-form |
| Cliente | ✓ | ✓ | — | client-form |
| Contrato | ✓ | ✓ | ✓ | contract-form (InputField) |
| Vaga | ✓ | ✓ | ✓ | job-form, job-edit-form (InputField) |
| Política | ✓ | ✓ | ✓ | policy-form (InputField) |
| Compliance check | ✓ | ✓ | — | compliance-check-form (InputField) |
| Brand asset | ✓ | ✓ | ✓ | brand-asset-form (InputField) |
| Feedback 360º | ✓ | ✓ | — | feedback-360-form (InputField) |

Execução: abrir cada rota no browser e conferir se todo input tem label associado (id/htmlFor), texto de ajuda quando fizer sentido e placeholder com exemplo real.
