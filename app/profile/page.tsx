"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile Data
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
    
  // Posts Data
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      setUserId(user.id);
      setEmail(user.email || "");

      // Fetch Profile info
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUsername(profile.username || "");
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
             }

      // Fetch User's Posts
      const { data: userPosts } = await supabase
        .from("analyses")
        .select("id, topic, title, platform, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (userPosts) setPosts(userPosts);
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", userId);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
    }
    setSaving(false);
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/profile`,
    });
    if (error) alert(error.message);
    else alert("Password reset link sent to your email!");
  };

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
      
      {/* 1. Profile Details Form */}
      <section className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-bold text-cyan-400 mb-6">Public Profile</h2>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Last Name (Optional)</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>

      {/* 2. Account & Security */}
      <section className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-2">Account Settings</h2>
        
        <div>
          <label className="block text-xs text-gray-400 mb-1">Email Address</label>
          <input type="email" value={email} disabled className="w-full bg-zinc-900/50 border border-zinc-800 rounded p-2 text-sm text-zinc-500 cursor-not-allowed" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Password</label>
          <button onClick={handlePasswordReset} className="text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded transition-colors">
            Send Password Reset Email
          </button>
        </div>
      </section>

      {/* 3. User's Posts */}
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

    </div>
  );
}
