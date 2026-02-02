import { getPosts } from '@/app/actions/growth';
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getPosts(12);

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4 text-white">Blog</h1>
      <p className="text-slate-400 mb-8 max-w-2xl">
        Artigos, cases e novidades sobre tecnologia, segurança e gestão de operações.
      </p>
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-lg border border-slate-700 p-6 hover:bg-slate-800 hover:border-ness/50 transition-colors"
            >
              <h2 className="font-semibold text-lg mb-2 text-white">{post.title}</h2>
              <p className="text-sm text-slate-400 line-clamp-2">
                {post.seo_description || "Leia mais."}
              </p>
              {post.published_at && (
                <p className="text-xs text-slate-500 mt-4">
                  {new Date(post.published_at).toLocaleDateString("pt-BR")}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-8 text-center">
          <p className="text-slate-400">Nenhum post publicado ainda.</p>
          <p className="text-slate-500 text-sm mt-2">
            Em breve, conteúdo sobre nossos projetos e práticas.
          </p>
        </div>
      )}
    </section>
  );
}
