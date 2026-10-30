"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase (Ensure these exist in your .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MediaItem {
  id: number;
  preview: string;
  download_url: string;
}

export interface QueryItem {
  query: string;
  images: MediaItem[];
  videos: MediaItem[];
}

export interface SegmentResult {
  timestamp: string;
  queries: QueryItem[];
}

export default function BRollSuggesterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<string>("");
  
  const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "PROCESSING" | "GENERATING" | "DONE" | "ERROR">("IDLE");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [supabasePath, setSupabasePath] = useState<string | null>(null);
  const [results, setResults] = useState<SegmentResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File exceeds 50MB limit.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!selectedFile.type.match(/^(video|audio)\/[a-zA-Z0-9-.]+$/)) {
      setError("Invalid file type.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const getOverallProgress = () => {
    switch (status) {
      case "IDLE": return { percent: 0, text: "Ready" };
      case "UPLOADING": return { percent: uploadProgress * 0.4, text: `Uploading to Supabase: ${uploadProgress}%` };
      case "PROCESSING": return { percent: 60, text: "AI Audio Analysis..." };
      case "GENERATING": return { percent: 85, text: "Finding B-Roll..." };
      case "DONE": return { percent: 100, text: "Complete!" };
      case "ERROR": return { percent: 0, text: "Failed" };
      default: return { percent: 0, text: "" };
    }
  };

  const startProcess = async () => {
    if (!file || !timestamps) {
      setError("Please provide a video file and timestamps.");
      return;
    }
    
    setStatus("UPLOADING");
    setUploadProgress(0);
    setError(null);
    
    try {
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      setSupabasePath(uniqueFileName);
      
      // Upload to Supabase with XHR for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${supabaseUrl}/storage/v1/object/videos/${uniqueFileName}`;
        
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Authorization", `Bearer ${supabaseAnonKey}`);
        xhr.setRequestHeader("apikey", supabaseAnonKey);
        xhr.setRequestHeader("Content-Type", file.type);
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        
        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(file);
      });

      // Get public URL and send to proxy
      const { data: urlData } = supabase.storage.from("videos").getPublicUrl(uniqueFileName);
      
      const uploadData = new FormData();
      uploadData.append("video_url", urlData.publicUrl);
      
      const uploadRes = await fetch("/api/proxy/broll/upload", {
        method: "POST",
        body: uploadData
      });
      const uploadResult = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadResult.error || "Backend upload failed");
      
      setFileName(uploadResult.file_name);
      setStatus("PROCESSING");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setStatus("ERROR");
    }
  };

  // Poll Gemini Status
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
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
            setError("AI Processing failed.");
          }
        } catch {
          clearInterval(interval);
          setStatus("ERROR");
          setError("Status check failed.");
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status, fileName]);

  const generateBroll = async (activeFileName: string) => {
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

      setResults(genResult.data || []);
      setStatus("DONE");

      // CLEANUP: Remove video from Supabase immediately after success
      if (supabasePath) {
        await supabase.storage.from("videos").remove([supabasePath]);
        setSupabasePath(null);
      }
    } catch (err: any) {
      setError(err.message || "Generation error");
      setStatus("ERROR");
    }
  };

  const currentProgress = getOverallProgress();
  const isBusy = ["UPLOADING", "PROCESSING", "GENERATING"].includes(status);

  return (
    <div className="p-6 sm:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <header className="border-b border-gray-800 pb-6 mb-8">
          <h1 className="text-3xl font-mono font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            B-Roll Suggester
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-mono">Upload a video to generate contextual B-roll</p>
        </header>

        <div className="bg-black/50 backdrop-blur border border-[#39ff14]/30 rounded-lg p-6 space-y-6 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
          <div className="space-y-2">
            <label className="text-xs text-[#39ff14] font-mono uppercase tracking-wider">Select Video</label>
            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-transparent border-2 border-[#39ff14] hover:bg-[#39ff14] hover:text-black text-[#39ff14] font-mono text-sm font-bold py-3 px-6 transition-all rounded w-full sm:w-auto"
              >
                OPEN FILE BROWSER
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                className="hidden" 
                accept="video/*,audio/*" 
              />
            </div>
            {file && (
              <p className="text-xs text-[#39ff14] mt-2 font-mono">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {previewUrl && (
            <div className="rounded-lg overflow-hidden border border-[#39ff14]/50 bg-black mt-4">
              <video src={previewUrl} controls className="w-full max-h-64 object-contain" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs text-[#39ff14] font-mono uppercase tracking-wider">Timestamps (e.g. 3-7, 12-18)</label>
            <input 
              type="text" 
              placeholder="3-7, 12-20" 
              value={timestamps}
              onChange={(e) => setTimestamps(e.target.value)}
              className="w-full bg-black/80 border border-[#39ff14]/50 rounded text-[#39ff14] placeholder-[#39ff14]/30 p-3 text-sm font-mono focus:outline-none focus:border-[#39ff14] focus:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all"
            />
          </div>

          {error && (
            <div className="border border-red-900 bg-red-950/30 text-red-400 p-4 rounded text-sm font-mono">
              {error}
            </div>
          )}

          <button 
            type="button"
            onClick={startProcess}
            disabled={isBusy}
            className="w-full bg-[#39ff14] hover:bg-[#32e011] text-black rounded font-mono font-black py-3 px-4 uppercase text-sm tracking-wide disabled:opacity-50 disabled:hover:shadow-none transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)]"
          >
            {isBusy ? `PROCESSING: ${status}...` : "ANALYZE VIDEO"}
          </button>
        </div>

        {status !== "IDLE" && (
          <div className="p-6 bg-black/50 backdrop-blur rounded-lg border border-[#39ff14]/30">
            <div className="flex justify-between items-end mb-3 font-mono">
              <span className="text-sm font-bold text-[#39ff14]">{currentProgress.text}</span>
              <span className="text-xs text-[#39ff14]/70">{currentProgress.percent}%</span>
            </div>
            <div className="w-full bg-black rounded-full h-3 overflow-hidden border border-[#39ff14]/30">
              <div 
                className="bg-[#39ff14] h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(57,255,20,0.8)]" 
                style={{ width: `${currentProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {status === "DONE" && results.length > 0 && (
          <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-cyan-400 font-mono text-xl font-bold border-b border-cyan-400/30 pb-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
              Analysis Results
            </h2>
            
            {results.map((segment, idx) => (
              <div key={idx} className="bg-black/50 backdrop-blur border border-[#39ff14]/30 p-6 rounded-lg">
                <div className="text-[#39ff14] font-mono text-sm font-bold mb-4 bg-[#39ff14]/10 inline-block px-3 py-1 rounded border border-[#39ff14]/20">
                  TIMESTAMP: {segment.timestamp}s
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {segment.queries.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-cyan-100 text-sm font-mono italic border-l-2 border-cyan-400 pl-3">
                        &ldquo;{q.query}&rdquo;
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#39ff14]/30">
                        {q.videos.map((vid, vIdx) => (
                          <div key={vIdx} className="relative group shrink-0">
                            <img 
                              src={vid.preview} 
                              alt="B-roll preview" 
                              className="h-28 w-auto object-cover rounded border border-[#39ff14]/30 group-hover:border-[#39ff14] group-hover:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all" 
                            />
                            <a 
                              href={vid.download_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-mono font-bold text-[#39ff14] transition-opacity"
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
                  
