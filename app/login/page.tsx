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
  const [emailSent, setEmailSent] = useState(false);

  const handleAuth = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/setup`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user?.identities?.length === 0) {
        // Supabase returns an empty identities array if the email already exists
        setErrorMsg("An account with this email already exists. Try logging in.");
      } else {
        setEmailSent(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  };

  // 1. Post-Signup "Check Inbox" Screen
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto text-xl">
            ✉
          </div>
          <h2 className="text-xl font-bold text-gray-100">Check your inbox</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We sent a verification link to <span className="text-cyan-400 font-mono">{email}</span>.
          </p>
          <p className="text-xs text-zinc-500">
            Click the link in the email to activate your account and complete setup.
          </p>
          <button
            onClick={() => setEmailSent(false)}
            className="text-xs text-zinc-400 hover:text-white underline pt-2 block mx-auto transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  // 2. Default Login / Signup Screen
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2 font-mono">se00q</h1>
        <p className="text-sm text-zinc-500 mb-6">Access your workspace.</p>

        {errorMsg && (
          <p className="text-red-400 text-xs mb-4 bg-red-950/30 p-3 rounded-md border border-red-900/50">
            {errorMsg}
          </p>
        )}

        <form className="space-y-4">
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
              onChange={(e) => setEmailSent(false) || setPassword(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={(e) => handleAuth(e, false)}
              disabled={loading}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-gray-200 text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              Log In
            </button>
            <button 
              onClick={(e) => handleAuth(e, true)}
              disabled={loading}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
