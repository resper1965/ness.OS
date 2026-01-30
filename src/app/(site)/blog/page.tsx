import { getPosts } from "@/app/actions/posts";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getPosts(12);

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-white">Blog</h1>
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
        <p className="text-slate-400">Nenhum post publicado.</p>
      )}
    </section>
  );
}
