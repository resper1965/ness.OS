---
type: doc
name: security
description: Security model and practices
category: reference
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Segurança

## Camadas

| Camada | Implementação |
|--------|----------------|
| Autenticação | Supabase Auth (SSO Google/Microsoft) |
| Autorização | RLS (Row Level Security) por schema/perfil |
| Criptografia | TLS em trânsito, AES em repouso |
| Audit | Logs de operações |
| Secrets | Supabase Vault |

## Dados sensíveis

- Dados financeiros e de RH criptografados em trânsito e repouso.  
- Dados de clientes anonimizados em contextos de marketing (casos de sucesso).  
- Aceites (GOV) registrados com IP, user-agent, hash do documento, assinatura.  

## Integrações

- APIs externas (Omie, etc.) via tokens em Vault; não hardcodar secrets.  
- Edge Functions usar `SUPABASE_SERVICE_ROLE_KEY` apenas onde necessário; preferir Auth + RLS para acesso usuário.
