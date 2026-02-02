import { getPublishedCases } from '@/app/actions/cases-public';
import Link from 'next/link';

export default async function CasosPage() {
  const cases = await getPublishedCases();

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 text-white">Casos de Sucesso</h1>
      <p className="text-slate-400 mb-8">
        Conheça projetos em que ajudamos nossos clientes a alcançar resultados.
      </p>
      {cases.length > 0 ? (
        <div className="space-y-4">
          {cases.map((c) => (
            <Link
              key={c.id}
              href={`/casos/${c.slug}`}
              className="block rounded-lg border border-slate-700 p-6 hover:bg-slate-800 hover:border-ness/50 transition-colors"
            >
              <h2 className="font-semibold text-lg text-white">{c.title}</h2>
              {c.summary && <p className="text-sm text-slate-400 mt-2">{c.summary}</p>}
              <p className="text-xs text-slate-500 mt-2">
                {new Date(c.created_at).toLocaleDateString('pt-BR')}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-8 text-center">
          <p className="text-slate-400">Nenhum caso publicado no momento.</p>
        </div>
      )}
    </section>
  );
}
