import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function SolucoesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services_catalog")
    .select("id, name, slug, marketing_pitch")
    .eq("is_active", true);

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-white">Nossas Soluções</h1>
      {services && services.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/solucoes/${s.slug}`}
              className="block rounded-lg border border-slate-700 p-6 hover:bg-slate-800 hover:border-ness/50 transition-colors"
            >
              <h2 className="font-semibold text-lg mb-2 text-white">{s.name}</h2>
              <p className="text-sm text-slate-400 line-clamp-2">
                {s.marketing_pitch || "Saiba mais."}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-slate-400">Nenhuma solução publicada.</p>
      )}
    </section>
  );
}
