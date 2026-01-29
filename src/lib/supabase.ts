import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Tipos das tabelas (baseado no schema)
export interface Cliente {
  id: string
  omie_id: number
  razao_social: string
  nome_fantasia?: string
  cnpj_cpf?: string
  email?: string
  tags?: string[]
  ativo: boolean
}

export interface Contrato {
  id: string
  omie_id: number
  cliente_id: string
  numero?: string
  descricao?: string
  valor_mensal: number
  data_inicio: string
  data_fim?: string
  data_reajuste?: string
  indice_reajuste: string
  status: 'ATIVO' | 'SUSPENSO' | 'ENCERRADO'
  cliente?: Cliente
}

export interface Receita {
  id: string
  omie_id: number
  cliente_id?: string
  contrato_id?: string
  numero_documento?: string
  data_vencimento: string
  data_pagamento?: string
  valor_documento: number
  valor_recebido: number
  status: 'ABERTO' | 'RECEBIDO' | 'ATRASADO' | 'CANCELADO'
}

export interface Despesa {
  id: string
  omie_id: number
  fornecedor_nome?: string
  categoria_codigo?: string
  data_vencimento: string
  data_pagamento?: string
  valor_documento: number
  valor_pago: number
  status: 'ABERTO' | 'PAGO' | 'ATRASADO' | 'CANCELADO'
}

export interface Rentabilidade {
  id: string
  contrato_id: string
  periodo: string
  receita_total: number
  custo_direto: number
  overhead: number
  impostos: number
  margem_liquida: number
  rentabilidade_percent: number
}

export interface Alerta {
  id: string
  tipo: string
  contrato_id?: string
  cliente_id?: string
  mensagem: string
  dados?: Record<string, any>
  lido: boolean
  created_at: string
}
