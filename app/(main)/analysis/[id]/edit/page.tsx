"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditAnalysis() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form States
  const [platform, setPlatform] = useState("YouTube");
  const [contentType, setContentType] = useState("long_form");
  const [link, setLink] = useState("");
  const [actualCreatorUsername, setActualCreatorUsername] = useState("");
  const [topic, setTopic] = useState("");
  const [views, setViews] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [hookNotes, setHookNotes] = useState("");
  const [postCount, setPostCount] = useState("");
  const [caption, setCaption] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  useEffect(() => {
    const fetchPostAndUser = async () => {
      // 1. Get logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      // 2. Fetch the specific post
      const { data: post, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !post) {
        alert("Post not found.");
        router.push("/feed");
        return;
      }

      // 3. Security Check: Kick them out if they aren't the author
      if (post.user_id !== user.id) {
        alert("You do not have permission to edit this post.");
        router.push(`/analysis/${postId}`);
        return;
      }

      // 4. Pre-fill the form with the existing data
      setPlatform(post.platform || "YouTube");
      setContentType(post.content_type || "long_form");
      setLink(post.link || "");
      setActualCreatorUsername(post.actual_creator_username || "");
      setTopic(post.topic || "");
      setViews(post.views || "");
      setUploadDate(post.upload_date || "");
      setTitle(post.title || "");
      setDuration(post.duration || "");
      setHookNotes(post.hook_notes || "");
      setPostCount(post.post_count?.toString() || "");
      setCaption(post.caption || "");
      setGeneralNotes(post.general_notes || "");

      setLoading(false);
    };

    if (postId) fetchPostAndUser();
  }, [postId, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Update the row instead of inserting a new one
    const { error } = await supabase
      .from("analyses")
      .update({
        platform,
        content_type: contentType,
        link,
        actual_creator_username: actualCreatorUsername,
        topic,
        views,
        upload_date: uploadDate || null,
        title,
        duration,
        hook_notes: hookNotes,
        post_count: postCount ? parseInt(postCount) : null,
        caption,
        general_notes: generalNotes,
      })
      .eq("id", postId);

    if (error) {
      console.error(error);
      alert("Failed to update analysis. Please try again.");
      setSaving(false);
    } else {
      router.push(`/analysis/${postId}`);
      router.refresh();
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-500 py-20 text-sm">Loading editor...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Link 
        href={`/analysis/${postId}`} 
        className="inline-flex items-center text-sm text-zinc-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <span className="mr-2">←</span> Cancel Editing
      </Link>

      <form onSubmit={handleUpdate} className="bg-zinc-950 text-gray-200 border border-zinc-800 rounded-lg shadow-2xl p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-6">Edit Analysis</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none">
              <option value="YouTube">YouTube</option>
              <option value="X">X (Twitter)</option>
              <option value="IG">Instagram</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Content Type</label>
            <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none">
              <option value="long_form">Long Form</option>
              <option value="carousel">Carousel</option>
              <option value="shorts_reels">Shorts / Reels</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <input value={link} onChange={(e) => setLink(e.target.value)} required placeholder="Content Link URL" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={actualCreatorUsername} onChange={(e) => setActualCreatorUsername(e.target.value)} required placeholder="Creator Username (@...)" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
            <input value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="Topic / Niche" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={views} onChange={(e) => setViews(e.target.value)} placeholder="Views (e.g., 1.2M)" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
            <input value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} type="date" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm text-gray-400 focus:border-cyan-500 outline-none" />
          </div>
        </div>

        <div className="p-4 border border-zinc-800 rounded bg-zinc-900/30 mb-6 space-y-4">
          <h3 className="text-xs text-cyan-500 font-semibold uppercase tracking-wider mb-2">
            {contentType.replace('_', ' ')} Specifics
          </h3>

          {contentType === "long_form" && (
            <>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video Title" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
              <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (e.g., 12:05)" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
              <textarea value={hookNotes} onChange={(e) => setHookNotes(e.target.value)} placeholder="Notes on First 30s-1m (Hook)..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm h-20 focus:border-cyan-500 outline-none" />
            </>
          )}

          {contentType === "carousel" && (
            <>
              <input value={postCount} onChange={(e) => setPostCount(e.target.value)} type="number" placeholder="Number of Slides/Images" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption Analysis..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm h-20 focus:border-cyan-500 outline-none" />
            </>
          )}

          {contentType === "shorts_reels" && (
            <>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (e.g., 0:45)" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
              <textarea value={hookNotes} onChange={(e) => setHookNotes(e.target.value)} placeholder="Notes on First 3 Seconds (Hook)..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm h-20 focus:border-cyan-500 outline-none" />
            </>
          )}
        </div>

        <textarea value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)} required placeholder="General Analysis & Takeaways..." className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm h-32 mb-6 focus:border-cyan-500 outline-none" />
        
        <button disabled={saving} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2.5 px-4 rounded transition-colors disabled:opacity-50">
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
                 }
      
