"use client";
import { useState, useEffect, useRef } from "react";

export default function BRollSuggester() {
  const [videoUrl, setVideoUrl] = useState("");
  const [timestamps, setTimestamps] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE, UPLOADING, PROCESSING, GENERATING, DONE, ERROR
  const [fileName, setFileName] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState<string | null>(null);


  const fileInputRef = useRef(null);

  const startProcess = async () => {
    if (!videoUrl || !timestamps) {
      setError("Please provide a video URL and timestamps.");
      return;
    }
    
    setStatus("UPLOADING");
    setError(null);
    
    try {
      const uploadData = new FormData();
      uploadData.append("video_url", videoUrl); // Using URL as per your FastAPI backend
      
      const uploadRes = await fetch("/api/proxy/broll/upload", {
        method: "POST",
        body: uploadData
      });
      const uploadResult = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadResult.error || "Upload failed");
      
      setFileName(uploadResult.file_name);
      setStatus("PROCESSING");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setStatus("ERROR");
    }

  };

  useEffect(() => {
    let interval;
    if (status === "PROCESSING" && fileName) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/proxy/broll/status?file_name=${fileName}`);
          const data = await res.json();
          
          if (data.state === "ACTIVE") {
            clearInterval(interval);
            generateBroll(fileName);
          } else if (data.state === "FAILED") {
            clearInterval(interval);
            setStatus("ERROR");
            setError("Video processing failed in the engine.");
          }
        } catch (err) {
          clearInterval(interval);
          setStatus("ERROR");
          setError("Failed to check status.");
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status, fileName]);

  const generateBroll = async (activeFileName) => {
    setStatus("GENERATING");
    try {
      const genData = new FormData();
      genData.append("file_name", activeFileName);
      genData.append("timestamps", timestamps);

      const genRes = await fetch("/api/proxy/broll/generate", {
        method: "POST",
        body: genData
      });
      const genResult = await genRes.json();

      if (!genRes.ok) throw new Error(genResult.error || "Generation failed");

      setResults(genResult.data);
      setStatus("DONE");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setStatus("ERROR");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-cyan-400 text-3xl font-bold tracking-wide">B-Roll Suggester</h1>
          <p className="text-gray-400 text-sm">Provide a video URL and timestamps to extract cinematic concepts.</p>
        </div>

        {/* Input Card */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 space-y-6">
          
          {/* Video Input */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Select Video</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold py-3 px-6 transition-colors duration-200"
              >
                Choose File
              </button>
              <input 
                type="text" 
                placeholder="Or paste Supabase/Public Video URL" 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 bg-[#111] border border-gray-700 text-white p-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <input type="file" ref={fileInputRef} className="hidden" accept="video/*" />
            </div>
          </div>

          {/* Timestamps Input */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Timestamps (e.g. 3-7, 12-18)</label>
            <input 
              type="text" 
              placeholder="e.g. MrBeast, mkbhd" 
              value={timestamps}
              onChange={(e) => setTimestamps(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 text-white p-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Action Button */}
          <button 
            onClick={startProcess}
            disabled={status !== "IDLE" && status !== "ERROR" && status !== "DONE"}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-4 uppercase text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "IDLE" || status === "DONE" || status === "ERROR" 
              ? "Analyze Video" 
              : `Processing: ${status}...`}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="border border-red-900 bg-red-950/30 text-red-400 p-4 rounded text-sm">
            {error}
          </div>
        )}

        {/* Results Output */}
        {status === "DONE" && results.length > 0 && (
          <div className="space-y-8 mt-12">
            <h2 className="text-cyan-400 text-xl border-b border-gray-800 pb-2">Analysis Results</h2>
            
            {results.map((segment, idx) => (
              <div key={idx} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-lg">
                <div className="text-yellow-400 text-sm mb-4">Timestamp: {segment.timestamp}s</div>
                
                <div className="grid grid-cols-1 gap-6">
                  {segment.queries.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-gray-300 text-sm italic border-l-2 border-cyan-500 pl-3">
                        "{q.query}"
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                        {q.videos.map((vid, vIdx) => (
                          <div key={vIdx} className="relative group shrink-0">
                            <img 
                              src={vid.preview} 
                              alt="B-roll preview" 
                              className="h-28 w-auto object-cover rounded border border-gray-700 group-hover:border-cyan-400 transition-colors" 
                            />
                            <a 
                              href={vid.download_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold text-white transition-opacity"
                            >
                              DOWNLOAD
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
