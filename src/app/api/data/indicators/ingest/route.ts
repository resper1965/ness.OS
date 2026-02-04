import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/admin';

const INDICATOR_SOURCES = ['Infra', 'Sec', 'Data', 'Custom'] as const;

/**
 * Ingestão de indicadores (ness.DATA) — chamada por ferramentas externas (Infra, Sec, Data, Custom).
 * Plano: .context/plans/ness-data-modulo-dados.md; PLANO-NESS-OPS-ENGENHARIA-PROCESSOS.md (HI).
 *
 * Autenticação: header x-api-key ou Authorization: Bearer <INGEST_INDICATORS_API_KEY>.
 * Body JSON: { source, contract_id?, metric_type, value, metadata?, period? }
 * source: "Infra" | "Sec" | "Data" | "Custom"
 * period: YYYY-MM-DD (ex.: primeiro dia do mês)
 */
export async function POST(request: Request) {
  const apiKey = process.env.INGEST_INDICATORS_API_KEY;
  const headerKey = request.headers.get('x-api-key');
  const authHeader = request.headers.get('authorization');
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const provided = headerKey ?? bearer;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'INGEST_INDICATORS_API_KEY não configurado.' },
      { status: 500 }
    );
  }

  if (provided !== apiKey) {
    return NextResponse.json(
      { error: 'Não autorizado. Use x-api-key ou Authorization: Bearer <API_KEY>.' },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Body JSON inválido.' },
      { status: 400 }
    );
  }

  const { source, contract_id, metric_type, value, metadata, period } = body as Record<string, unknown>;

  if (!source || typeof source !== 'string' || !INDICATOR_SOURCES.includes(source as (typeof INDICATOR_SOURCES)[number])) {
    return NextResponse.json(
      { error: `source obrigatório e deve ser um de: ${INDICATOR_SOURCES.join(', ')}.` },
      { status: 400 }
    );
  }

  if (!metric_type || typeof metric_type !== 'string' || !metric_type.trim()) {
    return NextResponse.json(
      { error: 'metric_type obrigatório (string).' },
      { status: 400 }
    );
  }

  const numValue = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numValue)) {
    return NextResponse.json(
      { error: 'value obrigatório (número).' },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceRoleClient();
    const { data: row, error } = await supabase
      .from('indicators')
      .insert({
        source,
        contract_id: contract_id && typeof contract_id === 'string' ? contract_id : null,
        metric_type: (metric_type as string).trim(),
        value: numValue,
        metadata: metadata && typeof metadata === 'object' ? metadata : null,
        period: period && typeof period === 'string' ? period : null,
      })
      .select('id, created_at')
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      id: row?.id,
      message: 'Indicador ingerido.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao ingerir.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
