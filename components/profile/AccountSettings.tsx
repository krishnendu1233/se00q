"use client";

import { supabase } from "@/lib/supabase";

export default function AccountSettings({ email }: { email: string }) {
  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/profile`,
    });
    if (error) alert(error.message);
    else alert("Password reset link sent to your email!");
  };

  return (
    <section className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg shadow-xl space-y-4">
      <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-2">Account Settings</h2>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Email Address</label>
        <input type="email" value={email} disabled className="w-full bg-zinc-900/50 border border-zinc-800 rounded p-2 text-sm text-zinc-500 cursor-not-allowed" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Password</label>
        <button onClick={handlePasswordReset} className="text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded transition-colors">
          Send Password Reset Email
        </button>
      </div>
    </section>
  );
}
