"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfileForm({ userId, initialProfile }: { userId: string, initialProfile: any }) {
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState(initialProfile?.username || "");
  const [firstName, setFirstName] = useState(initialProfile?.first_name || "");
  const [lastName, setLastName] = useState(initialProfile?.last_name || "");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ username, first_name: firstName, last_name: lastName })
      .eq("id", userId);

    if (error) alert("Error saving profile: " + error.message);
    else alert("Profile updated successfully!");
    
    setSaving(false);
  };

  return (
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
            <label className="block text-xs text-gray-400 mb-1">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm disabled:opacity-50">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
          }
