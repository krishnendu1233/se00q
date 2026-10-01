import Link from "next/link";
import { AnalysisPost } from "@/types";

export default function FeedItem({ post }: { post: AnalysisPost }) {
  // Format the date
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Display title for long-form, otherwise fallback to topic
  const displayTitle = post.title || post.topic || "Untitled Analysis";

  return (
    <div className="group border-b border-zinc-800/60 py-4 hover:bg-zinc-900/30 transition-colors px-2 sm:px-4 rounded">
      <div className="flex items-start justify-between gap-4">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <Link href={`/analysis/${post.id}`} className="block">
            <h3 className="text-base font-medium text-gray-200 group-hover:text-cyan-400 transition-colors truncate">
              {displayTitle}
            </h3>
          </Link>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
            <span className="text-cyan-500/80 font-mono">@{post.actual_creator_username}</span>
            <span>•</span>
            <span>{post.views ? `${post.views} views` : "Views N/A"}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>

        {/* Badges Area */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-gray-300 uppercase tracking-wider">
            {post.platform}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-gray-400 uppercase tracking-wider">
            {post.content_type.replace("_", " ")}
          </span>
        </div>
        
      </div>
    </div>
  );
}
