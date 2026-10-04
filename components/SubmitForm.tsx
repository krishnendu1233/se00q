"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SubmitForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState("YouTube");
  const [contentType, setContentType] = useState("long_form");
  const [userId, setUserId] = useState<string | null>(null);

  // Check for authenticated user on load
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        router.push("/login"); // Redirect unauthenticated users
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return; // Prevent submission if somehow not authenticated

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const postData = Object.fromEntries(formData.entries());

    // Insert into Supabase using the real authenticated user ID
    const { error } = await supabase.from("analyses").insert([{
      ...postData,
      platform,
      content_type: contentType,
      user_id: userId 
    }]);

    if (!error) {
      router.push("/feed");
      router.refresh(); // Refresh the main feed to show the new post
    } else {
      console.error(error);
      alert("Failed to post analysis. Please try again.");
      setLoading(false);
    }
  };

  // Prevent rendering the form until we confirm the user is logged in
  if (!userId) {
    return <div className="text-center text-zinc-500 py-20 text-sm">Authenticating...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-zinc-950 text-gray-200 border border-zinc-800 rounded-lg shadow-2xl">
      <h2 className="text-xl font-bold text-cyan-400 mb-6">New Analysis</h2>

      {/* Step 1 & 2: Platform and Content Type */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Platform</label>
          <select 
            value={platform} 
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none"
          >
            <option value="YouTube">YouTube</option>
            <option value="X">X (Twitter)</option>
            <option value="IG">Instagram</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Content Type</label>
          <select 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none"
          >
            <option value="long_form">Long Form</option>
            <option value="carousel">Carousel</option>
            <option value="shorts_reels">Shorts / Reels</option>
          </select>
        </div>
      </div>

      {/* Common Fields */}
      <div className="space-y-4 mb-6">
        <input name="link" required placeholder="Content Link URL" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="actual_creator_username" required placeholder="Creator Username (@...)" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
          <input name="topic" required placeholder="Topic / Niche" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="views" placeholder="Views (e.g., 1.2M)" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
          <input name="upload_date" type="date" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm text-gray-400 focus:border-cyan-500 outline-none" />
        </div>
      </div>

      {/* Dynamic Conditional Fields based on Content Type */}
      <div className="p-4 border border-zinc-800 rounded bg-zinc-900/30 mb-6 space-y-4">
        <h3 className="text-xs text-cyan-500 font-semibold uppercase tracking-wider mb-2">
          {contentType.replace('_', ' ')} Specifics
        </h3>

        {contentType === "long_form" && (
          <>
            <input name="title" placeholder="Video Title" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
            <input name="duration" placeholder="Duration (e.g., 12:05)" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
            <textarea name="hook_notes" placeholder="Notes on First 30s-1m (Hook)..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm h-20 focus:border-cyan-500 outline-none" />
          </>
        )}

        {contentType === "carousel" && (
          <>
            <input name="post_count" type="number" placeholder="Number of Slides/Images" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
            <textarea name="caption" placeholder="Caption Analysis..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm h-20 focus:border-cyan-500 outline-none" />
          </>
        )}

        {contentType === "shorts_reels" && (
          <>
            <input name="duration" placeholder="Duration (e.g., 0:45)" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
            <textarea name="hook_notes" placeholder="Notes on First 3 Seconds (Hook)..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm h-20 focus:border-cyan-500 outline-none" />
          </>
        )}
      </div>

      {/* Final Notes & Submit */}
      <textarea name="general_notes" required placeholder="General Analysis & Takeaways..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm h-32 mb-6 focus:border-cyan-500 outline-none" />
      
      <button disabled={loading} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2.5 px-4 rounded transition-colors disabled:opacity-50">
        {loading ? "Saving..." : "Post Analysis"}
      </button>
    </form>
  );
}
