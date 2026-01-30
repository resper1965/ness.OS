// ============================================
// ness.OS - Edge Function: Sync Omie
// supabase/functions/sync-omie/index.ts
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configuração Omie
const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY')!
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET')!
const OMIE_BASE_URL = 'https://app.omie.com.br/api/v1'

// Cliente Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================
// Funções de chamada à API Omie
// ============================================

interface OmieRequest {
  call: string
  param: any[]
}

async function callOmie(endpoint: string, request: OmieRequest): Promise<any> {
  const response = await fetch(`${OMIE_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_key: OMIE_APP_KEY,
      app_secret: OMIE_APP_SECRET,
      ...request
    })
  })
  
  if (!response.ok) {
    throw new Error(`Omie API error: ${response.status}`)
  }
  
  return response.json()
}

// ============================================
// Sync Clientes
// ============================================

async function syncClientes(): Promise<{ processados: number, erros: number }> {
  let pagina = 1
  let totalProcessados = 0
  let totalErros = 0
  let continuar = true
  
  while (continuar) {
    try {
      const response = await callOmie('/geral/clientes/', {
        call: 'ListarClientes',
        param: [{
          pagina,
          registros_por_pagina: 100,
          apenas_importado_api: 'N'
        }]
      })
      
      const clientes = response.clientes_cadastro || []
      
      for (const cliente of clientes) {
        try {
          const { error } = await supabase
            .from('fin.clientes')
            .upsert({
              omie_id: cliente.codigo_cliente_omie,
              codigo_integracao: cliente.codigo_cliente_integracao,
              razao_social: cliente.razao_social,
              nome_fantasia: cliente.nome_fantasia,
              cnpj_cpf: cliente.cnpj_cpf,
              email: cliente.email,
              telefone: cliente.telefone1_numero,
              tags: cliente.tags?.map((t: any) => t.tag) || [],
              ativo: cliente.inativo !== 'S',
              metadata: {
                endereco: cliente.endereco,
                cidade: cliente.cidade,
                estado: cliente.estado,
                cep: cliente.cep
              },
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'omie_id'
            })
          
          if (error) throw error
          totalProcessados++
        } catch (e) {
          console.error(`Erro ao processar cliente ${cliente.codigo_cliente_omie}:`, e)
          totalErros++
        }
      }
      
      continuar = pagina < response.total_de_paginas
      pagina++
    } catch (e) {
      console.error('Erro ao listar clientes:', e)
      continuar = false
    }
  }
  
  return { processados: totalProcessados, erros: totalErros }
}

// ============================================
// Sync Contratos
// ============================================

async function syncContratos(): Promise<{ processados: number, erros: number }> {
  let pagina = 1
  let totalProcessados = 0
  let totalErros = 0
  let continuar = true
  
  while (continuar) {
    try {
      const response = await callOmie('/servicos/contrato/', {
        call: 'ListarContratos',
        param: [{
          pagina,
          registros_por_pagina: 100,
          apenas_importado_api: 'N'
        }]
      })
      
      const contratos = response.contratoCadastro || []
      
      for (const contrato of contratos) {
        try {
          // Buscar cliente_id pelo omie_id
          const { data: cliente } = await supabase
            .from('fin.clientes')
            .select('id')
            .eq('omie_id', contrato.cabecalho.nCodCli)
            .single()
          
          const { error } = await supabase
            .from('fin.contratos')
            .upsert({
              omie_id: contrato.cabecalho.nCodCtr,
              codigo_integracao: contrato.cabecalho.cCodIntCtr,
              cliente_id: cliente?.id,
              numero: contrato.cabecalho.cNumero,
              descricao: contrato.cabecalho.cDescricao,
              valor_mensal: contrato.cabecalho.nValorTotal,
              data_inicio: parseOmieDate(contrato.cabecalho.dDtInicio),
              data_fim: parseOmieDate(contrato.cabecalho.dDtFim),
              data_reajuste: parseOmieDate(contrato.cabecalho.dDtReajuste),
              indice_reajuste: contrato.cabecalho.cCodReajuste || 'IGPM',
              status: mapStatusContrato(contrato.cabecalho.cStatus),
              metadata: {
                itens: contrato.itensContrato,
                obs: contrato.observacoes
              },
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'omie_id'
            })
          
          if (error) throw error
          totalProcessados++
        } catch (e) {
          console.error(`Erro ao processar contrato ${contrato.cabecalho.nCodCtr}:`, e)
          totalErros++
        }
      }
      
      continuar = pagina < response.total_de_paginas
      pagina++
    } catch (e) {
      console.error('Erro ao listar contratos:', e)
      continuar = false
    }
  }
  
  return { processados: totalProcessados, erros: totalErros }
}

// ============================================
// Sync Contas a Receber
// ============================================

async function syncReceitas(): Promise<{ processados: number, erros: number }> {
  let pagina = 1
  let totalProcessados = 0
  let totalErros = 0
  let continuar = true
  
  // Buscar últimos 90 dias
  const dataInicio = new Date()
  dataInicio.setDate(dataInicio.getDate() - 90)
  
  while (continuar) {
    try {
      const response = await callOmie('/financas/contareceber/', {
        call: 'ListarContasReceber',
        param: [{
          pagina,
          registros_por_pagina: 100,
          filtrar_por_data_de: formatOmieDate(dataInicio),
          filtrar_por_data_ate: formatOmieDate(new Date())
        }]
      })
      
      const titulos = response.conta_receber_cadastro || []
      
      for (const titulo of titulos) {
        try {
          // Buscar cliente_id
          const { data: cliente } = await supabase
            .from('fin.clientes')
            .select('id')
            .eq('omie_id', titulo.codigo_cliente_fornecedor)
            .single()
          
          // Tentar vincular ao contrato (se houver projeto/código)
          let contratoId = null
          if (titulo.nCodProjeto) {
            const { data: contrato } = await supabase
              .from('fin.contratos')
              .select('id')
              .eq('cliente_id', cliente?.id)
              .eq('status', 'ATIVO')
              .single()
            contratoId = contrato?.id
          }
          
          const { error } = await supabase
            .from('fin.receitas')
            .upsert({
              omie_id: titulo.codigo_lancamento_omie,
              cliente_id: cliente?.id,
              contrato_id: contratoId,
              categoria_codigo: titulo.codigo_categoria,
              numero_documento: titulo.numero_documento,
              data_emissao: parseOmieDate(titulo.data_emissao),
              data_vencimento: parseOmieDate(titulo.data_vencimento),
              data_pagamento: parseOmieDate(titulo.data_pagamento),
              valor_documento: titulo.valor_documento,
              valor_recebido: titulo.valor_recebido || 0,
              status: mapStatusTitulo(titulo.status_titulo),
              metadata: {
                observacao: titulo.observacao,
                nsu: titulo.nsu,
                id_conta_corrente: titulo.id_conta_corrente
              },
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'omie_id'
            })
          
          if (error) throw error
          totalProcessados++
        } catch (e) {
          console.error(`Erro ao processar receita ${titulo.codigo_lancamento_omie}:`, e)
          totalErros++
        }
      }
      
      continuar = pagina < response.total_de_paginas
      pagina++
    } catch (e) {
      console.error('Erro ao listar receitas:', e)
      continuar = false
    }
  }
  
  return { processados: totalProcessados, erros: totalErros }
}

// ============================================
// Sync Contas a Pagar
// ============================================

async function syncDespesas(): Promise<{ processados: number, erros: number }> {
  let pagina = 1
  let totalProcessados = 0
  let totalErros = 0
  let continuar = true
  
  const dataInicio = new Date()
  dataInicio.setDate(dataInicio.getDate() - 90)
  
  while (continuar) {
    try {
      const response = await callOmie('/financas/contapagar/', {
        call: 'ListarContasPagar',
        param: [{
          pagina,
          registros_por_pagina: 100,
          filtrar_por_data_de: formatOmieDate(dataInicio),
          filtrar_por_data_ate: formatOmieDate(new Date())
        }]
      })
      
      const titulos = response.conta_pagar_cadastro || []
      
      for (const titulo of titulos) {
        try {
          const { error } = await supabase
            .from('fin.despesas')
            .upsert({
              omie_id: titulo.codigo_lancamento_omie,
              fornecedor_nome: titulo.nome_cliente_fornecedor,
              categoria_codigo: titulo.codigo_categoria,
              numero_documento: titulo.numero_documento,
              data_emissao: parseOmieDate(titulo.data_emissao),
              data_vencimento: parseOmieDate(titulo.data_vencimento),
              data_pagamento: parseOmieDate(titulo.data_pagamento),
              valor_documento: titulo.valor_documento,
              valor_pago: titulo.valor_pago || 0,
              status: mapStatusTitulo(titulo.status_titulo),
              metadata: {
                observacao: titulo.observacao,
                id_conta_corrente: titulo.id_conta_corrente
              },
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'omie_id'
            })
          
          if (error) throw error
          totalProcessados++
        } catch (e) {
          console.error(`Erro ao processar despesa ${titulo.codigo_lancamento_omie}:`, e)
          totalErros++
        }
      }
      
      continuar = pagina < response.total_de_paginas
      pagina++
    } catch (e) {
      console.error('Erro ao listar despesas:', e)
      continuar = false
    }
  }
  
  return { processados: totalProcessados, erros: totalErros }
}

// ============================================
// Sync Categorias
// ============================================

async function syncCategorias(): Promise<{ processados: number, erros: number }> {
  let totalProcessados = 0
  let totalErros = 0
  
  try {
    const response = await callOmie('/geral/categorias/', {
      call: 'ListarCategorias',
      param: [{}]
    })
    
    const categorias = response.categoria_cadastro || []
    
    for (const cat of categorias) {
      try {
        const { error } = await supabase
          .from('fin.categorias')
          .upsert({
            codigo: cat.codigo,
            descricao: cat.descricao,
            tipo: cat.tipo === 'R' ? 'R' : 'D',
            natureza: cat.natureza || 'V',
            conta_dre: cat.conta_dre
          }, {
            onConflict: 'codigo'
          })
        
        if (error) throw error
        totalProcessados++
      } catch (e) {
        console.error(`Erro ao processar categoria ${cat.codigo}:`, e)
        totalErros++
      }
    }
  } catch (e) {
    console.error('Erro ao listar categorias:', e)
  }
  
  return { processados: totalProcessados, erros: totalErros }
}

// ============================================
// Helpers
// ============================================

function parseOmieDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null
  // Formato Omie: DD/MM/YYYY
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  return `${parts[2]}-${parts[1]}-${parts[0]}`
}

function formatOmieDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function mapStatusContrato(status: string): string {
  const map: Record<string, string> = {
    '0': 'ATIVO',
    '10': 'ATIVO',
    '20': 'SUSPENSO',
    '50': 'ENCERRADO',
    '90': 'CANCELADO'
  }
  return map[status] || 'ATIVO'
}

function mapStatusTitulo(status: string): string {
  const map: Record<string, string> = {
    'RECEBIDO': 'RECEBIDO',
    'PAGO': 'PAGO',
    'LIQUIDADO': 'RECEBIDO',
    'ABERTO': 'ABERTO',
    'ATRASADO': 'ATRASADO',
    'CANCELADO': 'CANCELADO'
  }
  return map[status] || status
}

// ============================================
// Handler Principal
// ============================================

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  const startTime = Date.now()
  const results: Record<string, any> = {}
  
  try {
    // Verificar autenticação (opcional para cron)
    const authHeader = req.headers.get('Authorization')
    
    // Parsear body para sync específico
    let syncTypes = ['categorias', 'clientes', 'contratos', 'receitas', 'despesas']
    
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      if (body.tipos && Array.isArray(body.tipos)) {
        syncTypes = body.tipos
      }
    }
    
    // Executar syncs
    for (const tipo of syncTypes) {
      const syncStart = Date.now()
      let result = { processados: 0, erros: 0 }
      
      switch (tipo) {
        case 'categorias':
          result = await syncCategorias()
          break
        case 'clientes':
          result = await syncClientes()
          break
        case 'contratos':
          result = await syncContratos()
          break
        case 'receitas':
          result = await syncReceitas()
          break
        case 'despesas':
          result = await syncDespesas()
          break
      }
      
      results[tipo] = {
        ...result,
        duracao_ms: Date.now() - syncStart
      }
      
      // Log no banco
      await supabase.from('fin.sync_log').insert({
        tipo: tipo.toUpperCase(),
        status: result.erros === 0 ? 'SUCESSO' : (result.processados > 0 ? 'PARCIAL' : 'ERRO'),
        registros_processados: result.processados,
        registros_erro: result.erros,
        detalhes: results[tipo],
        iniciado_em: new Date(syncStart).toISOString(),
        finalizado_em: new Date().toISOString()
      })
    }
    
    return new Response(JSON.stringify({
      success: true,
      duracao_total_ms: Date.now() - startTime,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Erro no sync:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
