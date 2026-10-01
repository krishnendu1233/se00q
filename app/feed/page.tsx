import { supabase } from "@/lib/supabase";
import FeedItem from "@/components/FeedItem";
import { AnalysisPost } from "@/types";

export const revalidate = 0; // Ensures the feed is always fresh

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  let posts: AnalysisPost[] = [];
  let errorMsg = null;

  try {
    if (query.trim()) {
      // Use the RPC function for full-text search
      const { data, error } = await supabase.rpc("search_analyses", { query });
      if (error) throw error;
      posts = data || [];
    } else {
      // Default: fetch all posts in reverse chronological order
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      posts = data || [];
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    errorMsg = "Failed to load the feed. Please try again later.";
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Search Header for context when a user searches */}
      {query && (
        <div className="mb-6 pb-4 border-b border-zinc-800">
          <h2 className="text-sm text-gray-400">
            Search results for <span className="text-cyan-400 font-semibold">"{query}"</span>
          </h2>
        </div>
      )}

      {/* Feed Container */}
      <div className="flex flex-col">
        {errorMsg ? (
          <p className="text-red-400 text-sm py-8 text-center">{errorMsg}</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <FeedItem key={post.id} post={post} />
          ))
        ) : (
          <div className="py-12 text-center text-zinc-500 text-sm">
            {query ? "No analyses found matching your search." : "No analyses posted yet. Be the first!"}
          </div>
        )}
      </div>
    </div>
  );
            }
