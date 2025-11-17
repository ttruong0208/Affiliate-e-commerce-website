// app/blog/[slug]/page.tsx
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  const postsPath = path.join(process.cwd(), "data", "posts.json");
  const raw = fs.readFileSync(postsPath, "utf-8");
  const posts = JSON.parse(raw);
  return posts.map((p: any) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Params) {
  const { slug } = params;
  const postsPath = path.join(process.cwd(), "data", "posts.json");
  let posts: any[] = [];
  try {
    const raw = fs.readFileSync(postsPath, "utf-8");
    posts = JSON.parse(raw);
  } catch (err) {
    posts = [];
  }

  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return <div className="p-8">Bài viết không tìm thấy</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <article className="prose prose-lg prose-pink max-w-none">
        {post.cover && (
          <div className="mb-6 rounded overflow-hidden shadow-sm">
            <Image src={post.cover} alt={post.title} width={1200} height={520} className="object-cover w-full h-64" />
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{post.readTime ?? "≈ 5 phút đọc"}</span>
        </div>

        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>

        {/* CTA */}
        <div className="mt-8 p-4 border rounded-md bg-pink-50">
          <p className="font-medium text-pink-700">Thích bài viết này?</p>
          <div className="mt-3 flex gap-3">
            <Link href="/contact">
              <button className="px-4 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700">Liên hệ tư vấn</button>
            </Link>
            <a href="mailto:hotro@yourdomain" className="px-4 py-2 rounded-md border text-pink-700">Gửi email</a>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Bài viết liên quan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 4)
            .map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="p-3 border rounded hover:shadow-sm">
                <h4 className="text-sm font-medium hover:text-pink-600">{r.title}</h4>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}