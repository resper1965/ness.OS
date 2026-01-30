import { getOpenJobs } from "@/app/actions/jobs-public";
import Link from "next/link";

export default async function CarreirasPage() {
  const jobs = await getOpenJobs();

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-white">Carreiras</h1>
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((j) => (
            <Link
              key={j.id}
              href={`/carreiras/${j.slug}/candidatar`}
              className="block rounded-lg border border-slate-700 p-6 hover:bg-slate-800 hover:border-ness/50 transition-colors"
            >
              <h2 className="font-semibold text-lg text-white">{j.title}</h2>
              {j.department && <p className="text-sm text-slate-400">{j.department}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-8 text-center">
          <p className="text-slate-400">Nenhuma vaga aberta no momento.</p>
          <p className="text-slate-500 text-sm mt-2">
            Acompanhe nosso site ou entre em contato para enviar seu currículo em nosso banco de talentos.
          </p>
        </div>
      )}
    </section>
  );
}
