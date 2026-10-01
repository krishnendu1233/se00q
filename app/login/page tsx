"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isSignUp) {
      // Create new account
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        // As per your wireframe, new users go straight to the setup page
        router.push("/setup"); 
      }
    } else {
      // Login existing user
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold text-cyan-400 mb-2">Welcome Back</h1>
      <p className="text-sm text-zinc-500 mb-6">Explains the need and solution to the user.</p>

      {errorMsg && <p className="text-red-400 text-xs mb-4">{errorMsg}</p>}

      <form className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-cyan-500 outline-none transition-colors"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={(e) => handleAuth(e, false)}
            disabled={loading}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-gray-200 font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            Log In
          </button>
          <button 
            onClick={(e) => handleAuth(e, true)}
            disabled={loading}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
