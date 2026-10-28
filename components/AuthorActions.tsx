"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AuthorActions({ authorId, postId }: { authorId: string, postId: string }) {
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // If a user is logged in and their ID matches the post's user_id, they are the author
      if (user && user.id === authorId) {
        setIsAuthor(true);
      }
    };
    checkUser();
  }, [authorId]);

  // Hide the buttons entirely if they aren't the author
  if (!isAuthor) return null;

  return (
    <div className="flex gap-2 ml-auto">
      <Link 
        href={`/analysis/${postId}/edit`} 
        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded transition-colors"
      >
        Edit
      </Link>
    </div>
  );
}
