"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Redirects user to the login page after verifying email
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else if (data?.user?.identities?.length === 0) {
      setErrorMsg("An account with this email already exists. Try logging in.");
    } else {
      setEmailSent(true);
    }
    
    setLoading(false);
  };

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
            Click the link in the email to activate your account, then log in.
          </p>
          <button
            onClick={() => setEmailSent(false)}
            className="text-xs text-zinc-400 hover:text-white underline pt-2 block mx-auto transition-colors"
          >
            Wrong email? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2 font-mono">se00q</h1>
        <p className="text-sm text-zinc-500 mb-6">Create a new workspace account.</p>

        {errorMsg && (
          <p className="text-red-400 text-xs mb-4 bg-red-950/30 p-3 rounded-md border border-red-900/50">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
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
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-gray-200 text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-xs text-zinc-500 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
