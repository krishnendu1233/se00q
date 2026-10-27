"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    setErrorMsg(error.message);
    setLoading(false);
    return;
  }

  // 1. Prevent crash if user object is missing
  if (!authData.user) {
    setErrorMsg("Login failed. Please check your credentials or verify your email.");
    setLoading(false);
    return;
  }

  // 2. Fetch profile safely (ignoring the 'no rows' error from .single())
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", authData.user.id)
    .single();

  // 3. Refresh cache before navigation so server components can read the new cookie
  router.refresh();

  // 4. Route based on profile existence
  if (profile?.username) {
    window.location.href = '/dashboard'; 
  } else {
    router.push("/setup"); 
  }
  
  // 5. Ensure the spinner stops
  setLoading(false);
};


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2 font-mono">se00q</h1>
        <p className="text-sm text-zinc-500 mb-6">Welcome back. Log in to your account.</p>

        {errorMsg && (
          <p className="text-red-400 text-xs mb-4 bg-red-950/30 p-3 rounded-md border border-red-900/50">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <p className="text-xs text-zinc-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
