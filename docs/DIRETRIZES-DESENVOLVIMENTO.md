# Diretrizes de Desenvolvimento ness.OS

> Regras para o Cursor e para desenvolvedores. Mantidas em `.cursor/rules/diretrizes-desenvolvimento.mdc` (always apply).

---

## 0. Branding (ness.)

| Item | Uso correto |
|------|-------------|
| **Plataforma** | ness.OS |
| **Marca** | ness. (com ponto) |
| **Módulos** | ness.GROWTH, ness.OPS, ness.FIN, ness.PEOPLE, ness.JUR, ness.GOV |
| **Evitar** | NESS isolado em textos user-facing |

**Execução autônoma:**
- **BOOOM:** Executa Fases 0–4 → [PLANO-EXECUCAO-AUTONOMA-PENDENCIAS.md](PLANO-EXECUCAO-AUTONOMA-PENDENCIAS.md)
- **EXECUTE FASE 5:** Executa Fases 5–10 → [PLANO-EXECUCAO-FASE-5-FINAL.md](PLANO-EXECUCAO-FASE-5-FINAL.md)

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
