import { supabase } from "@/lib/supabase";
import FeedItem from "@/components/FeedItem"; // Adjust import path if needed

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.q;

  // 1. Start the base query
  let query = supabase
    .from("analyses")
    .select("*")
    .order("created_at", { ascending: false });

  // 2. If there is a search term, filter the results
  if (searchQuery) {
    // This searches the title, topic, and creator username for the search term (case-insensitive)
    query = query.or(`title.ilike.%${searchQuery}%,topic.ilike.%${searchQuery}%,actual_creator_username.ilike.%${searchQuery}%`);
  }

  const { data: posts, error } = await query;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm text-zinc-400">
            Search results for <span className="text-cyan-400 font-semibold">"{searchQuery}"</span>
          </h2>
          <a href="/feed" className="text-xs text-zinc-500 hover:text-white underline">
            Clear Search
          </a>
        </div>
      )}

      <div className="space-y-2">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <FeedItem key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-20 text-zinc-500">
            No analyses found.
          </div>
        )}
      </div>
    </div>
  );
              }
