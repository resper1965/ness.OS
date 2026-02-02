import Link from "next/link";

type Post = {
  id: string;
  slug: string;
  title: string;
  seo_description: string | null;
  published_at: string | null;
};

type Props = {
  posts: Post[];
  title?: string;
  subtitle?: string;
};

export function HomeBlogSection({
  posts,
  title = "últimas do blog",
  subtitle = "Fique por dentro das novidades em tecnologia, segurança e engenharia.",
}: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
            {title}
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 transition-all duration-300 hover:border-ness/30 hover:bg-slate-900/80"
            >
              <h3 className="text-base font-medium text-white mb-3 group-hover:text-ness transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {post.seo_description || "Leia mais."}
              </p>
              {post.published_at && (
                <p className="text-xs text-slate-500">
                  {new Date(post.published_at).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
              <span className="inline-flex items-center text-ness text-sm font-medium mt-2">
                Ler artigo →
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-md bg-ness px-6 py-3 text-base font-medium text-white hover:bg-ness-600 transition-colors"
          >
            Ver todos os posts
          </Link>
        </div>
      </div>
    </section>
  );
}
