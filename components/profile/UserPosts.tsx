import Link from "next/link";

export default function UserPosts({ posts }: { posts: any[] }) {
  return (
    <section className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-2 mb-4">
        Posts ({posts.length})
      </h2>
      
      {posts.length === 0 ? (
        <p className="text-zinc-500 text-sm">You haven't posted any analyses yet.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post, index) => (
            <li key={post.id} className="flex items-center gap-3 p-3 bg-zinc-900 rounded border border-zinc-800 hover:border-cyan-900 transition-colors">
              <span className="text-zinc-600 font-mono text-sm">{index + 1}.</span>
              <Link href={`/analysis/${post.id}`} className="flex-1 text-sm text-gray-200 hover:text-cyan-400 truncate">
                {post.title || post.topic}
              </Link>
              <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 uppercase">
                {post.platform}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
