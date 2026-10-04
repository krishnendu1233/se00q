"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SetupProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch the logged-in user's ID when the page loads
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else router.push("/login"); // Kick back to login if not authenticated
    };
    getUser();
  }, [router]);

  const handleProfileCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);

    // Enforce the @ symbol for usernames as per your wireframe
    const formattedUsername = username.startsWith("@") ? username : `@${username}`;

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username: formattedUsername,
      primary_platform: platform,
    });

    if (error) {
      console.error(error);
      alert("Error creating profile. Username might be taken.");
      setLoading(false);
    } else {
      router.push("/feed");
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold text-cyan-400 mb-6">Set up a profile</h1>
      
      <form onSubmit={handleProfileCreate} className="space-y-6">
        
        {/* Optional Image Upload Placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center text-zinc-500 text-xs">
            Image
          </div>
          <span className="text-xs text-zinc-500">Profile Image (Optional)</span>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Username</label>
          <input 
            type="text" 
            placeholder="@mrbbbcreator"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">You primarily create at?</label>
          <select 
            value={platform} 
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none"
          >
            <option value="YT">YouTube (YT)</option>
            <option value="IG">Instagram (ins)</option>
            <option value="X">X (Twitter)</option>
            <option value="IN">LinkedIn (in)</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={loading || !userId}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2.5 px-4 rounded transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
