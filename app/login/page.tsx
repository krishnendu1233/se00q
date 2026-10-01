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
  const [successMsg, setSuccessMsg] = useState(""); // Added success state

  const handleAuth = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg(""); // Clear previous success messages

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        // Now it uses the success state
        setSuccessMsg("Success! Please check your email for the confirmation link.");
      }
    } else {
      // Login existing user
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        // Route to the (main) folder's feed
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2">Welcome Back</h1>
        <p className="text-sm sm:text-base text-zinc-500 mb-6">Explains the need and solution to the user.</p>

        {/* Error Box (Red) */}
        {errorMsg && (
          <p className="text-red-400 text-sm mb-4 bg-red-950/30 p-3 rounded-md border border-red-900/50">
            {errorMsg}
          </p>
        )}

        {/* Success Box (Emerald Green) */}
        {successMsg && (
          <p className="text-emerald-400 text-sm mb-4 bg-emerald-950/30 p-3 rounded-md border border-emerald-900/50">
            {successMsg}
          </p>
        )}

        <form className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 sm:p-2.5 text-base sm:text-sm focus:border-cyan-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 sm:p-2.5 text-base sm:text-sm focus:border-cyan-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4">
            <button 
              onClick={(e) => handleAuth(e, false)}
              disabled={loading}
              className="w-full sm:flex-1 bg-zinc-800 hover:bg-zinc-700 text-gray-200 font-semibold py-3 sm:py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Log In
            </button>
            <button 
              onClick={(e) => handleAuth(e, true)}
              disabled={loading}
              className="w-full sm:flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 sm:py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
