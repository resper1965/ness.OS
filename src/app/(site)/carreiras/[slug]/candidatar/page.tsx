import { getJobBySlug } from "@/app/actions/jobs-public";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ApplicationForm } from "@/components/site/application-form";

type Props = { params: Promise<{ slug: string }> };

export default async function CandidatarPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  return (
    <section className="container mx-auto px-4 py-16 max-w-2xl">
      <Link href="/carreiras" className="text-sm text-slate-400 hover:text-ness mb-6 block">← Voltar</Link>
      <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
      {job.department && <p className="text-slate-400 mb-8">{job.department}</p>}
      <ApplicationForm jobId={job.id} />
    </section>
  );
}
