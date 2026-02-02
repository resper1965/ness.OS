import Link from 'next/link';

export default function JurPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">ness.JUR</h1>
      <p className="text-slate-400 mb-8">Análise de risco e conformidade.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/app/jur/risco" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50">
          <h2 className="font-semibold text-white mb-1">Análise de Risco</h2>
          <p className="text-sm text-slate-400">Analise minutas com IA.</p>
        </Link>
        <Link href="/app/jur/conformidade" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50">
          <h2 className="font-semibold text-white mb-1">Conformidade</h2>
          <p className="text-sm text-slate-400">LGPD, Marco Civil.</p>
        </Link>
      </div>
    </div>
  );
}
