"use client";
import { useState } from "react";

export default function FormatFiltererPage() {
  const [handle, setHandle] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    // Notice this calls your local se00q API bridge, NOT filterer.vercel.app
    const response = await fetch('/api/proxy/filterer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel }) // Adjust based on what your backend expects
    });
    
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 mb-4">Format Filterer</h1>
      <p className="mb-6 text-gray-400">Enter a channel handle to extract winning formats.</p>
      
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="e.g. MrBeast" 
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:border-cyan-400 outline-none"
        />
        <button 
          onClick={handleAnalyze}
          className="bg-yellow-400 text-black font-bold px-6 py-3 rounded hover:bg-yellow-500"
        >
          ANALYZE
        </button>
      </div>

      {result && (
        <div className="bg-gray-900 p-4 border border-gray-700 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
      }
