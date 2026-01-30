# Diretrizes de Desenvolvimento ness.OS

> Regras para o Cursor e para desenvolvedores. Mantidas em `.cursor/rules/diretrizes-desenvolvimento.mdc` (always apply).

---

## 1. Segurança (SecOps First)

- **Nunca exponha lógica de negócio no Client-Side.** Use Server Actions para tudo.
- **RLS rigoroso.** O Financeiro é invisível para o Vendas. O Vendas é invisível para Visitantes.

## 2. Integridade de Dados

- **Use Foreign Keys para tudo.** Não permita entidades órfãs.
- **Input de Métricas exige Contrato vinculado.** `performance_metrics.contract_id` NOT NULL + FK.

## 3. Design System

| Área | Diretriz |
|------|----------|
| **Site** `app/(site)` | Fidelidade visual ao legado. |
| **App** `app/app` | shadcn/ui padrão. Densidade de informação e usabilidade. |
