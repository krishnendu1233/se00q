import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorActions from "@/components/AuthorActions";

export default async function AnalysisView({
  params,
}: {
  params: Promise<{ id: string }>; // 1. Wrap in a Promise
}) {
  // 2. Await the params before using them
  const resolvedParams = await params;
  
  // 3. Use the resolved ID in your query
  const { data: post, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  // TEMPORARY DEBUGGING: Show the error directly on the screen
 // if (error) {
 //   return (
 //     <div className="max-w-3xl mx-auto px-4 py-20 text-center">
 //       <h2 className="text-red-400 font-bold text-xl mb-2">Database Error!</h2>
 //       <p className="text-zinc-400">Code: {error.code}</p>
 //       <p className="text-zinc-400">Message: {error.message}</p>
 //     </div>
 //   );
 // }

  if (!post) {
    notFound(); 
  }
  // fetch the author's profile using the user_id from the post
  const { data: author } = await supabase
    .from("profiles")
    .select("username, first_name, last_name")
    .eq("id", post.user_id)
    .single();

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
 
  return (
    <article className="max-w-3xl mx-auto px-4 py-6">
      {/* Updated Back Navigation to point to /feed */}
      <Link 
        href="/feed" 
        className="inline-flex items-center text-sm text-zinc-400 hover:text-cyan-400 transition-colors mb-8"
      >
        <span className="mr-2">←</span> Back to feed
      </Link>
      {/* This will only show up if the current user is the author */}
        <AuthorActions authorId={post.user_id} postId={post.id} />
      </div>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="px-2.5 py-1 rounded-sm text-xs font-bold bg-cyan-900/40 text-cyan-400 uppercase tracking-wider border border-cyan-800/50">
            {post.platform}
          </span>
          <span className="px-2.5 py-1 rounded-sm text-xs bg-zinc-800 text-zinc-300 uppercase tracking-wider border border-zinc-700">
            {post.content_type.replace("_", " ")}
          </span>
          <span className="text-sm text-zinc-500 ml-auto">{date}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
          {post.title || post.topic}
        </h1>
        
        {/* NEW: Display the Author */}
        {author && (
          <p className="text-sm text-zinc-400 mb-6">
            Analyzed by <span className="text-cyan-400 font-medium">{author.first_name} {author.last_name}</span> <span className="font-mono text-xs opacity-70">({author.username})</span>
          </p>
        )}

      {/* Header Section */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="px-2.5 py-1 rounded-sm text-xs font-bold bg-cyan-900/40 text-cyan-400 uppercase tracking-wider border border-cyan-800/50">
            {post.platform}
          </span>
          <span className="px-2.5 py-1 rounded-sm text-xs bg-zinc-800 text-zinc-300 uppercase tracking-wider border border-zinc-700">
            {post.content_type.replace("_", " ")}
          </span>
          <span className="text-sm text-zinc-500 ml-auto">{date}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">
          {post.title || post.topic}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/60">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Creator</span>
            <span className="text-gray-200 font-mono">@{post.actual_creator_username}</span>
          </div>
          {post.views && (
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Views</span>
              <span className="text-gray-200">{post.views}</span>
            </div>
          )}
          {post.upload_date && (
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Upload Date</span>
              <span className="text-gray-200">{post.upload_date}</span>
            </div>
          )}
          <div className="ml-auto">
            <a 
              href={post.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-medium"
            >
              View Original Content ↗
            </a>
          </div>
        </div>
      </header>

      {/* Dynamic Metrics Section */}
      <section className="grid sm:grid-cols-2 gap-4 mb-8">
        {post.duration && (
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
            <h3 className="text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-2">Duration</h3>
            <p className="text-gray-200">{post.duration}</p>
          </div>
        )}
        
        {post.post_count && (
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
            <h3 className="text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-2">Slide Count</h3>
            <p className="text-gray-200">{post.post_count} slides</p>
          </div>
        )}

        {post.hook_notes && (
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 sm:col-span-2">
            <h3 className="text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-2">
              Hook Breakdown {post.content_type === "shorts_reels" ? "(First 3s)" : "(First 30s-1m)"}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {post.hook_notes}
            </p>
          </div>
        )}

        {post.caption && (
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 sm:col-span-2">
            <h3 className="text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-2">Caption Analysis</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {post.caption}
            </p>
          </div>
        )}
      </section>

      {/* Core Notes Section */}
      <section className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
        <h3 className="text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-4">General Notes & Takeaways</h3>
        <div className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {post.general_notes}
        </div>
      </section>
    </article>
  );
}
