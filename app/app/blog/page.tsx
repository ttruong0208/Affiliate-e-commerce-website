// app/blog/page.tsx
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bài viết | Mẹ và Bé",
  description: "Tin tức, hướng dẫn và review sản phẩm cho mẹ & bé."
};

export default async function BlogPage() {
  const postsPath = path.join(process.cwd(), "data", "posts.json");
  let posts: any[] = [];
  try {
    const raw = fs.readFileSync(postsPath, "utf-8");
    posts = JSON.parse(raw);
  } catch (err) {
    posts = [];
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bài viết</h1>
        <p className="mt-2 text-sm text-gray-600">
          Tin tức, hướng dẫn và review sản phẩm cho mẹ & bé — cập nhật thường xuyên.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">Chưa có bài viết nào.</div>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </section>
    </main>
  );
}