// components/PostCard.tsx
import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-44 w-full">
          {post.cover ? (
            <Image src={post.cover} alt={post.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-44 bg-pink-50" />
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[11px] font-medium">
                {post.tag ?? "Mẹ & Bé"}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}