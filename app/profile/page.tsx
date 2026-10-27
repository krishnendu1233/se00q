"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileForm from "@/components/profile/ProfileForm";
import AccountSettings from "@/components/profile/AccountSettings";
import UserPosts from "@/components/profile/UserPosts";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      setUser(user);

      // Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (profileData) setProfile(profileData);

      // Fetch Posts
      const { data: userPosts } = await supabase
        .from("analyses")
        .select("id, topic, title, platform, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (userPosts) setPosts(userPosts);

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors">
          <span>←</span> Back to Dashboard
        </Link>
      </div>
      
      <ProfileForm userId={user.id} initialProfile={profile} />
      <AccountSettings email={user.email} />
      <UserPosts posts={posts} />
    </div>
  );
}
