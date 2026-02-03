# Integração Omie ERP — Revisão (Phase R)

**Workflow:** integracao-omie-erp | **Fase PREVC:** R (Review)  
**Data:** 2026-02-03

---

## Code Review (design document)

**Objeto:** [integracao-omie-erp-phase-p-design.md](./integracao-omie-erp-phase-p-design.md)

| Critério | Resultado | Observação |
|----------|-----------|------------|
| Consistência com stack | OK | Server-side, Next.js, Supabase alinhados ao projeto |
| Mapeamento de dados | OK | clients.omie_codigo + match por document bem definido |
| Fluxo de sync | OK | 6 passos claros; erp_sync_log com status running/success/error |
| Reconciliação | OK | Tolerância e período definidos; evolução (erp_receivables) citada |
| Referências | OK | Plano, FIN-CFO, API Omie linkados |

**Sugestões para Phase 2:**
- Garantir idempotência do upsert (clients): usar ON CONFLICT (omie_codigo) ou (document) conforme unique.
- Paginação ListarClientes: tratar página e limite para não estourar timeout em bases grandes.
- erp_sync_log: considerar campo `sync_type` (full | clients_only | receivables_only) para futuras otimizações.

**Veredicto:** Aprovado para implementação (Phase E).

---

## Security Audit (design)

**Objeto:** decisões de segurança no design e plano.

| Item | Status | Observação |
|------|--------|------------|
| Credenciais apenas server-side | OK | OMIE_APP_KEY/SECRET em env; nunca frontend |
| Proteção da rota/action de sync | OK | Role admin/cfo; sessão server-side |
| RLS erp_sync_log | OK | Leitura por roles autorizados; escrita pelo sync |
| Logs sem dados sensíveis | OK | Não logar app_secret; error_message genérico |
| HTTPS Omie | OK | Base URL https |

**Recomendações para Phase 2:**
- Rate limit na rota/action de sync (ex.: 1 sync a cada 5 min por tenant) para evitar abuso.
- Validar que error_message persistido em erp_sync_log não inclua stack trace nem fragmentos de body da API Omie.
- Revisar RLS de `clients` após adicionar omie_codigo: políticas atuais (authenticated) permanecem; sync deve rodar com service role ou com usuário autorizado que já passa RLS.

**Veredicto:** Design aprovado do ponto de vista de segurança; checklist acima para implementação.

---

## Aprovação

Plano **integracao-omie-erp** e artefato de design **integracao-omie-erp-phase-p-design.md** aprovados para avançar à fase **E (Execute)**.
