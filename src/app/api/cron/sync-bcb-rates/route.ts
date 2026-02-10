import { NextResponse } from 'next/server';
import { syncBcbRatesSnapshot } from '@/app/actions/data';

/**
 * Cron: sincroniza snapshot BCB (dólar PTAX, IPCA, IGP-M) para ontem.
 * Dólar = cotação do dia; IPCA/IGP-M = mês de referência (útil para reajuste).
 * Plano: docs/PLANO-GESTAO-DADOS-PERSISTENCIA.md (Fase 2).
 *
 * Segurança: exige CRON_SECRET.
 * Exemplo vercel.json: "crons": [{ "path": "/api/cron/sync-bcb-rates", "schedule": "0 6 * * *" }]
 * (diário às 06:00 — sync de ontem)
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const headerSecret = request.headers.get('x-cron-secret');

  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET não configurado.' },
      { status: 500 }
    );
  }

  const provided = bearer ?? headerSecret;
  if (provided !== secret) {
    return NextResponse.json(
      { error: 'Não autorizado.' },
      { status: 401 }
    );
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const refDate = yesterday.toISOString().slice(0, 10);

  try {
    const result = await syncBcbRatesSnapshot(refDate);
    if (result.error) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      refDate,
      saved: result.saved ?? 0,
      message: `Snapshot BCB para ${refDate}: ${result.saved ?? 0} registro(s).`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao sincronizar snapshot BCB.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
