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
  // Input State
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<string>("");
  
  // Progress & Status State
  const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "PROCESSING" | "GENERATING" | "DONE" | "ERROR">("IDLE");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<SegmentResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // (i, iii, vi, vii) File Selection, Validation & Immediate Playback
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    // (vi) Warn user: No upload more than 50mb
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File exceeds 50MB limit. Please select a smaller file.");
      return;
    }

    // (vii) Sanitize regex for malicious file inputs (allow only video/audio)
    if (!selectedFile.type.match(/^(video|audio)\/[a-zA-Z0-9-.]+$/)) {
      setError("Invalid file type. Please upload a safe video or audio file.");
      return;
    }

    setFile(selectedFile);
    setVideoUrl(""); // Clear text URL if file is selected
    
    // (iii) Showcase the video file immediately when selected
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  // (v) Function to check all steps and measure total progress
  const getOverallProgress = () => {
    switch (status) {
      case "IDLE": return { percent: 0, text: "Ready" };
      case "UPLOADING": return { percent: uploadProgress * 0.4, text: `Uploading File: ${uploadProgress}%` }; // Upload takes up to 40% of total bar
      case "PROCESSING": return { percent: 60, text: "Backend Engine Processing Audio..." };
      case "GENERATING": return { percent: 85, text: "Generating B-Roll Queries..." };
      case "DONE": return { percent: 100, text: "Complete!" };
      case "ERROR": return { percent: 0, text: "Failed" };
      default: return { percent: 0, text: "" };
    }
  };

  const uploadFileWithProgress = (file: File, uniqueFileName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${supabaseUrl}/storage/v1/object/videos/${uniqueFileName}`;
      
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Authorization", `Bearer ${supabaseAnonKey}`);
      xhr.setRequestHeader("apikey", supabaseAnonKey);
      xhr.setRequestHeader("Content-Type", file.type);
      
      // (ii) Measure the progress of upload
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error("XHR Network Error during upload."));
      xhr.send(file);
    });
  };

  const startProcess = async () => {
    if ((!file && !videoUrl) || !timestamps) {
      setError("Please provide a video file/URL and timestamps.");
      return;
    }
    
    setStatus("UPLOADING");
    setUploadProgress(0);
    setError(null);
    
    try {
      let finalVideoUrl = videoUrl;

      // If a local file is provided, upload to Supabase first using XHR for progress
      if (file) {
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        await uploadFileWithProgress(file, uniqueFileName);
        
        const { data: urlData } = supabase.storage.from("videos").getPublicUrl(uniqueFileName);
        finalVideoUrl = urlData.publicUrl;
      }
      
      // Push URL to proxy
      const uploadData = new FormData();
      uploadData.append("video_url", finalVideoUrl);
      
      const uploadRes = await fetch("/api/proxy/broll/upload", {
        method: "POST",
        body: uploadData
      });
      const uploadResult = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadResult.error || "Backend upload initialization failed");
      
      setFileName(uploadResult.file_name);
      setStatus("PROCESSING");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred during upload.");
      setStatus("ERROR");
    }
  };

  // Poll for Processing Status
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
            setError("Video processing failed in the backend engine.");
          }
        } catch {
          clearInterval(interval);
          setStatus("ERROR");
          setError("Failed to check video processing status.");
        }
      }, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
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
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred during generation.");
      setStatus("ERROR");
    }
  };

  const currentProgress = getOverallProgress();
  const isBusy = ["UPLOADING", "PROCESSING", "GENERATING"].includes(status);

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <header className="border-b border-gray-800 pb-6 mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            B-Roll Suggester
          </h1>
          <p className="text-gray-400 text-sm mt-2">Upload or paste a URL to generate contextual B-roll</p>
        </header>

        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Select Video</label>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold py-3 px-6 transition-colors rounded"
              >
                Browse File
              </button>
              
              {/* (i, vi, vii) File Browser restricted to Video/Audio */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                className="hidden" 
                accept="video/*,audio/*" 
              />
              
              <input 
                type="text" 
                placeholder="Or paste public video URL..." 
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  if (file) { setFile(null); setPreviewUrl(null); }
                }}
                className="flex-1 bg-[#111] border border-gray-700 rounded text-white p-3 text-sm focus:outline-none focus:border-green-400 transition-colors"
                disabled={!!file}
              />
            </div>
            {file && (
              <p className="text-xs text-green-400 mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* (iii) Showcase the video file immediately when selected */}
          {previewUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-800 bg-black mt-4">
              <video src={previewUrl} controls className="w-full max-h-64 object-contain" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Timestamps (e.g. 3-7, 12-18)</label>
            <input 
              type="text" 
              placeholder="3-7, 12-20" 
              value={timestamps}
              onChange={(e) => setTimestamps(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 rounded text-white p-3 text-sm focus:outline-none focus:border-green-400 transition-colors"
            />
          </div>

          {error && (
            <div className="border border-red-900 bg-red-950/30 text-red-400 p-4 rounded text-sm">
              {error}
            </div>
          )}

          {/* (iv) Analyse video button should be green too */}
          <button 
            type="button"
            onClick={startProcess}
            disabled={isBusy}
            className="w-full bg-green-500 hover:bg-green-400 text-black rounded font-black py-3 px-4 uppercase text-sm tracking-wide disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            {isBusy ? `Processing: ${status}...` : "Analyze Video"}
          </button>
        </div>

        {/* (i, ii, v) Upload Progress & Step Tracker */}
        {status !== "IDLE" && (
          <div className="p-6 bg-[#0a0a0a] rounded-lg border border-gray-800">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-bold text-green-400">{currentProgress.text}</span>
              <span className="text-xs text-gray-500 font-mono">{currentProgress.percent}%</span>
            </div>
            <div className="w-full bg-[#111] rounded-full h-3 overflow-hidden border border-gray-800">
              <div 
                className="bg-green-500 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,197,94,0.8)]" 
                style={{ width: `${currentProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {status === "DONE" && results.length > 0 && (
          <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-green-400 text-xl font-bold border-b border-gray-800 pb-2">Analysis Results</h2>
            
            {results.map((segment, idx) => (
              <div key={idx} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-lg">
                <div className="inline-block bg-green-500 text-black px-2 py-1 rounded text-xs font-black mb-4 uppercase">
                  Timestamp: {segment.timestamp}s
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  {segment.queries.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-4">
                      <p className="text-gray-300 text-sm font-mono bg-black p-3 rounded border border-gray-800">
                        <span className="text-green-500">&gt;</span> {q.query}
                      </p>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700">
                        {q.videos.map((vid, vIdx) => (
                          <div key={vIdx} className="relative group shrink-0 w-48 rounded overflow-hidden border-2 border-gray-800 hover:border-green-400 transition-colors">
                            <img src={vid.preview} alt="Video preview" className="h-32 w-full object-cover" />
                            <a 
                              href={vid.download_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-black text-green-400 transition-opacity backdrop-blur-sm"
                            >
                              GET VIDEO
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
            
