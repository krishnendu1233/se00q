"use client";

import { useState } from "react";
import SearchForm from "@/components/format-filterer/SearchForm";
import Dashboard from "@/components/format-filterer/Dashboard";
import Footer from "@/components/format-filterer/Footer";

export default function FormatFiltererPage() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/proxy/filterer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: handle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Analysis failed.");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setHandle("");
    setError("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-mono">
      <main className="max-w-5xl w-full mx-auto p-6 flex-1">
        {!result ? (
          <SearchForm 
            handle={handle} 
            setHandle={setHandle} 
            onAnalyze={handleAnalyze} 
            loading={loading} 
            error={error} 
          />
        ) : (
          <Dashboard 
            result={result} 
            onReset={handleReset} 
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
