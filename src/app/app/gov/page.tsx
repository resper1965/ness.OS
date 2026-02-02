import Link from 'next/link';

export default function GovPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">ness.GOV</h1>
      <p className="text-slate-400 mb-8">Políticas e rastreabilidade.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/app/gov/politicas" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50">
          <h2 className="font-semibold text-white mb-1">Políticas</h2>
        </Link>
        <Link href="/app/gov/aceites" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50">
          <h2 className="font-semibold text-white mb-1">Aceites</h2>
        </Link>
      </div>
    </div>
  );
}
