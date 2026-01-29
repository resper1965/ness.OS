'use client'

import { useEffect, useState } from 'react'
import { createClient, Contrato, Receita, Despesa, Rentabilidade, Alerta } from '@/lib/supabase'

const supabase = createClient()

// Hook para contratos
export function useContratos() {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContratos() {
      try {
        const { data, error } = await supabase
          .from('fin.contratos')
          .select(`
            *,
            cliente:fin.clientes(*)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error
        setContratos(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchContratos()
  }, [])

  return { contratos, loading, error }
}

// Hook para rentabilidade
export function useRentabilidade(periodo?: string) {
  const [data, setData] = useState<Rentabilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRentabilidade() {
      try {
        let query = supabase
          .from('fin.rentabilidade')
          .select(`
            *,
            contrato:fin.contratos(
              *,
              cliente:fin.clientes(*)
            )
          `)

        if (periodo) {
          query = query.eq('periodo', periodo)
        }

        const { data, error } = await query.order('rentabilidade_percent', { ascending: false })

        if (error) throw error
        setData(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRentabilidade()
  }, [periodo])

  return { rentabilidade: data, loading, error }
}

// Hook para alertas
export function useAlertas(apenasNaoLidos = true) {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAlertas() {
      try {
        let query = supabase
          .from('fin.alertas')
          .select('*')
          .order('created_at', { ascending: false })

        if (apenasNaoLidos) {
          query = query.eq('lido', false)
        }

        const { data, error } = await query

        if (error) throw error
        setAlertas(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAlertas()
  }, [apenasNaoLidos])

  const marcarComoLido = async (id: string) => {
    const { error } = await supabase
      .from('fin.alertas')
      .update({ lido: true })
      .eq('id', id)

    if (!error) {
      setAlertas(prev => prev.map(a => a.id === id ? { ...a, lido: true } : a))
    }
  }

  return { alertas, loading, error, marcarComoLido }
}

// Hook para KPIs do dashboard
export function useDashboardKPIs() {
  const [kpis, setKpis] = useState({
    receitaMensal: 0,
    margemMedia: 0,
    contratosAtivos: 0,
    alertasPendentes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchKPIs() {
      try {
        // Contratos ativos
        const { count: contratosAtivos } = await supabase
          .from('fin.contratos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ATIVO')

        // Alertas pendentes
        const { count: alertasPendentes } = await supabase
          .from('fin.alertas')
          .select('*', { count: 'exact', head: true })
          .eq('lido', false)

        // Receita do mês atual
        const inicioMes = new Date()
        inicioMes.setDate(1)
        const { data: receitas } = await supabase
          .from('fin.receitas')
          .select('valor_recebido')
          .gte('data_pagamento', inicioMes.toISOString().split('T')[0])
          .eq('status', 'RECEBIDO')

        const receitaMensal = receitas?.reduce((acc, r) => acc + (r.valor_recebido || 0), 0) || 0

        // Margem média
        const { data: rentabilidades } = await supabase
          .from('fin.rentabilidade')
          .select('rentabilidade_percent')

        const margemMedia = rentabilidades?.length 
          ? rentabilidades.reduce((acc, r) => acc + r.rentabilidade_percent, 0) / rentabilidades.length
          : 0

        setKpis({
          receitaMensal,
          margemMedia,
          contratosAtivos: contratosAtivos || 0,
          alertasPendentes: alertasPendentes || 0,
        })
      } catch (err) {
        console.error('Erro ao buscar KPIs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchKPIs()
  }, [])

  return { kpis, loading }
}

// Hook para fluxo de caixa (receitas x despesas)
export function useFluxoCaixa(meses = 6) {
  const [data, setData] = useState<{ mes: string; receita: number; despesa: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFluxo() {
      try {
        const resultado: { mes: string; receita: number; despesa: number }[] = []
        
        for (let i = meses - 1; i >= 0; i--) {
          const data = new Date()
          data.setMonth(data.getMonth() - i)
          const ano = data.getFullYear()
          const mes = data.getMonth() + 1
          
          const inicioMes = `${ano}-${String(mes).padStart(2, '0')}-01`
          const fimMes = new Date(ano, mes, 0).toISOString().split('T')[0]

          // Receitas do mês
          const { data: receitas } = await supabase
            .from('fin.receitas')
            .select('valor_recebido')
            .gte('data_pagamento', inicioMes)
            .lte('data_pagamento', fimMes)
            .eq('status', 'RECEBIDO')

          // Despesas do mês
          const { data: despesas } = await supabase
            .from('fin.despesas')
            .select('valor_pago')
            .gte('data_pagamento', inicioMes)
            .lte('data_pagamento', fimMes)
            .eq('status', 'PAGO')

          resultado.push({
            mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
            receita: receitas?.reduce((acc, r) => acc + (r.valor_recebido || 0), 0) || 0,
            despesa: despesas?.reduce((acc, d) => acc + (d.valor_pago || 0), 0) || 0,
          })
        }

        setData(resultado)
      } catch (err) {
        console.error('Erro ao buscar fluxo:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFluxo()
  }, [meses])

  return { fluxoCaixa: data, loading }
}

// Hook para sincronização com Omie
export function useSyncOmie() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Busca última sincronização
    async function fetchLastSync() {
      const { data } = await supabase
        .from('fin.sync_log')
        .select('finished_at')
        .eq('status', 'completed')
        .order('finished_at', { ascending: false })
        .limit(1)
        .single()

      if (data?.finished_at) {
        setLastSync(new Date(data.finished_at))
      }
    }
    fetchLastSync()
  }, [])

  const triggerSync = async (tipos?: string[]) => {
    setSyncing(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-omie`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tipos }),
        }
      )

      if (!response.ok) {
        throw new Error('Falha na sincronização')
      }

      setLastSync(new Date())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSyncing(false)
    }
  }

  return { triggerSync, syncing, lastSync, error }
}
