"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SetupProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profile && profile.username) {
        router.push("/feed"); 
      }
    };
    checkUserAndProfile();
  }, [router]);

  const handleProfileCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);

    const formattedUsername = username.startsWith("@") ? username : `@${username}`;

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username: formattedUsername,
      first_name: firstName,
      last_name: lastName,
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
      <h1 className="text-2xl font-bold text-cyan-400 mb-2">Set up a profile</h1>
      
      {/* Notification Banner */}
      <div className="bg-cyan-950/30 border border-cyan-900 text-cyan-200 p-3 rounded-md text-xs mb-6 leading-relaxed">
        <strong>Important:</strong> Please add your names properly. This is the primary way people will recognize your analyses. Do not use random usernames like <span className="font-mono opacity-80">@unhappydonkey68</span>.
      </div>
      
      <form onSubmit={handleProfileCreate} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">First Name</label>
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Jane"
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Last Name</label>
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe (Opt)"
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Username</label>
          <input 
            type="text" 
            placeholder="@yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
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
            <option value="YouTube">YouTube</option>
            <option value="Instagram">Instagram</option>
            <option value="X">X (Twitter)</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="TikTok">TikTok</option>
            <option value="Facebook">Facebook</option>
            <option value="Snapchat">Snapchat</option>
            <option value="Pinterest">Pinterest</option>
            <option value="Reddit">Reddit</option>
            <option value="Threads">Threads</option>
            <option value="Discord">Discord</option>
            <option value="Twitch">Twitch</option>
            
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
